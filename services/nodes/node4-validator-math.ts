import type {
    BaseProblem,
    TrapModification,
    ValidationResult
} from "../../types/multiNodeTypes";

/**
 * Node 4: Trap Fusion & Consistency Validator - Enhanced Version
 *
 * Merges trap modifications and validates:
 * 1. No conflicting field modifications
 * 2. Mathematical constraints are satisfied
 * 3. Problem remains solvable
 *
 * Note: This version no longer uses distractorData.
 * Traps now work by modifying/enhancing the original problem conditions.
 */

export function validateAndMergeTraps(
    baseProblem: BaseProblem,
    modifications: TrapModification[]
): ValidationResult {
    const conflicts: string[] = [];
    const violations: string[] = [];

    // Step 1: Check for field conflicts in givenData only
    // (questionBody can be modified by multiple traps - we'll take the last one)
    const givenDataModificationCount: Record<string, number> = {};

    modifications.forEach(mod => {
        if (mod.modifiedFields?.givenData) {
            Object.keys(mod.modifiedFields.givenData).forEach(field => {
                givenDataModificationCount[field] = (givenDataModificationCount[field] || 0) + 1;
            });
        }
    });

    // Only warn about givenData conflicts, don't fail
    Object.entries(givenDataModificationCount).forEach(([field, count]) => {
        if (count > 1) {
            conflicts.push(`Warning: Field "${field}" in givenData modified by multiple trap agents`);
        }
    });

    // Step 2: Merge modifications
    // questionBody: take the last one if multiple
    // givenData: merge (but warn above if conflict)
    // Note: No more distractorData
    let mergedProblem = { ...baseProblem, appliedTraps: [] };

    modifications.forEach(mod => {
        if (mod.modifiedFields?.questionBody) {
            // Take the latest questionBody modification
            mergedProblem.questionBody = mod.modifiedFields.questionBody;
        }
        if (mod.modifiedFields?.givenData) {
            mergedProblem.givenData = { ...mergedProblem.givenData, ...mod.modifiedFields.givenData };
        }
        mergedProblem.appliedTraps.push(mod.trapType);
    });

    // 创建临时的 mergedProblemText（将题干和数据合并）
    // 这是为了让 node5 能看到完整的题目信息
    // 后续 node6 会生成正式的融合文本
    
    // 【关键修复】确保 questionBody 和 givenData 中的数据一致
    // 问题分析：
    // 1. Base Problem 生成时，questionBody 和 givenData 可能包含相同的数据
    // 2. Trap 修改题目时，可能只改了其中一个
    // 3. 这导致两者不一致，解答器基于 questionBody 求解，但 givenData 是原始数据
    
    // 修复策略：
    // 如果 questionBody 包含具体数值数据（如矩阵），则提取这些数据并更新 givenData
    // 这样可以确保两者一致，解答器以 givenData 为准（它是原始数据源）
    
    // 从 questionBody 中提取所有矩阵格式的数据
    const questionBody = mergedProblem.questionBody;
    
    // 更灵活的正则：匹配各种格式的矩阵（有无空格均可）
    const matrixPatterns = [
        /\[\[[\d\s,]+\](?:\s*,\s*\[[\d\s,]+\])*\]/g,  // [[1,2],[3,4]] 格式
        /\[\s*\[\s*[\d\s,]+\s*\](?:\s*,\s*\[\s*[\d\s,]+\s*\])*\s*\]/g  // 带空格格式
    ];
    
    for (const pattern of matrixPatterns) {
        const matches = questionBody.match(pattern);
        if (matches && matches.length > 0) {
            // 找到矩阵，尝试更新 givenData
            for (const extractedMatrix of matches) {
                // 规范化提取的矩阵格式（去除多余空格）
                const normalizedMatrix = extractedMatrix.replace(/\s+/g, ' ').trim();
                
                // 检查 givenData 中是否有需要更新的字段
                for (const [key, val] of Object.entries(mergedProblem.givenData)) {
                    // 检查是否是数组/矩阵类型的字段
                    const originalValue = String(val.value);
                    const isArrayField = key.includes('矩阵') || key.includes('matrix') || 
                                        key.includes('数组') || key.includes('系数') ||
                                        typeof val.value === 'string' && val.value.startsWith('[');
                    
                    if (isArrayField && originalValue !== normalizedMatrix) {
                        // 更新 givenData 以匹配 questionBody
                        mergedProblem.givenData[key] = {
                            value: normalizedMatrix,
                            unit: val.unit
                        };
                        console.log(`[Node 4] 更新 givenData.${key}: ${originalValue} -> ${normalizedMatrix}`);
                    }
                }
            }
        }
    }
    
    // 从更新后的 givenData 构建数据文本
    const finalDataText = Object.entries(mergedProblem.givenData)
        .map(([key, val]) => `${key}: ${val.value} ${val.unit}`.trim())
        .join('；');
    
    mergedProblem.mergedProblemText = `${mergedProblem.questionBody} ${finalDataText}`;

    // Step 3: Mathematical constraint validation
    const mathChecks = validateMathConstraints(mergedProblem);
    violations.push(...mathChecks);
    violations.push(...validateDisciplineContextMetadata(mergedProblem));
    violations.push(...validatePerturbationMetadata(baseProblem, modifications, mergedProblem));

    // Step 4: Determine if valid
    // Only fail on actual violations, not on warnings about conflicts
    const hasCriticalConflicts = violations.length > 0;

    return {
        isValid: !hasCriticalConflicts,
        conflicts,
        physicalConstraintsViolated: violations,
        isSolvable: !hasCriticalConflicts, // Will be further validated by Node 5
        mergedProblem: !hasCriticalConflicts ? mergedProblem : undefined
    };
}

