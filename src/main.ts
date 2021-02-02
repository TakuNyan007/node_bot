import ccxt from 'ccxt';
const bitflyer = new ccxt.bitflyer();

const fetchOrderBook = async (
  exchange: ccxt.Exchange,
  symbol: string
): Promise<ccxt.OrderBook> => {
  const orderbook = await exchange.fetchOrderBook(symbol);
  console.log(orderbook);
  return orderbook;
};

fetchOrderBook(bitflyer, 'FX_BTC_JPY');
