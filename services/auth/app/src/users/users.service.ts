import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/profile.dto';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { };

    async updateUserProfile(id: number, profile: UpdateProfileDto) {
        return await this.prisma.user.update({
            where: { id },
            data: profile,
        });
    }

    async updateUserEmail(id: number, updateEmailDto: UpdateEmailDto) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { email: updateEmailDto.email }
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already in use');
            }
            throw error;
        }
    }

    async updateUserPassword(id: number, updatePasswordDto: UpdatePasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (updatePasswordDto.currentPassword) {
            if (!user.passwordHash) {
                throw new BadRequestException('No current password set for this account');
            }
            const isPasswordValid = await argon2.verify(user.passwordHash, updatePasswordDto.currentPassword);
            if (!isPasswordValid) {
                throw new BadRequestException('Current password is incorrect');
            }
        } else if (user.passwordHash) {
            throw new BadRequestException('Current password is required');
        }

        const hashedPassword = await argon2.hash(updatePasswordDto.password);
        return await this.prisma.user.update({
            where: { id },
            data: { passwordHash: hashedPassword }
        });
    }

    async updateUserAvatar(id: number, file: Express.Multer.File) {
        const avatarUrl = `/api/auth/uploads/avatars/${file.filename}`;
        await this.prisma.user.update({
            where: { id },
            data: { avatarUrl }
        });
        return { avatarUrl };
    }

    async searchUsers(params: { search?: string, sortBy?: string, sortOrder?: 'asc'|'desc', page?: number, limit?: number }) {
        const { search, sortBy = 'firstName', sortOrder = 'asc', page = 1, limit = 5 } = params;
        const skip = (page - 1) * limit;

        const where: any = search ? {
            OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const validSortFields = ['firstName', 'lastName', 'email', 'id'];
        const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'firstName';

        const users = await this.prisma.user.findMany({
            where,
            orderBy: { [actualSortBy]: sortOrder },
            skip,
            take: limit,
            select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true }
        });

        const total = await this.prisma.user.count({ where });

        return {
            data: users.map(u => ({
                id: u.id,
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
                email: u.email,
                avatar: u.avatarUrl
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1
            }
        };
    }

    // ouboukou: "Fetch basic profile info for the Chat Service identity sync"
    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                bio: true,       // 👈 Added
                jobTitle: true,  // 👈 Added
                createdAt: true  // 👈 Added for "Member since" info
            },
        });
        if (!user) throw new BadRequestException('User not found');
        return user;
    }
    // 🔴 New: Deletes the user record (GDPR "Right to be Forgotten")


    async deleteUser(id: number) {
        try {
            // Explicitly cast to Number to prevent Prisma type errors
            const userId = Number(id);

            return await this.prisma.user.delete({
                where: { id: userId },
            });
        } catch (error) {
            console.error('❌ Deletion Error:', error.message);
            throw new InternalServerErrorException('Failed to delete user account');
        }
    }
}
