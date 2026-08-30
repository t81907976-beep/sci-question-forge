import { strict as assert } from "node:assert";
import { test } from "node:test";
import { callWithGatewayRetry, isGatewayError } from "./gateway-retry.ts";

/**
 * 重试只该发生在与题目内容无关的传输层错误上：模型答不出、JSON 解析失败
 * 重试一次只是重复烧钱，还会掩盖真实问题。
 *
 * 这些用例不发任何网络请求，退避用 node:test 的 mock timers 快进。
 */

/** 让已排队的 microtask 跑完（setImmediate 未被 mock，可用来推进 await 链） */
const flush = () => new Promise<void>(resolve => setImmediate(resolve));

test("认得传输层错误", () => {
    for (const message of [
        "_APIError: Upstream HTTP/2 stream failed",
        "Upstream body read failed",
        "socket hang up",
        "ECONNRESET",
        "The service is temporarily unavailable",
        "other side closed",
        "503 Service Unavailable",
        "429 Too Many Requests",
    ]) {
        assert.ok(isGatewayError(message), `应判为网关错误: ${message}`);
    }
});

test("不把内容型错误当网关错误", () => {
    for (const message of [
        "Generator: incomplete question or answer in response",
        "Unexpected token o in JSON at position 12",
        "题目条件不自洽，无法求解",
        "Empty output: content=0 chars",
    ]) {
        assert.ok(!isGatewayError(message), `不应判为网关错误: ${message}`);
    }
});

test("状态码判据用 \\b 收边，不被更长的数字串误触发", () => {
    // 这是 \b 唯一真正防住的一类：内容型错误信息里的偏移量恰好以状态码开头。
    assert.ok(!isGatewayError("Unexpected end of JSON input at position 5041"));
    assert.ok(!isGatewayError("token count 5002 exceeds limit"));
    // 而独立成词的状态码仍然要认。
    assert.ok(isGatewayError("Request failed with status code 504"));
});

test("非网关错误立刻抛出，不重试", async () => {
    let calls = 0;
    await assert.rejects(
        () => callWithGatewayRetry(async () => {
            calls++;
            throw new Error("Generator: incomplete question or answer in response");
        }, "A1 生题"),
        /incomplete question/,
    );
    assert.equal(calls, 1, "内容型错误必须零重试");
});

test("首次调用成功时不引入任何等待", async () => {
    let calls = 0;
    const result = await callWithGatewayRetry(async () => {
        calls++;
        return "ok";
    }, "A0 分析");

    assert.equal(result, "ok");
    assert.equal(calls, 1);
});

test("网关错误退避后重试并返回成功结果", async (t) => {
    t.mock.method(console, "warn", () => {});
    t.mock.timers.enable({ apis: ["setTimeout"] });

    let calls = 0;
    const pending = callWithGatewayRetry(async () => {
        calls++;
        if (calls === 1) throw new Error("Upstream HTTP/2 stream failed");
        return "第二次成功";
    }, "A2 审查");

    await flush();
    assert.equal(calls, 1, "退避期间不应重复调用");

    t.mock.timers.tick(6000);   // 第一次退避 6s
    assert.equal(await pending, "第二次成功");
    assert.equal(calls, 2);
});

test("连续网关错误在第 3 次调用后放弃并抛出", async (t) => {
    t.mock.method(console, "warn", () => {});
    t.mock.timers.enable({ apis: ["setTimeout"] });

    let calls = 0;
    const pending = callWithGatewayRetry(async () => {
        calls++;
        throw new Error(`Upstream HTTP/2 stream failed (#${calls})`);
    }, "A4 盲解");
    const settled = assert.rejects(() => pending, /#3/);

    await flush();
    t.mock.timers.tick(6000);    // 退避 6s → 第 2 次
    await flush();
    t.mock.timers.tick(12000);   // 退避 12s → 第 3 次
    await settled;

    assert.equal(calls, 3, "MAX_ATTEMPTS=3，即最多 2 次重试");
});
