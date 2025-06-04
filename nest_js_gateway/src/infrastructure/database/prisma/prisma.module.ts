import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaQuotesService } from '@infrastructure/database/prisma/prisma-quotes.service';

@Global()
@Module({
  providers: [PrismaService, PrismaQuotesService],
  exports: [PrismaService, PrismaQuotesService],
})
export class PrismaModule {}
