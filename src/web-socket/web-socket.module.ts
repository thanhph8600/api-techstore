import { Module } from '@nestjs/common';
import { WebSocketGateway } from './web-socket.gateway';

@Module({
  providers: [WebSocketGateway],
  exports: [WebSocketGateway],
})
export class WebSocketModule {}
