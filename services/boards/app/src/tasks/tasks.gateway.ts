import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from '@prisma/client';

// @WebSocketGateway({ cors: { origin: '*' } })

// just to test, remove when finished
@WebSocketGateway({ 
  cors: { 
    origin: 'http://localhost:5173',
    credentials: true,
  } 
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  broadcastBoardUpdated() {
    this.server.emit('board:updated');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcastTaskCreated(task: Task) {
    this.server.emit('task:created', task);
  }

  broadcastTaskUpdated(task: Task) {
    this.server.emit('task:updated', task);
  }

  sendNotification(message: string) {
    this.server.emit('notification', { message });
  }

  broadcastTaskDeleted(id: number) {
    this.server.emit('task:deleted', { id });
  }
}
