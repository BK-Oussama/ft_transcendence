import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from '@prisma/client';


// @WebSocketGateway({ cors: { origin: '*' } })



// removed this only to be able to merge, if it cause any problem i will remove it
// @WebSocketGateway({
//   path: '/socket.io', 
//   namespace: 'boards', 
//   cors: { origin: 'http://localhost:5173', credentials: true }
// })


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
  }

  handleDisconnect(client: Socket) {
  }

  broadcastTaskCreated(task: Task) {
    this.server.emit('task:created', task);
  }

  broadcastTaskUpdated(task: Task) {
    this.server.emit('task:updated', task);
  }

  sendNotification(message: string, priority?: string) {
    this.server.emit('notification', { message, priority });
  }
  broadcastTaskDeleted(id: number) {
    this.server.emit('task:deleted', { id });
  }
}
