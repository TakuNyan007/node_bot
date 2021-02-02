import WebSocket from 'ws';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

interface ExchangeWebSocketClient {
  publicEndPoint: string;
  privateEndPoint: string;
  client: WebSocket;
  onOpen(event: WebSocket.OpenEvent): void;
  onMessage(event: WebSocket.MessageEvent): void;
  onError(event: WebSocket.ErrorEvent): void;
}

interface orderBooksMessage {
  channel: 'orderbooks';
  asks: { price: string; size: string }[];
  bids: { price: string; size: string }[];
  symbol: string;
  timestamp: string;
  grouping: string;
}

export default class GmoCoin {
  diff: number;
  private readonly client;
  private readonly publicEndPoint = 'wss://api.coin.z.com/ws/public/v1';
  private readonly privateEndPoint = 'TODO';
  constructor() {
    this.diff = 0;
    this.client = new WebSocket(this.publicEndPoint);
    this.client.onopen = this.onOpen;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.client.onmessage = function (event: WebSocket.MessageEvent) {
      self.onMessageProcess(self, event);
    };
    this.client.onerror = this.onError;
  }
  onOpen(event: WebSocket.OpenEvent): void {
    const message = JSON.stringify({
      command: 'subscribe',
      channel: 'orderbooks',
      symbol: 'BTC',
    });
    event.target.send(message);
  }

  onMessageProcess(self: GmoCoin, event: WebSocket.MessageEvent): void {
    const now = dayjs().tz();
    const data = event.data as string;
    const obj: orderBooksMessage = JSON.parse(data);
    const time = dayjs(obj.timestamp).tz();
    /*     console.log(
      time.format('YYYY-MM-DD HH:mm:ss:SSS'),
      now.format('YYYY-MM-DD HH:mm:ss:SSS')
    ); */
    self.diff = now.diff(time);
  }

  onError(): void {
    throw new Error('Method not implemented.');
  }
}

const exchange = new GmoCoin();

const print = function () {
  console.log('遅延: ', exchange.diff, ' [ms]');
};

setInterval(print, 1000);
