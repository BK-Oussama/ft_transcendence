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
import { ChatService } from './chat.service';

@WebSocketGateway({
  // Matches the path Nginx expects after stripping /api/chat
  path: '/socket.io',
  // Removed namespace: 'chat' to match your frontend io('https://localhost') call
  cors: {
    origin: '*', // Allows connection through the gateway
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) { }


  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) throw new Error('No token');

      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;

      // 👈 Use 'sub' or 'id' if 'email' is missing
      const identifier = payload.email || `User#${payload.sub}`;
      this.logger.log(`✅ Chat Connected: ${identifier} (${client.id})`);
    } catch (e) {
      this.logger.error(`❌ Connection Refused: ${e.message}`);
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Chat Disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_msg')
  async handleMessage(@MessageBody() data: { content: string }, @ConnectedSocket() client: any) {
    const user = client.data.user;
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

    try {
      // 1. Fetch real-time identity from Auth Service
      const profile = await this.chatService.getUserProfile(user.sub, token);

      // 2. Save with 4 arguments
      const savedMsg = await this.chatService.saveMessage(
        user.sub,
        data.content,
        profile.firstName + ' ' + profile.lastName,
        profile.avatarUrl // 👈 4th argument: real URL from Auth DB
      );

      // 3. Broadcast
      this.server.emit('receive_msg', savedMsg);

    } catch (e) {
      this.logger.error(`❌ Identity fetch failed: ${e.message}`);

      // ouboukou: "Instead of 'User', use the identifier from the JWT (email or ID) as a better fallback"
      const fallbackName = user.email || `User#${user.sub}`;

      const fallback = await this.chatService.saveMessage(user.sub, data.content, fallbackName, null);
      this.server.emit('receive_msg', fallback);
    }
  }

}


