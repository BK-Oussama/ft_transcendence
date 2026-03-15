import { Controller, Get, Post, Param, UseGuards, Req, ParseIntPipe, Headers } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly chatService: ChatService) {}

  // FIX: Added health check for tests.sh
  @Get('health')
  health() { return { status: 'ok' }; }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory() { return this.chatService.getHistory(); }

  @UseGuards(JwtAuthGuard)
  @Post('friend/:id')
  addFriend(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.setRelationship(req.user.id, id, 'FRIEND');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number, @Headers('authorization') auth: string) {
    const token = auth.split(' ')[1];
    return this.chatService.getUserProfile(id, token);
  }
}