import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as https from 'https';
import * as fs from 'fs';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly authUrl = 'https://auth:443';

  // SSL Agent using the internal certificate generated in the Dockerfile
  private readonly httpsAgent = new https.Agent({
    ca: fs.readFileSync('./secrets/cert.pem'),
  });

  constructor(private prisma: PrismaService) { }

  // Pillar 1: Basic Chat History
  async getHistory() {
    return this.prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Pillar 2: Message Persistence
  async saveMessage(senderId: number, senderName: string, content: string) {
    return this.prisma.message.create({
      data: { senderId, senderName, content },
    });
  }

  // Pillar 3: Friends & Blocking
  // async setRelationship(userId: number, friendId: number, status: 'FRIEND' | 'BLOCKED') {
  //   return this.prisma.relationship.upsert({
  //     where: {
  //       userId_friendId: { userId, friendId },
  //     },
  //     update: { status },
  //     create: { userId, friendId, status },
  //   });
  // }


async setRelationship(userId: number, friendId: number, status: 'FRIEND' | 'BLOCKED') {
  // If I want to be friends, check if they have blocked me first
  if (status === 'FRIEND') {
    const checkBlock = await this.prisma.relationship.findFirst({
      where: {
        userId: friendId,   // The person you are trying to add
        friendId: userId, // YOU
        status: 'BLOCKED'
      }
    });

    if (checkBlock) {
      // Use standard NestJS exception for a 403 response
      throw new ForbiddenException('You cannot add this user: you are blocked.');
    }
  }

  return this.prisma.relationship.upsert({
    where: { userId_friendId: { userId, friendId } },
    update: { status },
    create: { userId, friendId, status },
  });
}

async unblockUser(userId: number, friendId: number) {
  return this.prisma.relationship.deleteMany({
    where: {
      userId: userId,
      friendId: friendId,
      status: 'BLOCKED'
    }
  });
}

async getBlockedUsers(userId: number) {
  return this.prisma.relationship.findMany({
    where: {
      userId: userId,
      status: 'BLOCKED'
    },
    // This allows you to see who they are (if you want to join with Auth later)
    select: { friendId: true, createdAt: true } 
  });
}


  // Pillar 4: Profile Sync (Secure Request to Auth Service)
  async getUserProfile(id: number, token: string) {
    try {
      const res = await fetch(`${this.authUrl}/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // @ts-ignore - node-fetch supports agent, native fetch needs specific types
        agent: this.httpsAgent,
      } as any);

      if (!res.ok) {
        const errorBody = await res.text();
        this.logger.warn(`Auth Service responded with ${res.status}: ${errorBody}`);
        throw new Error();
      }
      return await res.json();
    } catch (e) {
      this.logger.error(`Failed to reach Auth Service: ${e.message}`);
      throw new NotFoundException(`User ${id} not found or Auth Service unreachable`);
    }
  }
}