import { CardColumnsAnalysisOutput } from "../../card/output/CardColumnsAnalysisOutput";

export interface CardAnalysis {
  id: number;
  boardName: string;
  cardId: number;
  cardTitle: string;
  cardType: string;
  cardTags: string;
  isCardTypeCost: boolean;
  cardUrl: string;
  cardPriority: string;
  cardAssignee: string;
  cardExternalUrl: string;
  cardPairProgramming: string;
  cardReviewer: string;
  cardCurrentColumn: string;
  cardPlatform: string;
  cardOrigin: string;
  cardColumnsAnalysis: CardColumnsAnalysisOutput[];
}
