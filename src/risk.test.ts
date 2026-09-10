import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateRisk } from "./risk.ts";

const limits = {
  maxNotional: 50,
  maxDailyLoss: 25,
  maxPositionShares: 100,
  killSwitch: false,
};

test("allows an order inside limits", () => {
  const blocked = evaluateRisk(limits, { realizedPnl: 0, openNotional: 10, positionShares: 20 }, {
    side: "BUY",
    notional: 15,
    shares: 10,
  });
  assert.equal(blocked, null);
});

test("blocks when the kill switch is on", () => {
  const blocked = evaluateRisk({ ...limits, killSwitch: true }, { realizedPnl: 0, openNotional: 0, positionShares: 0 }, {
    side: "BUY",
    notional: 5,
    shares: 5,
  });
  assert.equal(blocked, "kill switch is enabled");
});
