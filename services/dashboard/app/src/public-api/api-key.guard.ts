import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
 constructor(private cfg: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const incoming = req.headers['x-api-key'] as string;
    const valid = this.cfg.get<string>('PUBLIC_API_KEYS')?.split(',') ?? [];

    if (!incoming || !valid.includes(incoming.trim()))
      throw new UnauthorizedException('Invalid or missing API key');

    return true;
  }
}