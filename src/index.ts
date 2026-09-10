import { loadConfig } from "./config.ts";
import { createLiveVenue, PaperVenue, type ExecutionVenue } from "./execution.ts";
import { evaluateRisk } from "./risk.ts";

async function main(): Promise<void> {
  const config = loadConfig();
  const venue: ExecutionVenue =
    config.mode === "live" ? await createLiveVenue() : new PaperVenue(config.marketSlug);

  const market = await venue.fetchMarket(config.marketSlug);
  const intent = { side: "BUY" as const, notional: Math.min(10, config.maxNotional), shares: 20 };
  const blocked = evaluateRisk(config, { realizedPnl: 0, openNotional: 0, positionShares: 0 }, intent);

  if (blocked) {
    console.error(JSON.stringify({ ok: false, reason: blocked, market: market.slug }));
    process.exitCode = 2;
    return;
  }

  const fill = await venue.submitMarketBuy(market.yesTokenId, intent.notional);
  console.log(
    JSON.stringify({
      ok: true,
      mode: config.mode,
      market: market.slug,
      fill,
    }),
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ ok: false, error: message }));
  process.exitCode = 1;
});
