/**
 * Batch Generation Service
 * Handles batch problem generation from knowledge points
 * Supports difficulty filtering, language selection, and knowledge point selection
 * Supports configurable concurrency for high-performance batch processing
 */

import pLimit from 'p-limit';
import {
  UserInput,
  FinalProblem,
  MultiNodeStage,
  OrchestratorCallbacks
} from '../types/multiNodeTypes';
import {
  KnowledgePointCatalog,
  DifficultyLevel,
  getKnowledgePointById,
  getKnowledgePointsInCategory
} from './data/knowledgePointsCatalog';
import type { Language } from './i18n/languages';

export interface BatchGenerationRequest {
  knowledgePointIds: string[];
  difficultyFilter?: DifficultyLevel[];  // Min/max or specific levels
  trapCounts?: number[];  // Trap configuration per problem
  language?: Language;
  problemCountPerKP?: number;  // Number of problems to generate per knowledge point
  useAntiInterference?: boolean;  // Enable diversity checking
  singleQuestion?: boolean;  // Force single-question output
  numericAnswerOnly?: boolean;  // Force math V2 numeric/expression answers
  subject?: UserInput['subject'];  // Preserve subject for V2 per-KP routing
  concurrencyLimit?: number;  // Concurrent requests (default: 20)
}

export interface BatchGenerationResult {
  successCount: number;
  failureCount: number;
  problems: FinalProblem[];
  metadata: {
    startTime: string;
    endTime: string;
    totalDuration: number;
    knowledgePointsProcessed: string[];
    failureReasons: Record<string, string[]>;
  };
}

