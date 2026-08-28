import { MATH_DISCIPLINES } from "../disciplines.ts";

export interface MathV2L2Node {
    id: string;
    name: string;
    aliases: string[];
}

export type MathV2L2MatchMethod = "exact_key" | "exact_name" | "alias" | "fallback";

export interface MathV2L2RoutingEvidence {
    disciplineKey: string;
    disciplineName: string;
    matchInput: string;
    matchMethod: MathV2L2MatchMethod;
    matchedAlias: string;
    fallbackUsed: boolean;
}

interface LegacyMathDiscipline {
    name: string;
}

function uniqueAliases(values: string[]): string[] {
    const aliases: string[] = [];
    const seen = new Set<string>();

    for (const value of values) {
        const alias = String(value || "").trim();
        if (!alias || seen.has(alias)) continue;
        seen.add(alias);
        aliases.push(alias);
    }

    return aliases;
}

// L2 名称允许使用带连接符、去掉连接符或仅使用后半段方向名三种写法。
// 例如“代数-代数方程”“代数代数方程”“代数方程”都表示同一个 L2；
// 这里仅从 L2 正式名称生成变体，不引入任何 L3 知识点关键词。
function buildNameVariants(name: string): string[] {
    const parts = name.split(/[-—–·/]/).map(part => part.trim()).filter(Boolean);
    if (parts.length < 2) return [name];

    return [
        name,
        parts.join(""),
        parts.slice(1).join(""),
    ];
}

function buildAliases(id: string, discipline: LegacyMathDiscipline): string[] {
    return uniqueAliases([
        ...buildNameVariants(discipline.name),
        id,
    ]);
}

export const MATH_V2_L2_CATALOG: Record<string, MathV2L2Node> = Object.freeze(
    Object.fromEntries(
        Object.entries(MATH_DISCIPLINES as Record<string, LegacyMathDiscipline>).map(([id, discipline]) => [
            id,
            {
                id,
                name: discipline.name,
                aliases: buildAliases(id, discipline),
            },
        ])
    )
) as Record<string, MathV2L2Node>;

function normalizeGroupLabel(value: string): string {
    return String(value || "").trim().toLowerCase().replace(/[-—–·/\s]/g, "");
}

function getL2ParentLabels(node: MathV2L2Node): string[] {
    const nameParts = node.name.split(/[-—–·/]/).map(part => part.trim()).filter(Boolean);
    const idParent = node.id.split("-")[0];
    return [
        ...(nameParts.length > 1 ? [nameParts[0]] : []),
        idParent,
    ];
}

function getL2Children(parentTopic: string): MathV2L2Node[] {
    const normalizedParent = normalizeGroupLabel(parentTopic);
    if (!normalizedParent) return [];

    return Object.values(MATH_V2_L2_CATALOG).filter(node =>
        getL2ParentLabels(node).some(label => normalizeGroupLabel(label) === normalizedParent)
    );
}

function shuffleL2Children<T>(items: T[], random: () => number): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
        const randomValue = Math.min(Math.max(random(), 0), 0.999999999);
        const j = Math.floor(randomValue * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * 把前端输入的数学分支展开成每道题实际使用的 L2。
 * 父级输入（如“代数”）按轮次不放回抽取子方向；具体 L2 输入则原样重复，
 * 这样并发任务创建前就已经确定每道题的规则来源，不会出现所有题共享一次随机匹配。
 */
export function selectMathV2L2Topics(
    topic: string,
    count: number,
    random: () => number = Math.random,
): string[] {
    const safeCount = Math.max(0, Math.floor(count));
    if (safeCount === 0) return [];

    const children = getL2Children(topic);
    if (children.length === 0) return Array.from({ length: safeCount }, () => topic);

    const selected: string[] = [];
    while (selected.length < safeCount) {
        const round = shuffleL2Children(children, random);
        selected.push(...round.map(node => node.name));
    }
    return selected.slice(0, safeCount);
}

export function getMathV2L2Node(id: string): MathV2L2Node {
    return MATH_V2_L2_CATALOG[id] ?? MATH_V2_L2_CATALOG["algebra-equation"];
}

export function getMathV2L2Aliases(id: string): string[] {
    return getMathV2L2Node(id).aliases;
}

function getAliasWeight(alias: string): number {
    if (/定理|公式|条件|判别|准则|引理|算法|空间|方程|理论/.test(alias)) return 5;
    if (alias.length >= 8) return 4;
    if (alias.length >= 5) return 2.5;
    if (alias.length >= 3) return 1.5;
    return 0.5;
}

function getAliasMatchScore(topic: string, node: MathV2L2Node) {
    const normalizedTopic = topic.toLowerCase();
    const matchedAliases = node.aliases.filter(alias => normalizedTopic.includes(alias.toLowerCase()));

    return {
        id: node.id,
        score: matchedAliases.reduce((sum, alias) => sum + getAliasWeight(alias), 0),
        matchedCount: matchedAliases.length,
        matchedLength: matchedAliases.reduce((sum, alias) => sum + alias.length, 0),
        longestAliasLength: matchedAliases.reduce((max, alias) => Math.max(max, alias.length), 0),
        matchedAliases,
    };
}

export function identifyMathV2L2DisciplineWithEvidence(topic: string): MathV2L2RoutingEvidence {
    const text = String(topic || "").trim();
    const fallback = MATH_V2_L2_CATALOG["algebra-equation"];

    if (!text) {
        return {
            disciplineKey: fallback.id,
            disciplineName: fallback.name,
            matchInput: text,
            matchMethod: "fallback",
            matchedAlias: "",
            fallbackUsed: true,
        };
    }

    const exactKey = MATH_V2_L2_CATALOG[text];
    if (exactKey) {
        return {
            disciplineKey: exactKey.id,
            disciplineName: exactKey.name,
            matchInput: text,
            matchMethod: "exact_key",
            matchedAlias: text,
            fallbackUsed: false,
        };
    }

    const exactName = Object.values(MATH_V2_L2_CATALOG)
        .find(node => node.name.toLowerCase() === text.toLowerCase());
    if (exactName) {
        return {
            disciplineKey: exactName.id,
            disciplineName: exactName.name,
            matchInput: text,
            matchMethod: "exact_name",
            matchedAlias: exactName.name,
            fallbackUsed: false,
        };
    }

    const bestMatch = Object.values(MATH_V2_L2_CATALOG)
        .map(node => getAliasMatchScore(text, node))
        .filter(match => match.matchedCount > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.matchedLength !== a.matchedLength) return b.matchedLength - a.matchedLength;
            if (b.matchedCount !== a.matchedCount) return b.matchedCount - a.matchedCount;
            return b.longestAliasLength - a.longestAliasLength;
        })[0];

    if (!bestMatch) {
        return {
            disciplineKey: fallback.id,
            disciplineName: fallback.name,
            matchInput: text,
            matchMethod: "fallback",
            matchedAlias: "",
            fallbackUsed: true,
        };
    }

    const node = MATH_V2_L2_CATALOG[bestMatch.id];
    const matchedAlias = [...bestMatch.matchedAliases]
        .sort((a, b) => getAliasWeight(b) - getAliasWeight(a) || b.length - a.length)[0] ?? "";

    return {
        disciplineKey: node.id,
        disciplineName: node.name,
        matchInput: text,
        matchMethod: "alias",
        matchedAlias,
        fallbackUsed: false,
    };
}

export function identifyMathV2L2Discipline(topic: string): string {
    return identifyMathV2L2DisciplineWithEvidence(topic).disciplineKey;
}
