import { Controller, Patch, Post, Body, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/profile.dto';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
    return this.usersService.updateUserProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateUserAvatar(req.user.id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/email')
  updateEmail(@Req() req, @Body() body: UpdateEmailDto) {
    return this.usersService.updateUserEmail(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(@Req() req, @Body() body: UpdatePasswordDto) {
    return this.usersService.updateUserPassword(req.user.id, body);
  }

}
