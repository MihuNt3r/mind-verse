import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmotionsService } from '@core/services/emotions.service';

@Module({
  imports: [HttpModule],
  providers: [EmotionsService],
  exports: [EmotionsService],
})
export class EmotionsModule {}
