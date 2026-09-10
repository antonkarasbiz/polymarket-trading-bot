export type MarketSnapshot = {
  slug: string;
  conditionId: string;
  yesTokenId: string;
  mid: number;
};

export type Fill = {
  orderId: string;
  side: "BUY" | "SELL";
  notional: number;
  shares: number;
  price: number;
  paper: boolean;
};

export interface ExecutionVenue {
  fetchMarket(slug: string): Promise<MarketSnapshot>;
  submitMarketBuy(tokenId: string, notional: number): Promise<Fill>;
}

export class PaperVenue implements ExecutionVenue {
  constructor(private readonly slug: string) {}

  async fetchMarket(slug: string): Promise<MarketSnapshot> {
    return {
      slug,
      conditionId: "paper-condition",
      yesTokenId: "paper-yes",
      mid: 0.51,
    };
  }

  async submitMarketBuy(tokenId: string, notional: number): Promise<Fill> {
    const price = 0.51;
    return {
      orderId: `paper-${Date.now()}`,
      side: "BUY",
      notional,
      shares: Number((notional / price).toFixed(4)),
      price,
      paper: true,
    };
  }
}

/**
 * Live venue is wired to the official Polymarket client.
 * Keys stay in the environment; this module never logs secrets.
 */
export async function createLiveVenue(): Promise<ExecutionVenue> {
  const [{ createSecureClient, OrderSide }, { privateKey }] = await Promise.all([
    import("@polymarket/client"),
    import("@polymarket/client/viem"),
  ]);

  const client = await createSecureClient({
    wallet: process.env.POLYMARKET_WALLET_ADDRESS,
    signer: privateKey(process.env.POLYMARKET_PRIVATE_KEY!),
  });

  return {
    async fetchMarket(slug) {
      const market = await client.fetchMarket({ slug });
      return {
        slug,
        conditionId: market.conditionId ?? "",
        yesTokenId: market.outcomes.yes.tokenId ?? "",
        mid: Number(market.bestBidAsk?.mid ?? 0.5),
      };
    },
    async submitMarketBuy(tokenId, notional) {
      const response = await client.placeMarketOrder({
        tokenId,
        side: OrderSide.BUY,
        amount: String(notional),
      });
      if (!response.ok) {
        throw new Error(response.message);
      }
      return {
        orderId: response.orderId,
        side: "BUY",
        notional,
        shares: 0,
        price: 0,
        paper: false,
      };
    },
  };
}
