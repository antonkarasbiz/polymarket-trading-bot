# Polymarket Trading Bot

<p align="center">
  <strong>Anton Karas (AntonX)</strong> · Full-stack · Blockchain · AI<br />
  Production-shaped Polymarket CLOB V2 execution — paper-first, risk-gated, built to be hired.
</p>

<p align="center">
  <a href="mailto:antonkarasbiz@gmail.com"><img src="https://img.shields.io/badge/Email-antonkarasbiz%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  <a href="https://t.me/antonkaras_biz"><img src="https://img.shields.io/badge/Telegram-antonkaras__biz-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram" /></a>
  <a href="https://discord.com/users/381074277046691222"><img src="https://img.shields.io/badge/Discord-AntonX-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://x.com/antonkaras_biz"><img src="https://img.shields.io/badge/X-antonkaras__biz-e7e9ea?style=for-the-badge&logo=x&logoColor=000000" alt="X" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/venue-Polymarket_CLOB_V2-0ea5a4?style=for-the-badge" alt="CLOB V2" />
  <img src="https://img.shields.io/badge/collateral-pUSD-f59e0b?style=for-the-badge" alt="pUSD" />
  <img src="https://img.shields.io/badge/default_mode-paper-22c55e?style=for-the-badge" alt="Paper mode" />
  <img src="https://img.shields.io/badge/runtime-Node_20+-111827?style=for-the-badge" alt="Node 20" />
</p>

Want this bot on your wallet, a private fork, or a walkthrough of CLOB V2 order flow? **Message me.** I design the execution layer, the risk gates, and the adjacent market-making / analytics stack.

---

## Who I am

