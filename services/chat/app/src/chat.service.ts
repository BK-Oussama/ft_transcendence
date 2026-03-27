import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as https from 'https';
import axios from 'axios';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly authUrl = 'https://auth:443';

  private readonly httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  constructor(private prisma: PrismaService) { }

  // --- Messaging Logic with Identity Hydration ---
  async getHistory(token: string) {
    const messages = await this.prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    // Extract unique sender IDs to avoid redundant Auth API calls
    const uniqueSenderIds = [...new Set(messages.map(m => m.senderId))];

    // Fetch fresh profiles for everyone in the history
    const profiles = await Promise.all(
      uniqueSenderIds.map(async (id) => {
        try {
          return await this.getUserProfile(id, token);
        } catch (e) {
          return null; 
        }
      })
    );

    // Create a map: { userId: latestAvatarUrl }
    const avatarMap = profiles.reduce((acc, p) => {
      if (p) acc[p.id] = p.avatarUrl;
      return acc;
    }, {} as Record<number, string | null>);

    // Overwrite the stale DB avatar with the live one from the Auth Service
    return messages.map(msg => ({
      ...msg,
      senderAvatar: avatarMap[msg.senderId] || msg.senderAvatar
    }));
  }

  async saveMessage(userId: number, content: string, senderName: string, avatarUrl: string | null) {
    return this.prisma.message.create({
      data: {
        content,
        senderId: userId,
        senderName,
        senderAvatar: avatarUrl,
      },
    });
  }

  // --- Social Logic ---
  async getRelationships(userId: number, token: string) {
    const rels = await this.prisma.relationship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }]
      },
    });

    return Promise.all(rels.map(async (rel) => {
      const targetId = rel.userId === userId ? rel.friendId : rel.userId;
      try {
        const profile = await this.getUserProfile(targetId, token);
        return {
          ...rel,
          targetName: `${profile.firstName} ${profile.lastName}`,
          targetAvatar: profile.avatarUrl,
        };
      } catch (e) {
        return {
          ...rel,
          targetName: `User #${targetId}`,
          targetAvatar: null,
        };
      }
    }));
  }

  async setRelationship(userId: number, friendId: number, status: string) {
    if (status === 'FRIEND') {
      const updated = await this.prisma.relationship.updateMany({
        where: {
          userId: friendId,
          friendId: userId,
          status: 'PENDING'
        },
        data: { status: 'FRIEND' }
      });
      if (updated.count > 0) return updated;
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
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });
  }

  async getBlockedUsers(userId: number) {
    return this.prisma.relationship.findMany({
      where: { userId, status: 'BLOCKED' },
      select: { friendId: true, createdAt: true }
    });
  }

  // --- Identity Bridge ---
  async getUserProfile(id: number, token: string) {
    try {
      const res = await axios.get(`${this.authUrl}/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        httpsAgent: this.httpsAgent,
      });
      return res.data;
    } catch (err) {
      this.logger.error(`❌ Identity bridge failed for user ${id}: ${err.message}`);
      throw err;
    }
  }
}