import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Headers,
  Body // 👈 Added Body import
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly chatService: ChatService) { }

  @Get('health')
  health() { return { status: 'ok' }; }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory() { return this.chatService.getHistory(); }

  // FIX: Read status from Body to support BLOCKED or FRIEND
  @UseGuards(JwtAuthGuard)
  @Post('friend/:id')
  setRelationship(
    @Req() req,
    @Param('id', ParseIntPipe) friendId: number,
    @Body('status') status: 'FRIEND' | 'BLOCKED' // 👈 Extracts 'status' from JSON body
  ) {
    // Falls back to 'FRIEND' if no status is provided in the body
    const finalStatus = status || 'FRIEND';

    // 👈 IMPORTANT: Ensure we use req.user.sub (or id) to match your JWT payload
    const userId = req.user.sub || req.user.id;

    return this.chatService.setRelationship(userId, friendId, finalStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Get('blocks')
  async getBlocks(@Req() req) {
    const userId = req.user.sub || req.user.id;
    return this.chatService.getBlockedUsers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unblock/:id')
  async unblock(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub || req.user.id;
    return this.chatService.unblockUser(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number, @Headers('authorization') auth: string) {
    const token = auth.split(' ')[1];
    return this.chatService.getUserProfile(id, token);
  }
}