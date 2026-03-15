import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/profile.dto';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { };

    async updateUserProfile(id: number, profile: UpdateProfileDto) {
        await this.prisma.user.update({
            where: { id },
            data: profile,
        });
    }

    async updateUserEmail(id: number, updateEmailDto: UpdateEmailDto) {
        await this.prisma.user.update({
            where: { id },
            data: { email: updateEmailDto.email }
        });
    }

    async updateUserPassword(id: number, updatePasswordDto: UpdatePasswordDto) {
        const hashedPassword = await argon2.hash(updatePasswordDto.password);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash: hashedPassword }
        });
    }
}
