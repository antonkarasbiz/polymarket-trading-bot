import { z } from "zod";

const schema = z.object({
  mode: z.enum(["paper", "live"]).default("paper"),
  wallet: z.string().optional().default(""),
  privateKey: z.string().optional().default(""),
  marketSlug: z.string().min(1, "POLYMARKET_MARKET_SLUG is required"),
  maxNotional: z.coerce.number().positive().default(50),
  maxDailyLoss: z.coerce.number().positive().default(25),
  maxPositionShares: z.coerce.number().positive().default(200),
  killSwitch: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

export type BotConfig = z.infer<typeof schema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BotConfig {
  const parsed = schema.safeParse({
    mode: env.POLYMARKET_MODE,
    wallet: env.POLYMARKET_WALLET_ADDRESS,
    privateKey: env.POLYMARKET_PRIVATE_KEY,
    marketSlug: env.POLYMARKET_MARKET_SLUG,
    maxNotional: env.MAX_NOTIONAL_PUSD,
    maxDailyLoss: env.MAX_DAILY_LOSS_PUSD,
    maxPositionShares: env.MAX_POSITION_SHARES,
    killSwitch: env.KILL_SWITCH,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join("; "));
  }

  if (parsed.data.mode === "live" && (!parsed.data.wallet || !parsed.data.privateKey)) {
    throw new Error("Live mode requires POLYMARKET_WALLET_ADDRESS and POLYMARKET_PRIVATE_KEY.");
  }

  return parsed.data;
}
