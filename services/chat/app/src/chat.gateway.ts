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
  path: '/socket.io',
  cors: { origin: '*', credentials: true },
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

      // ouboukou: "Place user in a private room for targeted real-time updates"
      client.join(`user_${payload.sub}`);
      this.logger.log(`✅ User ${payload.sub} connected to room user_${payload.sub}`);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_msg')
  async handleMessage(@MessageBody() data: { content: string }, @ConnectedSocket() client: any) {
    const user = client.data.user;
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

    try {
      const profile = await this.chatService.getUserProfile(user.sub, token);
      const savedMsg = await this.chatService.saveMessage(
        user.sub,
        data.content,
        `${profile.firstName} ${profile.lastName}`,
        profile.avatarUrl
      );
      this.server.emit('receive_msg', savedMsg);
    } catch (e) {
      const fallback = await this.chatService.saveMessage(user.sub, data.content, user.email || `User#${user.sub}`, null);
      this.server.emit('receive_msg', fallback);
    }
  }

  // ouboukou: "Notify users involved in a social change to refresh their data"
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('refresh_social')
  handleSocialUpdate(@MessageBody() data: { targetId: number }, @ConnectedSocket() client: any) {
    const senderId = client.data.user.sub;
    this.server.to(`user_${data.targetId}`).emit('social_update');
    this.server.to(`user_${senderId}`).emit('social_update');
  }
}