function validateDisciplineContextMetadata(mergedProblem: BaseProblem): string[] {
    const violations: string[] = [];
    const context = mergedProblem.mathDisciplineContext;

    if (!context) {
        violations.push('缺少数学学科上下文 mathDisciplineContext');
        return violations;
    }

    if (!context.validationRules) {
        violations.push('缺少数学验证规则 validationRules');
    }

    if (!context.generationGuidance) {
        violations.push('缺少数学生成指导 generationGuidance');
    }

    return violations;
}

function validatePerturbationMetadata(
    baseProblem: BaseProblem,
    modifications: TrapModification[],
    mergedProblem: BaseProblem
): string[] {
    const violations: string[] = [];

    if (!baseProblem.mathPerturbationBlueprint) {
        return violations;
    }

    const structuralModification = modifications.find(mod => mod.agentId === 'math_structural_perturbation');

    if (!structuralModification) {
        violations.push('缺少数学结构扰动记录');
        return violations;
    }

    if (!baseProblem.mathPerturbationBlueprint.perturbationType) {
        violations.push('结构扰动蓝图缺少 perturbationType');
    }

    if (structuralModification.perturbationType !== baseProblem.mathPerturbationBlueprint.perturbationType) {
        violations.push(`扰动类型不一致：blueprint=${baseProblem.mathPerturbationBlueprint.perturbationType}, modification=${structuralModification.perturbationType || '未填写'}`);
    }

    if (!structuralModification.invalidatedStandardMethod) {
        violations.push('结构扰动缺少 invalidatedStandardMethod');
    }

    if (!structuralModification.expectedWrongPath) {
        violations.push('结构扰动缺少 expectedWrongPath');
    }

    if (!structuralModification.divergenceStep) {
        violations.push('结构扰动缺少 divergenceStep');
    }

    if (!Array.isArray(structuralModification.manualValidationChecklist) || structuralModification.manualValidationChecklist.length < 3) {
        violations.push('结构扰动 manualValidationChecklist 少于 3 条');
    }

    if (!mergedProblem.questionBody || mergedProblem.questionBody.trim() === baseProblem.questionBody?.trim()) {
        violations.push('结构扰动没有实质改写 questionBody');
    }

    return violations;
}

