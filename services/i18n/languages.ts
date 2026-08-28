/**
 * Supported languages configuration
 */

export type Language = 'zh-CN' | 'en-US' | 'ja-JP' | 'es-ES' | 'fr-FR' | 'ko-KR';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: Record<Language, LanguageConfig> = {
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    region: '中国'
  },
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    region: 'USA'
  },
  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    region: '日本'
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'España'
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    region: 'France'
  },
  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    region: '한국'
  }
};

export const DEFAULT_LANGUAGE: Language = 'zh-CN';

/**
 * Get all available languages for UI dropdown
 */
export function getAvailableLanguages(): LanguageConfig[] {
  return Object.values(SUPPORTED_LANGUAGES);
}

/**
 * Validate if a language code is supported
 */
export function isValidLanguage(code: string): code is Language {
  return code in SUPPORTED_LANGUAGES;
}
