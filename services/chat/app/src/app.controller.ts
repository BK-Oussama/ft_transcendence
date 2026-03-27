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
async getHistory(@Req() req) {
  const token = req.headers.authorization?.split(' ')[1];
  return this.chatService.getHistory(token);
}

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
  @Get('relationships')
  async getRelationships(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.chatService.getRelationships(req.user.id, token);
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('blocks')
  async getBlockedUsers(@Req() req) {
  const token = req.headers.authorization?.split(' ')[1];
  return this.chatService.getRelationships(req.user.id, token);
}

  @UseGuards(JwtAuthGuard)
  @Post('unblock/:id')
  async unblock(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatService.unblockUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.chatService.getUserProfile(id, token);
  }


}