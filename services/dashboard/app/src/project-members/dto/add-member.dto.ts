import { IsInt, IsEnum } from 'class-validator';

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export class AddMemberDto {
  @IsInt()
  userId: number;

  @IsEnum(MemberRole)
  role: MemberRole;
}