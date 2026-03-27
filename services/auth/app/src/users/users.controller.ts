// import { Controller, Patch, Post, Body, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Controller, Get, Patch, Post, Body, Req, UseGuards, UploadedFile, UseInterceptors, Param, ParseIntPipe, Query, Delete } from '@nestjs/common';


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
  @Get()
  async searchUsers(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.searchUsers({
        search,
        sortBy,
        sortOrder,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 5
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
    console.log(`$(req.user.id)`);
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


  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  // 🔴 New: The GDPR deletion endpoint
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Req() req) {
    return this.usersService.deleteUser(req.user.id);
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  

}
