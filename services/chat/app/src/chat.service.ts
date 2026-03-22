import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as https from 'https';
import * as fs from 'fs';

import axios from 'axios';


@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly authUrl = 'https://auth:443';

// Tell the HTTPS agent to allow self-signed certificates for internal communication
  private readonly httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  constructor(private prisma: PrismaService) { }

  // Pillar 1: Basic Chat History
  async getHistory() {
    return this.prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveMessage(userId: number, content: string, senderName: string, avatarUrl: string | null) {
    return this.prisma.message.create({
      data: {
        content: content,
        senderId: userId,
        senderName: senderName,
        senderAvatar: avatarUrl, // 👈 Now saving this to the DB!
      },
    });
  }



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
      const res = await axios.get(`${this.authUrl}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        httpsAgent: this.httpsAgent, // Axios respects this!
      });
      return res.data;
    } catch (err) {
      this.logger.error(`Failed to fetch profile: ${err.message}`);
      throw err;
    }
  }
}