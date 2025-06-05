import { QUOTES_REPOSITORY } from '@shared/constants/tokens';
import { IQuotesRepository } from '@core/repositories/quotes.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EmotionStateDto } from '@application/dtos/quote/emotion-state.dto';

@Injectable()
export class QuotesService {
  constructor(
    @Inject(QUOTES_REPOSITORY)
    private readonly quotesRepository: IQuotesRepository,
  ) {}

  //It may be redundant to create separate service. This logic can be handled in Query Handler
  async findRelevantQuote(emotionsState: EmotionStateDto): Promise<string> {
    const { label } = emotionsState.emotions.reduce((prev, curr) =>
      curr.score > prev.score ? curr : prev,
    );

    return await this.quotesRepository.findMatchingQuote(label);
  }
}