I am **Anton Karas** ([antonkarasbiz](https://github.com/antonkarasbiz)), based in Lublin, Poland (Europe/Warsaw), available worldwide. My public work is full-stack product engineering plus **on-chain and off-chain trading systems**: prediction-market CLOBs, EVM routers, Solana execution, RWA bridges, and AI-backed platforms.

This repository is the execution core of my Polymarket stack. I do not treat Polymarket as a thin `POST /order` wrapper. I treat it as a production venue: **CLOB V2** matching, **pUSD** settlement on Polygon, EIP-712 signing, L2 HMAC, taker delays, and hard risk limits before any live send.

| Practice area | What I actually ship |
| --- | --- |
| Polymarket execution | This bot — paper venue, live `@polymarket/client`, kill switch |
| Liquidity | [polymarket-market-maker](https://github.com/antonkarasbiz/polymarket-market-maker) — inventory-skewed two-sided quotes |
| Research | [polymarket-analytics](https://github.com/antonkarasbiz/polymarket-analytics) — book metrics and signals |
| EVM | [evm-order-router](https://github.com/antonkarasbiz/evm-order-router) — venue selection under a gas ceiling |
| Solana | [solana-execution-engine](https://github.com/antonkarasbiz/solana-execution-engine) — quote simulation and impact caps |
| Perps / options | [paradex-trading](https://github.com/antonkarasbiz/paradex-trading) |
| RWA | [crossyield-rwa-bridge](https://github.com/antonkarasbiz/crossyield-rwa-bridge) |

Related product history on the same account: hotel PMS ([qloapps-hotel-booking](https://github.com/antonkarasbiz/qloapps-hotel-booking)), privacy-focused AI ([littleaibox](https://github.com/antonkarasbiz/littleaibox)), Next.js commerce, FastAPI services. Portfolio: [anton-karas-portfolio.pages.dev](https://anton-karas-portfolio.pages.dev/).

**Hire / ask me about**

- Private deployment of this bot (wallet setup, pUSD wrap, allowances, live mode)
- Custom size, TWAP, or maker-rebate strategies on Polymarket CLOB V2
- Wiring Gamma + Data API + WebSocket books into your own desk
- Reviewing someone else’s bot before they turn `POLYMARKET_MODE=live`

<p align="center">
  <a href="mailto:antonkarasbiz@gmail.com"><strong>Email</strong></a>
  ·
  <a href="https://t.me/antonkaras_biz"><strong>Telegram</strong></a>
  ·
  <a href="https://discord.com/users/381074277046691222"><strong>Discord</strong></a>
  ·
  <a href="https://x.com/antonkaras_biz"><strong>X</strong></a>
</p>

---

## What this bot does

Paper trading is the default. Live orders go through the official [`@polymarket/client`](https://docs.polymarket.com/getting-started/typescript) SDK, and only after risk checks pass.

<p align="center">
  <img src="./docs/images/architecture.png" alt="Config, market snapshot, risk engine, paper or live venue, official client, Polygon pUSD settlement" width="920" />
</p>

| Layer | Module | Responsibility |
| --- | --- | --- |
| Config | `src/config.ts` | Zod-validated env. Live mode will not start without wallet + signer. |
| Risk | `src/risk.ts` | Kill switch, daily loss, notional cap, position-share cap. First reject wins. |
| Venue | `src/execution.ts` | `PaperVenue` or `createSecureClient` + `placeMarketOrder`. |
| CLI | `src/index.ts` | One JSON object per run. Secrets are never logged. |

---

## Worked book — Fed Decision, September 2026

One live example, not a collage. Snapshot taken 10 September 2026 from [Gamma](https://gamma-api.polymarket.com) and [Data API](https://data-api.polymarket.com/oi).

<p align="center">
  <a href="https://polymarket.com/event/fed-decision-in-september-762">
    <img src="https://polymarket.com/api/og?mslug=fed-decision-in-september-762" alt="Fed Decision in September on Polymarket" width="920" />
  </a>
</p>

| Book | Yes / No | 24h volume | Liquidity | Tick / min size |
| --- | ---: | ---: | ---: | ---: |
| [+25 bps after Sept FOMC](https://polymarket.com/event/fed-decision-in-september-762) | **65.5¢ / 34.5¢** | $1.78M | $576k | 1¢ / 5 shares |
| [No change](https://polymarket.com/event/fed-decision-in-september-762) | **33.5¢ / 66.5¢** | $1.55M | $620k | 1¢ / 5 shares |

Parent event print that day: **$113.9M** lifetime volume, **$26.1M** open interest, **$5.12M** / 24h. Venue-wide open interest was **$358.31M**. 2026 YTD notional (DeFi Rate through late August) was **$56.64B**.

Prices are probabilities. A 65.5¢ Yes is the book’s 65.5% implied chance. Buys lift the ask; sells hit the bid.

---

## Order path I implement

<p align="center">
  <img src="./docs/images/order-lifecycle.png" alt="Sign EIP-712, submit to CLOB, match or rest, settle on Polygon, confirm" width="920" />
</p>

1. **Sign** EIP-712 (`tokenId`, side, price, size, millisecond timestamp). V2 domain version `"2"`.
2. **Submit** to `https://clob.polymarket.com`. Operator checks signature, pUSD/token balance, allowances, tick.
3. **Match or rest.** A market order is a limit priced to cross. Some crypto/finance up-down books hold takers **250 ms**. Sports books can delay around live games. Delayed orders cannot be cancelled.
4. **Settle** on Polygon: outcome tokens one way, pUSD the other. Atomic.
5. **Confirm:** `MATCHED → MINED → CONFIRMED` (or `RETRYING` / `FAILED`).

| Type | Behavior | Where I use it |
| --- | --- | --- |
| **FAK** | Fill what you can, cancel the rest | Live market buy |
| **FOK** | All or nothing | Tight clips |
| **GTC** | Rest until filled or cancelled | Maker quotes ([market-maker](https://github.com/antonkarasbiz/polymarket-market-maker)) |
| **GTD** | Rest until a timestamp | Session-bounded working orders |
| **Post-only** | Reject if it would take | Spread capture |

Auth is two-layer: **L1** wallet EIP-712 to derive API keys, **L2** HMAC-SHA256 on `timestamp + METHOD + path + body` for private CLOB calls.

---

## Risk I refuse to skip

<p align="center">
  <img src="./docs/images/risk-controls.png" alt="50 pUSD notional, 25 pUSD daily loss, 200 share cap, kill switch, paper mode default" width="920" />
</p>

| Control | Env | Default |
| --- | --- | --- |
| Mode | `POLYMARKET_MODE` | `paper` |
| Max notional | `MAX_NOTIONAL_PUSD` | **50 pUSD** |
| Max daily loss | `MAX_DAILY_LOSS_PUSD` | **25 pUSD** |
| Max position | `MAX_POSITION_SHARES` | **200 shares** |
| Kill switch | `KILL_SWITCH` | `false` |

Against the +25 bps ask at **66¢**:

| Intent | Result |
| --- | --- |
| 10 pUSD starter clip | Allowed |
| 50 pUSD ceiling | Allowed |
| 201 shares | `position cap exceeded` |
| −25 pUSD realized PnL | `daily loss limit reached` |
| `KILL_SWITCH=true` | Halt |

Taker fee (official): `C × feeRate × p × (1 − p)`. Makers pay 0. Economics books are 0.05. A 10 pUSD buy of ~15.15 shares at 66¢ is about **0.17 pUSD** in fees. I size notional before fees.

---

## Setup

```bash
git clone https://github.com/antonkarasbiz/polymarket-trading-bot.git
cd polymarket-trading-bot
npm install
cp .env.example .env
npm run paper
npm test
```

```dotenv
POLYMARKET_MODE=paper
POLYMARKET_MARKET_SLUG=will-the-fed-increase-interest-rates-by-25-bps-after-the-september-2026-meeting-649
MAX_NOTIONAL_PUSD=50
MAX_DAILY_LOSS_PUSD=25
MAX_POSITION_SHARES=200
KILL_SWITCH=false
```

Live mode is opt-in. You need a funded Polymarket wallet, pUSD, and Exchange allowance. Do not commit keys. If you want that path done for you, [contact me](mailto:antonkarasbiz@gmail.com).

```json
{
  "ok": true,
  "mode": "paper",
  "market": "will-the-fed-increase-interest-rates-by-25-bps-after-the-september-2026-meeting-649",
  "fill": {
    "orderId": "paper-1778000000000",
    "side": "BUY",
    "notional": 10,
    "shares": 19.6078,
    "price": 0.51,
    "paper": true
  }
}
```

---

## Work with me

I take on Polymarket bot work, custom execution, and reviews. Say what book you want to trade and whether you need paper, live, or maker quotes.

| | |
| --- | --- |
| Email | [antonkarasbiz@gmail.com](mailto:antonkarasbiz@gmail.com) |
| Telegram | [t.me/antonkaras_biz](https://t.me/antonkaras_biz) |
| Discord | [AntonX](https://discord.com/users/381074277046691222) |
| X | [@antonkaras_biz](https://x.com/antonkaras_biz) |
| Portfolio | [anton-karas-portfolio.pages.dev](https://anton-karas-portfolio.pages.dev/) |
| Profile | [github.com/antonkarasbiz](https://github.com/antonkarasbiz) |

---

## License

MIT. Trading can result in total loss of capital. This repository is software, not financial advice.
