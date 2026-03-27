import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Check if the Dashboard is calling with the Secret
    const internalSecret = request.headers['x-internal-secret'];
    if (internalSecret && internalSecret === process.env.INTERNAL_SERVICE_SECRET) {
      // We "fake" a system user so the app doesn't crash looking for user.id
      request.user = { id: 0, role: 'system' }; 
      return true; 
    }

    // 2. If no secret, do the normal JWT check (for logged-in users)
    return super.canActivate(context) as Promise<boolean>;
  }
}
