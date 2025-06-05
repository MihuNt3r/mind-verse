class EmotionScore {
  label: string;
  score: number;
}

export class EmotionStateDto {
  results: Array<EmotionScore>;
}
