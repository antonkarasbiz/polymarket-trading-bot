# Polymarket trading bot

Execution service for [Polymarket](https://polymarket.com) CLOB markets. The default path is **paper trading**. Live orders go through the official `@polymarket/client` SDK, behind hard risk limits.

This is part of the [antonkarasbiz](https://github.com/antonkarasbiz) trading and prediction-market stack.

## Design

```text
config  →  market snapshot  →  risk engine  →  venue
                                      │
                          paper broker or live CLOB
```

| Layer | Responsibility |
| --- | --- |
| Config | Environment-validated limits and mode |
| Risk | Notional, inventory, daily loss, kill switch |
| Venue | Paper fills or signed live market orders |
| CLI | Single JSON result per run, no secret logging |

Live authentication follows the official quickstart: wallet address + signer via `createSecureClient`, then `fetchMarket` / `placeMarketOrder`. See [Polymarket trading docs](https://docs.polymarket.com/trading/quickstart).

## Setup

```bash
npm install
cp .env.example .env
# set POLYMARKET_MARKET_SLUG
npm run paper
npm test
```

Live mode (`POLYMARKET_MODE=live`) requires a funded Polymarket wallet and is opt-in. Do not commit keys.

## Risk defaults

- Max notional: 50 pUSD
- Max daily loss: 25 pUSD
- Max position: 200 shares
- Kill switch via `KILL_SWITCH=true`

## Related repositories

- [polymarket-market-maker](https://github.com/antonkarasbiz/polymarket-market-maker)
- [polymarket-analytics](https://github.com/antonkarasbiz/polymarket-analytics)
- [evm-order-router](https://github.com/antonkarasbiz/evm-order-router)

## License

MIT. Trading can result in total loss of capital. This repository is software, not financial advice.