function validateMathConstraints(problem: any): string[] {
    const violations: string[] = [];

    // ========== 新增：格式验证 ==========
    // 检查是否有多个小问（如"（1）""（2）"或"第一问""第二问"）
    const multiQuestionPatterns = [
        // /（\s*\d+\s*）/g,          // （1）（2）-> 注释掉括号的情况，因为会引起误判
        // /\(\s*\d+\s*\)/g,          // (1) (2) -> 注释掉括号的情况，因为会引起误判
        /第一问/g,
        /第二问/g,
        /第三问/g,
        /第四问/g,
        /第五问/g,
        /第一小题/g,
        /第二小题/g,
        /第三小题/g,
    ];
    
    for (const pattern of multiQuestionPatterns) {
        if (pattern.test(problem.questionBody)) {
            violations.push(`题目包含多个小问（检测到 ${pattern.source}），必须只有1个小问`);
            break;
        }
    }

    // 检查答案语言与题目语言是否一致
    // 如果题目是中文，答案关键词应该是中文
    const isChineseQuestion = /[\u4e00-\u9fa5]/.test(problem.questionBody);
    if (isChineseQuestion && problem.requiredAnswer) {
        const answerText = problem.requiredAnswer.toString().toLowerCase();
        // 如果答案中有大量英文关键词（如 "solve", "find", "calculate"），可能是中英文不一致
        const englishKeywords = ['solve', 'find', 'calculate', 'compute', 'determine', 'obtain', 'show that', 'prove that'];
        const hasEnglishKeyword = englishKeywords.some(kw => answerText.includes(kw));
        if (hasEnglishKeyword) {
            violations.push(`题目是中文但答案包含英文关键词 "${englishKeywords.find(kw => answerText.includes(kw))}"，答案应使用中文`);
        }
    }

    // ========== 原有数学约束验证 ==========
    // Check 1: Probability must be in [0, 1]
    Object.entries(problem.givenData).forEach(([key, value]: [string, any]) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('概率') || lowerKey.includes('probability')) {
            if (value.value < 0 || value.value > 1) {
                violations.push(`${key} = ${value.value} must be in [0, 1] for probability`);
            }
        }
    });

    // Check 2: Angle in reasonable range (if in degrees or radians)
    Object.entries(problem.givenData).forEach(([key, value]: [string, any]) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('角度') || lowerKey.includes('angle') || lowerKey.includes('θ') || lowerKey === 'a' || lowerKey === 'b') {
            if (value.unit === '°' && (value.value < -360 || value.value > 360)) {
                violations.push(`${key} = ${value.value}° is out of reasonable range (-360 to 360)`);
            }
            if (value.unit === 'rad' && (value.value < -2 * Math.PI || value.value > 2 * Math.PI)) {
                violations.push(`${key} = ${value.value} rad is out of reasonable range (-2π to 2π)`);
            }
        }
    });

    // Check 4: Certain mathematical objects must be non-negative
    Object.entries(problem.givenData).forEach(([key, value]: [string, any]) => {
        const lowerKey = key.toLowerCase();
        const allowNegative =
            lowerKey.includes('Δ') ||
            lowerKey.includes('变化') ||
            lowerKey.includes('差') ||
            lowerKey.includes('增量');

        // Objects that must be non-negative
        const mustBeNonNegative =
            lowerKey.includes('个数') ||
            lowerKey.includes('数量') ||
            lowerKey.includes('count') ||
            lowerKey.includes('长') ||
            lowerKey.includes('面积') ||
            lowerKey.includes('体积') ||
            lowerKey.includes('边数');

        if (!allowNegative && mustBeNonNegative && value.value < 0) {
            violations.push(`${key} = ${value.value} must be non-negative`);
        }
    });

    // Check 5: Check for mathematical consistency (e.g., matrix dimensions)
    if (problem.givenData.n && problem.givenData.m) {
        // If we have matrix dimensions, they should be reasonable
        if (problem.givenData.n.value * problem.givenData.m.value > 1000) {
            violations.push(`Matrix dimensions ${problem.givenData.n.value}×${problem.givenData.m.value} too large for manual calculation`);
        }
    }

    return violations;
}

/**
 * Check if trap combination makes sense
 */
export function checkTrapCompatibility(modifications: TrapModification[]): string[] {
    const issues: string[] = [];

    const trapTypes = modifications.map(m => m.trapType);

    // Example: Condition + Formula traps are highly compatible
    // Domain + Condition might conflict if not careful

    // For now, simple check: no duplicate trap types
    const uniqueTraps = new Set(trapTypes);
    if (uniqueTraps.size !== trapTypes.length) {
        issues.push('Duplicate trap types detected');
    }

    return issues;
}
