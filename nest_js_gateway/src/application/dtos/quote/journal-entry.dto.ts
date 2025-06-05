import { IsString } from 'class-validator';

export class JournalEntryDto {
  @IsString()
  text: string;
}
