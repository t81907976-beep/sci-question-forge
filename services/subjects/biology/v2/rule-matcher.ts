import { BIOLOGY_RULE_BANK, BiologyRule, BiologyRuleNode } from './biology-rule-bank';

export interface BiologyRuleMatchContext {
  node: BiologyRuleNode;
  knowledgePoint?: string;
  dimension?: string;
  questionText?: string;
  referenceAnswer?: string;
  extraText?: string;
  maxRules?: number;
}

export interface MatchedBiologyRule extends BiologyRule {
  score: number;
  matchedTerms: string[];
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '');
}

function scoreTerms(haystack: string, terms: string[], weight: number): { score: number; matchedTerms: string[] } {
  const matchedTerms = terms.filter(term => term && haystack.includes(normalize(term)));
  return { score: matchedTerms.length * weight, matchedTerms };
}

export function selectBiologyRules(context: BiologyRuleMatchContext): MatchedBiologyRule[] {
  const text = normalize([
    context.knowledgePoint,
    context.dimension,
    context.questionText,
    context.referenceAnswer,
    context.extraText,
  ].filter(Boolean).join(' '));

  const maxRules = context.maxRules ?? 4;

  return BIOLOGY_RULE_BANK
    .filter(rule => rule.status === 'active' && rule.node === context.node)
    .map(rule => {
      const knowledge = scoreTerms(text, rule.knowledgeKeywords, 4);
      const questionTypes = scoreTerms(text, rule.questionTypes, 3);
      const logic = scoreTerms(text, rule.logicPatterns, 3);
      const triggers = scoreTerms(text, rule.triggerKeywords, 2);
      const matchedTerms = [
        ...knowledge.matchedTerms,
        ...questionTypes.matchedTerms,
        ...logic.matchedTerms,
        ...triggers.matchedTerms,
      ];
      const universal = rule.knowledgeKeywords.includes('生物') ? 1 : 0;
      const score = rule.priority + knowledge.score + questionTypes.score + logic.score + triggers.score + universal;
      return { ...rule, score, matchedTerms };
    })
    .filter(rule => rule.matchedTerms.length > 0 || rule.knowledgeKeywords.includes('生物'))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRules);
}

export function formatBiologyRulesForPrompt(rules: MatchedBiologyRule[], title = '【动态规则匹配】'): string {
  if (rules.length === 0) return '';
  return `${title}\n${rules.map(rule => `- [${rule.id}] ${rule.promptSnippet}`).join('\n')}\n`;
}
