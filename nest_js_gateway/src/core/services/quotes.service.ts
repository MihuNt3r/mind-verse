import { QUOTES_REPOSITORY } from '@shared/constants/tokens';
import { IQuotesRepository } from '@core/repositories/quotes.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(QUOTES_REPOSITORY)
    private readonly quotesRepository: IQuotesRepository,
  ) {}


}
