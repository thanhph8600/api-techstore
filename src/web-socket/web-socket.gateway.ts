import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway as WebSocketGate,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './chat.interface';

@WebSocketGate({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateway {
  @WebSocketServer()
  server: Server = new Server<ServerToClientEvents, ClientToServerEvents>();

  private logger = new Logger('WebSocketGateway');

  @SubscribeMessage('messenger')
  async sendMess(
    @MessageBody()
    payload,
  ) {
    try {
      this.server.emit('messenger', payload); // broadcast messages
      return payload;
    } catch (error) {
      console.log('error emit mess');
      console.log(error);
    }
  }

  @SubscribeMessage('notification')
  async notification(payload) {
    this.server.emit('notification', payload); // broadcast messages
    return payload;
  }

  @SubscribeMessage('payment')
  async payment(payload) {
    console.log(payload);
    this.server.emit('payment', payload); // broadcast messages
    return payload;
  }

  @SubscribeMessage('login')
  async login(payload) {
    console.log(payload);
    this.server.emit('login', payload); // broadcast messages
    return payload;
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
