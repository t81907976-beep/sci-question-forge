import { strict as assert } from "node:assert";
import { test } from "node:test";
import { TrapType, type BaseProblem, type TrapModification } from "../../../types/multiNodeTypes.ts";
import { validateAndMergeTraps } from "../../nodes/node4-validator.ts";
import { validateAndMergeTraps as chemistryValidateAndMergeTraps } from "../chemistry/validator.ts";

/**
 * 已知缺口的定性测试（characterization test）：物理 V1 的 Node4 校验跑的是化学校验器。
 *
 * services/orchestrator-physics.ts 从 services/nodes/node4-validator.ts 导入
 * validateAndMergeTraps，而后者只是一层 3 行 shim：
 *   export * from '../subjects/chemistry/validator';
 * 于是物理题过 Node4 时，实际执行的是配位化学双齿配体计数、Nernst 方程、化学动力学
 * 那套规则，一条物理判据也没有。
 *
 * 这不是编译错误（tsc 通过），是静默的错学科回退，所以只能靠测试钉住。
 * 下面两个用例描述的是**当前行为**而非期望行为：物理有了自己的 validator 之后，
 * 第一个用例应当反转（断言两者不再相同），第二个用例应当改成断言物理违规被抓出来。
 */

function physicsBaseProblem(problemText: string): BaseProblem {
    return {
        problemId: "phys-node4-gap",
        topic: "相对论动力学",
        scenario: "直线加速器束流诊断",
        originalProblemText: problemText,
        coreData: {
            "束流动能": { value: 250, unit: "MeV" },
            "静止质量": { value: 0.511, unit: "MeV/c^2" },
        },
        requiredAnswer: "求出射粒子速度",
        // Node4 要求有陷阱时 ≥6 步、无陷阱时 ≥4 步，这里给足以隔离出学科判据。
        referenceSteps: ["步骤一", "步骤二", "步骤三", "步骤四", "步骤五", "步骤六"],
    };
}

test("物理 V1 的 Node4 与化学校验器是同一个实现（已知缺口）", () => {
    assert.equal(
        validateAndMergeTraps,
        chemistryValidateAndMergeTraps,
        "services/nodes/node4-validator.ts 目前只是 chemistry/validator 的 re-export",
    );
});

test("因此物理专属的违规（v > c）能原样通过 Node4", () => {
    // 束流速度 1.5c 是物理上不可能的，任何物理校验器都该拦下来。
    const modification: TrapModification = {
        trapType: TrapType.UNIT_DIMENSION,
        agentId: "trap-unit",
        trapDescription: "把束流速度写成超光速，制造相对论区判断陷阱",
        trapModifiedText:
            "电子束经加速后速度达到 1.5c，动能为 250 MeV，求其相对论动量。",
    };

    const result = validateAndMergeTraps(
        physicsBaseProblem("电子束经加速后速度达到 1.5c，求其相对论动量。"),
        [modification],
    );

    assert.equal(result.isValid, true, "当前校验器不含任何物理判据，所以判为合法");
    assert.deepEqual(result.physicalConstraintsViolated, []);
    assert.deepEqual(result.conflicts, []);
});
