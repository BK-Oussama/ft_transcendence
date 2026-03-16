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
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');

  // constructor(private readonly jwtService: JwtService) { }
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService, // 👈 ADD THIS LINE
  ) { }

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


  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('send_msg')
  // async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   const user = client.data.user;

  //   try {
  //     // 1. Save to Database first
  //     const savedMsg = await this.chatService.saveMessage(
  //       user.id,
  //       user.email || 'Anonymous', // Use email or username from JWT payload
  //       data.content
  //     );

  //     // 2. Broadcast the SAVED message (which now has an ID and Timestamp)
  //     this.server.emit('receive_msg', savedMsg);

  //     this.logger.log(`💾 Msg saved & broadcasted from User ${user.id}`);
  //   } catch (e) {
  //     this.logger.error(`❌ Failed to save message: ${e.message}`);
  //   }
  // }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_msg')
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const user = client.data.user;

    try {
      // 👈 CHANGE user.id TO user.sub
      const savedMsg = await this.chatService.saveMessage(
        user.sub, // Use 'sub' because that is what your JWT strategy validates
        user.email || 'Anonymous',
        data.content
      );

      this.server.emit('receive_msg', savedMsg);
      this.logger.log(`💾 Msg saved & broadcasted from User ${user.sub}`);
    } catch (e) {
      this.logger.error(`❌ Failed to save message: ${e.message}`);
      // Optional: Send an error back to the client so the script doesn't hang
      client.emit('error', { message: 'Failed to save message' });
    }
  }

}