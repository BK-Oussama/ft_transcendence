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