export class BatchGenerationService {
  /**
   * Generate problems by knowledge points with configurable concurrency
   */
  async generateByKnowledgePoints(
    request: BatchGenerationRequest,
    catalog: KnowledgePointCatalog,
    runMultiNodeWorkflow: (input: Partial<UserInput>, callbacks?: OrchestratorCallbacks) => Promise<FinalProblem[]>,
    callbacks?: OrchestratorCallbacks
  ): Promise<BatchGenerationResult> {
    const startTime = new Date();
    const results: FinalProblem[] = [];
    const failureReasons: Record<string, string[]> = {};

    const trapCount = request.trapCounts?.[0] ?? 2;
    const problemCountPerKP = request.problemCountPerKP || 1;
    const language = request.language || 'zh-CN';
    const useAntiInterference = request.useAntiInterference ?? true;
    const concurrencyLimit = request.concurrencyLimit ?? 20;  // Default: 20 concurrent requests

    // Validate knowledge points and apply filters
    const validKPIds = request.knowledgePointIds.filter(kpId => {
      const kp = getKnowledgePointById(catalog, kpId);
      if (!kp) {
        failureReasons[kpId] = ['Knowledge point not found'];
        return false;
      }

      // Apply difficulty filter if specified
      if (request.difficultyFilter && request.difficultyFilter.length > 0) {
        if (!request.difficultyFilter.includes(kp.difficulty)) {
          return false;
        }
      }
      return true;
    });

    console.log(`🚀 Batch generation started: ${validKPIds.length} KPs, concurrency: ${concurrencyLimit}`);

    // Use p-limit for controlled concurrency
    const limit = pLimit(concurrencyLimit);

    // Create concurrent tasks
    const tasks = validKPIds.map(kpId =>
      limit(async () => {
        const kp = getKnowledgePointById(catalog, kpId);
        if (!kp) return [];

        try {
          // Get knowledge point name in the selected language
          const topicName = kp.name[language as Language] || kp.name['en-US'] || kp.name['zh-CN'];

          // Generate problems for this knowledge point
          const input: Partial<UserInput> = {
            topic: topicName,
            trapCount: trapCount,
            problemCount: problemCountPerKP,
            language: language,
            knowledgePointIds: [kpId],
            useAntiInterference: useAntiInterference,
            singleQuestion: request.singleQuestion,
            numericAnswerOnly: request.numericAnswerOnly,
            subject: request.subject,
            allowTableLookup: true
          };

          // Call main workflow
          const problems = await runMultiNodeWorkflow(input, {
            onStageChange: callbacks?.onStageChange,
            onProgress: callbacks?.onProgress,
            onError: callbacks?.onError,
            onProblemGenerated: callbacks?.onProblemGenerated
          });

          if (problems.length === 0) {
            failureReasons[kpId] = ['No problems generated'];
          }

          return problems;
        } catch (error) {
          failureReasons[kpId] = [error instanceof Error ? error.message : String(error)];
          return [];
        }
      })
    );

    // Wait for all concurrent tasks
    const allResults = await Promise.all(tasks);
    const flatResults = allResults.flat();
    results.push(...flatResults);

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const successCount = flatResults.length;
    const failureCount = validKPIds.length * problemCountPerKP - successCount;

    console.log(`✅ Batch generation completed: ${successCount} problems generated in ${(duration / 1000).toFixed(1)}s`);

    return {
      successCount,
      failureCount,
      problems: results,
      metadata: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalDuration: duration,
        knowledgePointsProcessed: request.knowledgePointIds,
        failureReasons
      }
    };
  }

  /**
   * Generate problems from a category
   */
  async generateByCategory(
    categoryId: string,
    catalog: KnowledgePointCatalog,
    runMultiNodeWorkflow: (input: Partial<UserInput>, callbacks?: OrchestratorCallbacks) => Promise<FinalProblem[]>,
    request: Omit<BatchGenerationRequest, 'knowledgePointIds'> = {},
    callbacks?: OrchestratorCallbacks
  ): Promise<BatchGenerationResult> {
    const knowledgePoints = getKnowledgePointsInCategory(catalog, categoryId);
    const knowledgePointIds = knowledgePoints.map(kp => kp.id);

    return this.generateByKnowledgePoints(
      { ...request, knowledgePointIds },
      catalog,
      runMultiNodeWorkflow,
      callbacks
    );
  }

  /**
   * Suggest knowledge points based on difficulty and user preferences
   */
  suggestKnowledgePoints(
    catalog: KnowledgePointCatalog,
    difficulty?: DifficultyLevel,
    categoryId?: string,
    count: number = 5
  ): string[] {
    let suggestions = catalog.knowledgePoints;

    // Filter by difficulty
    if (difficulty !== undefined) {
      suggestions = suggestions.filter(kp => kp.difficulty === difficulty);
    }

    // Filter by category
    if (categoryId) {
      const category = catalog.categories.find(c => c.id === categoryId);
      if (category) {
        suggestions = suggestions.filter(kp => category.knowledgePointIds.includes(kp.id));
      }
    }

    // Return top N by ID
    return suggestions
      .slice(0, count)
      .map(kp => kp.id);
  }

  /**
   * Validate batch generation request
   */
  validateRequest(request: BatchGenerationRequest, catalog: KnowledgePointCatalog): string[] {
    const errors: string[] = [];

    // Check knowledge points exist
    for (const kpId of request.knowledgePointIds) {
      if (!getKnowledgePointById(catalog, kpId)) {
        errors.push(`Knowledge point '${kpId}' not found`);
      }
    }

    // Check difficulty filter
    if (request.difficultyFilter) {
      for (const level of request.difficultyFilter) {
        if (level < 1 || level > 5) {
          errors.push(`Invalid difficulty level: ${level}`);
        }
      }
    }

    // Check problem count
    if (request.problemCountPerKP && request.problemCountPerKP < 1) {
      errors.push('Problem count per knowledge point must be >= 1');
    }

    // Check trap count
    if (request.trapCounts) {
      for (const count of request.trapCounts) {
        if (count < 0 || count > 5) {
          errors.push(`Invalid trap count: ${count}`);
        }
      }
    }

    return errors;
  }
}

// Singleton instance
let service: BatchGenerationService | null = null;

export function getBatchGenerationService(): BatchGenerationService {
  if (!service) {
    service = new BatchGenerationService();
  }
  return service;
}
