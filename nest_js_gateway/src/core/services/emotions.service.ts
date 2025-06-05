import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { EmotionStateDto } from '@application/dtos/quote/emotion-state.dto';

@Injectable()
export class EmotionsService {
  constructor(private readonly httpService: HttpService) {}

  async classifyText(text: string): Promise<EmotionStateDto> {
    const payload = { text };

    const response = await firstValueFrom(
      this.httpService.post<EmotionStateDto>('http://localhost:8000/classify', payload),
    );

    return response.data;
  }
}
