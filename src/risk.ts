export type RiskLimits = {
  maxNotional: number;
  maxDailyLoss: number;
  maxPositionShares: number;
  killSwitch: boolean;
};

export type RiskState = {
  realizedPnl: number;
  openNotional: number;
  positionShares: number;
};

export type OrderIntent = {
  side: "BUY" | "SELL";
  notional: number;
  shares: number;
};

export function evaluateRisk(limits: RiskLimits, state: RiskState, intent: OrderIntent): string | null {
  if (limits.killSwitch) {
    return "kill switch is enabled";
  }
  if (state.realizedPnl <= -limits.maxDailyLoss) {
    return "daily loss limit reached";
  }
  if (state.openNotional + intent.notional > limits.maxNotional) {
    return "notional cap exceeded";
  }
  const nextShares =
    intent.side === "BUY" ? state.positionShares + intent.shares : state.positionShares - intent.shares;
  if (Math.abs(nextShares) > limits.maxPositionShares) {
    return "position cap exceeded";
  }
  return null;
}
