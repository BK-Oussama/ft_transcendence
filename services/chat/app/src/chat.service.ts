import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  // Internal service name 'auth' is correct for Docker networking
  private readonly authUrl = 'https://auth:443'; 

  constructor(private prisma: PrismaService) {}

  // Pillar 1: Basic Chat History
  async getHistory() {
    return this.prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Required for your ChatGateway
  async saveMessage(senderId: number, senderName: string, content: string) {
    return this.prisma.message.create({
      data: { senderId, senderName, content },
    });
  }

  // Pillar 2: Friends & Blocking
  async setRelationship(userId: number, friendId: number, status: 'FRIEND' | 'BLOCKED') {
    return this.prisma.relationship.upsert({
      where: {
        userId_friendId: { userId, friendId },
      },
      update: { status },
      create: { userId, friendId, status },
    });
  }

  // Pillar 3: Profile System (Auth Sync)
  async getUserProfile(id: number, token: string) {
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

      // TRY THIS: If it still 404s, try adding /api/users/${id} if Auth has a prefix
      const res = await fetch(`${this.authUrl}/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        this.logger.warn(`Auth Service responded with ${res.status}: ${errorBody}`);
        throw new Error();
      }
      return await res.json();
    } catch (e) {
      throw new NotFoundException(`User ${id} not found in Auth Service database`);
    }
  }
}