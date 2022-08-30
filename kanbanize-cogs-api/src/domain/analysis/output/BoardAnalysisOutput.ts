import { CardAnalysis } from "../entities/CardAnalysis";

export interface BoardAnalysisOutput {
  boardName: string;
  columns: string[];
  cards: CardAnalysis[];
}
