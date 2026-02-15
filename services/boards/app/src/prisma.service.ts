import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// 1. IMPORT FROM THE GLOBAL PACKAGE (NOT A RELATIVE PATH)
import { PrismaClient } from '@prisma/client'; 
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 2. Ensure your DATABASE_URL is clean
    const url = process.env.DATABASE_URL;
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
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}