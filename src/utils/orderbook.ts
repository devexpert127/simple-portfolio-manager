import { OrderbookData } from '../context/SerumOrderbookContext';

export const getPriceFromSerumOrderbook = (
  orderbook: OrderbookData,
): number | null => {
  let bump_arr_bid = orderbook?.bids;
  const highorderBidArr = bump_arr_bid.sort(function (a, b){ return b?.price - a?.price });
  const highestBid = highorderBidArr[0]?.price;

  let bump_arr_ask = orderbook?.asks;
  const lowestorderAskArr = bump_arr_ask.sort(function (a, b){ return a?.price - b?.price });
  const lowestAsk = lowestorderAskArr[0]?.price
  if (!highestBid || !lowestAsk) {
    return 0;
  }

  return (lowestAsk + highestBid) / 2;
};



export const getOpenPriceFromSerumOrderbook = (
  orderbook: OrderbookData,
): number | null => {
  // const highestBid = orderbook?.bids[0]?.price;
  const firstAsk = orderbook?.asks[0]?.price;
  if (!firstAsk) {
    return 0;
  }

  return firstAsk;
};
