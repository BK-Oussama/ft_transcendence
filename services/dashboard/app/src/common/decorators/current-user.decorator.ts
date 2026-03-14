import { createParamDecorator, ExecutionContext, BadRequestException } from "@nestjs/common";

// export const CurrentUser = createParamDecorator(
//     (data: unknown, ctx: ExecutionContext) => {
//         const request = ctx.switchToHttp().getRequest();
//         const userId = request.headers['user-id'];

//         if (!userId) {
//             throw new BadRequestException('user-id header is required');
//         }
        
//         const userIdNumber = Number(userId);
        
//         if (isNaN(userIdNumber) || userIdNumber <= 0) {
//             throw new BadRequestException('user-id must be a valid positive number');
//         }
        
//         return userIdNumber;
//     },
// );

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id; // Populated by JWT auth guard
  },
);