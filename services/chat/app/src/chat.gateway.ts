import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from './auth/ws-jwt.guard';

@WebSocketGateway({
  path: '/socket.io',
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  constructor(private readonly jwtService: JwtService) {}

  // HANDSHAKE AUTH: Blocks unauthorized users before connection
  async handleConnection(client: Socket) {
    try {
      // Extract token from 'auth' object sent by frontend
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload; // Attach user to the socket
      
      this.logger.log(`✅ Chat Connected: ${payload.email} (${client.id})`);
    } catch (e) {
      this.logger.error(`❌ Connection Refused: Invalid Token`);
      client.disconnect(); // Terminate the connection immediately
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Chat Disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_msg')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const user = client.data.user;
    // Broadcast message with verified sender info
    this.server.emit('receive_msg', {
      sender: user.firstName,
      content: data.content,
      timestamp: new Date(),
    });
  }
}