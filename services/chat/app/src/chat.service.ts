import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as https from 'https';
import axios from 'axios';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly authUrl = 'https://auth:443';

  // ouboukou: "Trust internal self-signed certificates for Docker networking"
  private readonly httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  constructor(private prisma: PrismaService) { }

  // --- Messaging Logic ---
  async getHistory() {
    return this.prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
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

  // --- Social Logic (Pending / Friend / Block) ---
  // async getRelationships(userId: number) {
  //   return this.prisma.relationship.findMany({
  //     where: {
  //       OR: [{ userId: userId }, { friendId: userId }]
  //     },
  //   });
  // }

  async getRelationships(userId: number, token: string) {
    const rels = await this.prisma.relationship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }]
      },
    });

    return Promise.all(rels.map(async (rel) => {
      // Determine who the "other" person is
      const targetId = rel.userId === userId ? rel.friendId : rel.userId;

      try {
        const profile = await this.getUserProfile(targetId, token);
        return {
          ...rel,
          targetName: `${profile.firstName} ${profile.lastName}`,
          targetAvatar: profile.avatarUrl,
        };
      } catch (e) {
        // Fallback if the Auth service is down or user is deleted
        return {
          ...rel,
          targetName: `User #${targetId}`,
          targetAvatar: null,
        };
      }
    }));
  }

  async setRelationship(userId: number, friendId: number, status: string) {
    // If accepting a request: Look for an existing PENDING request sent to YOU
    if (status === 'FRIEND') {
      const updated = await this.prisma.relationship.updateMany({
        where: {
          userId: friendId,   // The sender
          friendId: userId,   // You (the receiver)
          status: 'PENDING'
        },
        data: { status: 'FRIEND' }
      });
      if (updated.count > 0) return updated;
    }

    // Otherwise (New Pending or Block): Upsert the record
    return this.prisma.relationship.upsert({
      where: { userId_friendId: { userId, friendId } },
      update: { status },
      create: { userId, friendId, status },
    });
  }


  async unblockUser(userId: number, friendId: number) {
    // ouboukou: "This now deletes the record regardless of status (Pending or Blocked)"
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

  // ouboukou: "Returns the user to a 'Stranger' state by removing the DB record"
  async removeRelationship(userId: number, friendId: number) {
    return this.prisma.relationship.deleteMany({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });
  }
}