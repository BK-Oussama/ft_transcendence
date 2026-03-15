import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private logger: Logger = new Logger('WsJwtGuard');

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      // Check for token in the 'auth' object or the 'Authorization' header
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new WsException('Unauthorized: No token provided');
      }

      const payload = await this.jwtService.verifyAsync(token);
      // Attach user to the client for use in controllers/gateways
      client.data.user = payload;
      
      return true;
    } catch (err) {
      this.logger.error(`WS Auth Error: ${err.message}`);
      throw new WsException('Unauthorized access');
    }
  }
}