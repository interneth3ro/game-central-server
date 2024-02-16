import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TimerEvents } from './events';
import { startTimerForRoom, stopTimerForRoom } from './rooms';

@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() client: any, ...args: any[]) {
    client.join(client.handshake.query.room);
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    client.leave(client.handshake.query.room);
  }

  @SubscribeMessage(TimerEvents.timerStart.toString())
  startTimer(@ConnectedSocket() client: any, @MessageBody() body: any): void {
    // stop any existing timers for this room
    stopTimerForRoom(client.handshake.query.room);

    // start a new timer for the room
    startTimerForRoom(this.server, client.handshake.query.room, body.duration);
  }

  @SubscribeMessage(TimerEvents.timerStop.toString())
  stopTimer(@ConnectedSocket() client: any): void {
    stopTimerForRoom(client.handshake.query.room);
  }
}
