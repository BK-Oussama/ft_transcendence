import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // HARD-CODED CHECK: If process.env is failing us, this fallback will save it
    const url = process.env.DATABASE_URL || "postgresql://user:pass@auth-db:5432/auth_db?schema=public";
    
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
    console.log('🛠️ PrismaService initialized with URL:', url);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ NestJS connected to DB');
    } catch (e) {
      console.error('❌ NestJS failed to connect:', e);
      // This will help us see the EXACT error in 'docker logs auth'
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}