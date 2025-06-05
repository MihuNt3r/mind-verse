import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QuotesService } from '@core/services/quotes.service';
import { JournalEntryDto } from '@application/dtos/quote/journal-entry.dto';
import { EmotionStateDto } from '@application/dtos/quote/emotion-state.dto';

export class GetRelevantQuoteQuery implements IQuery {
  constructor(public readonly journalEntry: JournalEntryDto) {}
}

@QueryHandler(GetRelevantQuoteQuery)
export class GetRelevantQuoteQueryHandler implements IQueryHandler<GetRelevantQuoteQuery> {
  constructor(private readonly quotesService: QuotesService) {}

  async execute(_query: GetRelevantQuoteQuery): Promise<string> {
    // const { journalEntry } = query;
    // const { text }= journalEntry;
    // Call api of Python microservice to classify journal entry
    // const emotionsState = fetch('http://localhost:8080/classify')

    const emotionsState = { emotions: [{ label: 'love', score: 0.2 }] } as EmotionStateDto;
    const quote = await this.quotesService.findRelevantQuote(emotionsState);

    return quote;
  }
}
