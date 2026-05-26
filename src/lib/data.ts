import { demoMarkets } from "@/lib/demo-data";
import type { Market } from "@/lib/marketlab";

export type HomeData = {
  markets: Market[];
};

export type MarketDetailData = HomeData & {
  market: Market | null;
};

export async function getHomeData(): Promise<HomeData> {
  return {
    markets: demoMarkets,
  };
}

export async function getMarketDetail(
  marketId: string,
): Promise<MarketDetailData> {
  const homeData = await getHomeData();

  return {
    ...homeData,
    market:
      homeData.markets.find((candidate) => candidate.id === marketId) ?? null,
  };
}
