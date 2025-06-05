import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaQuotesService } from '@infrastructure/database/prisma/prisma-quotes.service';
import { IQuotesRepository } from '@core/repositories/quotes.repository.interface';
import { processed_quotes as Quote } from '.prisma/client-quotes';

@Injectable()
export class QuotesRepository implements IQuotesRepository {
  constructor(private readonly prisma: PrismaQuotesService) {}

  async findMatchingQuote(emotion: string): Promise<string> {
    const result = await this.prisma.$queryRaw<Quote[]>`
      SELECT *
      FROM processed_quotes
      WHERE EXISTS (
          SELECT 1 FROM jsonb_array_elements(emotion_scores) AS e
          WHERE e->>'label' = ${emotion} AND (e->>'score')::float > 0.6
      )
      ORDER BY RANDOM()
      LIMIT 1;
    `;

    if (!result || result.length === 0) {
      throw new NotFoundException('No matching quote found.');
    }

    return result[0].quote;
  }
}
