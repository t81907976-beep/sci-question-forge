/**
 * I18n Manager - Centralized multi-language support
 *
 * Manages language switching, prompt loading, and UI translations
 */

import { Language, DEFAULT_LANGUAGE, isValidLanguage } from './languages';

export interface I18nDictionary {
  [key: string]: string;
}

export class I18nManager {
  private currentLanguage: Language = DEFAULT_LANGUAGE;
  private dictionaries: Map<Language, I18nDictionary> = new Map();
  private prompts: Map<Language, Map<string, string>> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize i18n manager with a specific language
   */
  async initialize(language: Language = DEFAULT_LANGUAGE): Promise<void> {
    if (!isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}, falling back to ${DEFAULT_LANGUAGE}`);
      language = DEFAULT_LANGUAGE;
    }

    this.currentLanguage = language;

    // Load dictionary if not already loaded
    if (!this.dictionaries.has(language)) {
      try {
        const dict = await this.loadDictionary(language);
        this.dictionaries.set(language, dict);
      } catch (error) {
        console.warn(`Failed to load dictionary for ${language}:`, error);
        // Fallback to Chinese
        if (language !== DEFAULT_LANGUAGE) {
          await this.initialize(DEFAULT_LANGUAGE);
          return;
        }
      }
    }

    // Load prompts if not already loaded
    if (!this.prompts.has(language)) {
      try {
        await this.loadPrompts(language);
      } catch (error) {
        console.warn(`Failed to load prompts for ${language}:`, error);
      }
    }

    this.initialized = true;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Check if manager is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Load dictionary for a language
   * Format: JSON with key-value pairs for UI translations
   */
  private async loadDictionary(language: Language): Promise<I18nDictionary> {
    try {
      // Dynamic import of language-specific dictionary
      const dict = await import(`./dictionaries/${language}.json`);
      return dict.default || dict;
    } catch (error) {
      console.error(`Failed to load dictionary for ${language}:`, error);
      return {};
    }
  }

  /**
   * Load all node prompts for a language
   *
   * Note: Currently all prompts are hardcoded in Node implementations.
   * This method maintains the i18n interface for future expansion to support
   * file-based multi-language prompts. For now, we use an empty implementation
   * to avoid console warnings about missing prompt files.
   */
  private async loadPrompts(language: Language): Promise<void> {
    // All node prompts are currently hardcoded in their respective Node files:
    // - Node 2: services/nodes/node2-base-generator.ts (hardcoded prompt)
    // - Node 1: services/nodes/node1-rag.ts (hardcoded constraints)
    // - Node 3/5/7: Similarly hardcoded
    //
    // To implement true multi-language prompts in the future:
    // 1. Create prompt files: services/i18n/prompts/{nodeX}/{promptType}/{language}.txt
    // 2. Modify Node code to call: i18nManager.getPrompt(nodeId, promptType)
    // 3. Uncomment the file loading logic below

    const promptsMap = new Map<string, string>();

    // [FUTURE EXPANSION] Uncomment this section when implementing file-based prompts:
    /*
    const promptFiles = [
      'node2-base-generator/generation',
      'node3-traps/injection',
      'node5-solver/sanity-check',
      // ... add more as needed
    ];

    for (const file of promptFiles) {
      try {
        const content = await import(`./prompts/${file}/${language}.txt`);
        const text = content.default || content;
        promptsMap.set(file, text);
      } catch (error) {
        console.warn(`Failed to load prompt: prompts/${file}/${language}.txt`);
      }
    }
    */

    this.prompts.set(language, promptsMap);
  }

  /**
   * Get a translated UI string
   */
  t(key: string, defaultValue?: string): string {
    const dict = this.dictionaries.get(this.currentLanguage);
    if (!dict) {
      return defaultValue || key;
    }
    return dict[key] || defaultValue || key;
  }

  /**
   * Get a prompt template for a specific node
   */
  getPrompt(nodeId: string, promptType: string): string {
    const promptsMap = this.prompts.get(this.currentLanguage);
    if (!promptsMap) {
      console.warn(`Prompts not loaded for ${this.currentLanguage}`);
      return '';
    }

    const key = `${nodeId}/${promptType}`;
    const prompt = promptsMap.get(key);

    if (!prompt) {
      console.warn(`Prompt not found: ${key} for language ${this.currentLanguage}`);
      return '';
    }

    return prompt;
  }

  /**
   * Batch translate multiple keys
   */
  tMultiple(keys: string[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key of keys) {
      result[key] = this.t(key);
    }
    return result;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages() {
    const { getAvailableLanguages } = require('./languages');
    return getAvailableLanguages();
  }
}

// Singleton instance
let instance: I18nManager | null = null;

/**
 * Get or create I18nManager singleton
 */
export function getI18nManager(): I18nManager {
  if (!instance) {
    instance = new I18nManager();
  }
  return instance;
}

// Export singleton as default
export default getI18nManager();
