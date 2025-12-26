
export enum PaintingCategory {
  AUTO = '自动识别',
  LANDSCAPE = '山水',
  BIRD_AND_FLOWER = '花鸟',
  FIGURE = '人物'
}

export enum UserLevel {
  BEGINNER = '初学者',
  PROFESSIONAL = '专业人士'
}

export interface CritiqueResult {
  qualitative: string;
  pros: Array<{ dimension: string; description: string }>;
  cons: Array<{ dimension: string; description: string }>;
  suggestions: string;
  score: number;
  rawMarkdown: string;
}
