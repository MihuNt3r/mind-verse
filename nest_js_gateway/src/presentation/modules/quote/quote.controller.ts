import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { GetRelevantQuoteQuery } from '@application/queries/quote/get-relevant-quote.query';
import { PermissionsGuard } from '@presentation/guards/permissions.guard';
import { JournalEntryDto } from '@application/dtos/quote/journal-entry.dto';

@ApiTags('quotes')
@Controller('quotes')
@UseGuards(PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class QuoteController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get matching quote according to emotions of your journal entry' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a relevant quote according to emotions of your journal entry',
  })
  async getRelevantQuote(@Body() journalEntryDto: JournalEntryDto): Promise<GetRelevantQuoteQuery> {
    return this.queryBus.execute(new GetRelevantQuoteQuery(journalEntryDto));
  }
}
