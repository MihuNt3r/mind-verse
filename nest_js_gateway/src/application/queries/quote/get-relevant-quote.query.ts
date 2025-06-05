import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuotesService } from '@core/services/quotes.service';
import { JournalEntryDto } from '@application/dtos/quote/journal-entry.dto';
import { EmotionsService } from '@core/services/emotions.service';

export class GetRelevantQuoteQuery implements IQuery {
  constructor(public readonly journalEntry: JournalEntryDto) {}
}

@QueryHandler(GetRelevantQuoteQuery)
export class GetRelevantQuoteQueryHandler implements IQueryHandler<GetRelevantQuoteQuery> {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly emotionsService: EmotionsService,
  ) {}

  async execute(query: GetRelevantQuoteQuery): Promise<string> {
    const { journalEntry } = query;
    const { text } = journalEntry;

    console.log(`Text of entry: ${text}`);
    // Call api of Python microservice to classify journal entry
    const emotionsState = await this.emotionsService.classifyText(text);

    console.log(`Emotions state:`, emotionsState);

    return await this.quotesService.findRelevantQuote(emotionsState);
  }
}
