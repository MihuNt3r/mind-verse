import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QUOTES_REPOSITORY } from '@shared/constants/tokens';

import { QuoteController } from '@presentation/modules/quote/quote.controller';

import { QuotesRepository } from '@infrastructure/repositories/quotes.repository';

import { QuotesService } from '@core/services/quotes.service';

import { GetRelevantQuoteQueryHandler } from '@application/queries/quote/get-relevant-quote.query';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { EmotionsService } from '@core/services/emotions.service';
import { HttpModule } from '@nestjs/axios';

const queryHandlers = [GetRelevantQuoteQueryHandler];

const commandHandlers = [];

@Module({
  imports: [CqrsModule, PrismaModule, HttpModule],
  controllers: [QuoteController],
  providers: [
    // Services
    {
      provide: QuotesService,
      useClass: QuotesService,
    },
    {
      provide: EmotionsService,
      useClass: EmotionsService,
    },

    // Repository tokens
    {
      provide: QUOTES_REPOSITORY,
      useClass: QuotesRepository,
    },

    // Query handlers
    ...queryHandlers,

    // Command handlers
    ...commandHandlers,
  ],
  exports: [QuotesService],
})
export class QuotesModule {}
