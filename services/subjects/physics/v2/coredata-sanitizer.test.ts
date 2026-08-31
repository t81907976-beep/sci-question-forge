import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { V2QuestionDraft } from "./generator.ts";
import { sanitizeCoreData } from "./coredata-sanitizer.ts";

/**
 * sanitizeCoreData 的行为约定：只剔除"题面里找不到的数值项"，且对
 * node7 字符串判据的记法盲区（科学计数法/上标）必须手下留情。
 *
 * 这些用例全部是纯函数调用，不触发任何 LLM 请求。
 */

function draftOf(
    questionText: string,
    coreData: Record<string, { value: number; unit?: string }>,
): V2QuestionDraft {
    return { questionText, coreData } as unknown as V2QuestionDraft;
}

test("剔除生成器自己算出来的推导量，保留题面写明的给定量", (t) => {
    t.mock.method(console, "warn", () => {});

    // 题面只给了半径 1.85 m；L = 2πR = 11.623892818 是生成器算完贴回来的，
    // 题面里没有这个数，按 coreData 语义（题面直接给出的已知量）就不该在表里。
    const draft = draftOf(
        "螺旋磁约束装置的等离子体环半径为 1.85 m，求轴向周期长度对应的磁通变化率。",
        {
            "环半径 R": { value: 1.85, unit: "m" },
            "轴向周期长度 L": { value: 11.623892818, unit: "m" },
        },
    );

    const removed = sanitizeCoreData(draft, "A1");

    assert.deepEqual(Object.keys(draft.coreData), ["环半径 R"]);
    assert.equal(removed.length, 1);
    assert.match(removed[0], /轴向周期长度 L=11\.623892818 m/);
});

test("题面用上标科学计数法写的给定量必须保留（node7 字符串判据的盲区）", (t) => {
    t.mock.method(console, "warn", () => {});

    // node7 为 5e18 生成的 token 是 `5e+18`，与题面的 `5.0×10¹⁸` 永远匹配不上。
    // 这一项数值上确实写在题面里，删掉就等于把真给定量弄丢了。
    const draft = draftOf(
        "某托卡马克芯部电子数密度 n = 5.0×10¹⁸ m⁻³，电子温度 3.2 keV。",
        {
            "电子数密度 n": { value: 5e18, unit: "m^-3" },
            "电子温度 T_e": { value: 3.2, unit: "keV" },
        },
    );

    const removed = sanitizeCoreData(draft, "A1");

    assert.deepEqual(removed, []);
    assert.deepEqual(Object.keys(draft.coreData).sort(), ["电子数密度 n", "电子温度 T_e"]);
});

test("负指数上标同样要认（10⁻¹⁹ 这类基本电荷写法）", (t) => {
    t.mock.method(console, "warn", () => {});

    const draft = draftOf(
        "取基本电荷 e = 1.6×10⁻¹⁹ C，粒子经 250 V 电势差加速。",
        {
            "基本电荷 e": { value: 1.6e-19, unit: "C" },
            "加速电压 U": { value: 250, unit: "V" },
        },
    );

    assert.deepEqual(sanitizeCoreData(draft, "A1"), []);
    assert.equal(Object.keys(draft.coreData).length, 2);
});

test("数值接近但不相等的项照删（0.97 不能顶替 0.9691）", (t) => {
    t.mock.method(console, "warn", () => {});

    const draft = draftOf(
        "归一化小半径处的安全因子测得为 0.97。",
        {
            "安全因子 q": { value: 0.97 },
            "归一化半径 r0/a": { value: 0.9691 },
        },
    );

    const removed = sanitizeCoreData(draft, "A3-1");

    assert.deepEqual(Object.keys(draft.coreData), ["安全因子 q"]);
    assert.equal(removed.length, 1);
    assert.match(removed[0], /r0\/a=0\.9691/);
});

test("全部项都不可见时保留原样，交 node7 报错", (t) => {
    t.mock.method(console, "warn", () => {});

    // 清空 coreData 只会换来 node7 的另一条 'No given core data'，
    // 而"题面里一个给定数值都找不到"本身是更该被暴露的异常。
    const draft = draftOf("求该磁镜装置的粒子约束时间。", {
        "磁场强度 B": { value: 0.7625, unit: "T" },
        "比压 beta": { value: 0.03723369 },
    });

    assert.deepEqual(sanitizeCoreData(draft, "A1"), []);
    assert.equal(Object.keys(draft.coreData).length, 2);
});

test("非数值项无法做可见性判断，一律保留", (t) => {
    t.mock.method(console, "warn", () => {});

    const draft = draftOf("已知环向磁场按 1/R 衰减，等离子体压强剖面为抛物型。", {
        "磁场剖面": { value: Number.NaN },
        "压强剖面": { value: "抛物型" as unknown as number },
    });

    assert.deepEqual(sanitizeCoreData(draft, "A1"), []);
    assert.equal(Object.keys(draft.coreData).length, 2);
});

test("coreData 缺失或非对象时安全返回空数组", () => {
    assert.deepEqual(sanitizeCoreData({ questionText: "题面" } as unknown as V2QuestionDraft, "A1"), []);
    assert.deepEqual(
        sanitizeCoreData({ questionText: "题面", coreData: null } as unknown as V2QuestionDraft, "A1"),
        [],
    );
});
