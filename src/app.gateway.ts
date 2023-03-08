import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WalletService } from './wallet/wallet.service';

export interface WalletUpdateTrade {
  userId: string;
  nameWallet: string;
  minusMoney: number;
}

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private walletService: WalletService) {}

  private logger: Logger = new Logger('AppGetway');

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log('Initialzed');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client disconnected ${client.id}`);
    client.broadcast.emit('callEnded');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client connected ${client.id}`);
    client.emit('me', client.id);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('msgToClient', text);
  }

  @SubscribeMessage('msgToGetData')
  handleMessage2(client: Socket, text: string): void {
    this.wss.emit('sentMsgClient', text);
  }

  @SubscribeMessage('getNumber')
  handleRandomTwoNumber(client: Socket, text: string): void {
    const data = {
      result: {
        numberOne: Math.floor(Math.random() * 6) + 1,
        numberTwo: Math.floor(Math.random() * 6) + 1,
      },
    };
    this.wss.emit('dataRandomNumber', data);
  }

  @SubscribeMessage('timeCountdown')
  handleTimeCountdown(client: Socket, text: string): void {
    let time = 0;
    let seconds = 21;
    setInterval(() => {
      if (seconds > 0) {
        seconds--;
      }
      time = seconds;
      if (seconds <= 0) {
        seconds = 21;
      }
      this.wss.emit('timeCountdownSentClient', time);
    }, 1000);
  }

  @SubscribeMessage('buyUp')
  async handleUpBuyEvent(client: Socket, data: WalletUpdateTrade) {
    const idFind = await this.walletService.filterWallet({
      name: data.nameWallet,
    });
    const dataUpdate: any = await this.walletService.updateWallet(idFind.id, {
      ...idFind,
      name: data.nameWallet,
      total: idFind.total - data.minusMoney,
      userId: idFind.userId,
    });
    this.wss.emit('buyUpClient', dataUpdate);
  }

  @SubscribeMessage('buyDown')
  async handleUpSellEvent(client: Socket, data: WalletUpdateTrade) {
    const idFind = await this.walletService.filterWallet({
      name: data.nameWallet,
    });
    const dataUpdate: any = await this.walletService.updateWallet(idFind.id, {
      ...idFind,
      name: data.nameWallet,
      total: idFind.total + data.minusMoney,
      userId: idFind.userId,
    });
    this.wss.emit('buyDownClient', dataUpdate);
  }

  @SubscribeMessage('callUser')
  handleVideoMessage(
    client: Socket,
    { userToCall, signalData, from, name },
  ): void {
    this.wss
      .to(userToCall)
      .emit('callUser', { signal: signalData, from, name });
  }

  @SubscribeMessage('answerCall')
  handleAnswerCall(client: Socket, data): void {
    this.wss.to(data.to).emit('callAccepted', data.signal);
  }
}
