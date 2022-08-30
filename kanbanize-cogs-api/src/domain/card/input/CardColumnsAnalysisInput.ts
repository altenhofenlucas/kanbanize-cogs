import { BoardColumn } from "../../board/entities/BoardColumn";
import { BoardCardsOutput } from "../output/BoardCardOutput";

export interface CardColumnsAnalysisInput {
  card: BoardCardsOutput;
  columns: BoardColumn[];
  analysisInitialDate: Date;
  analysisEndDate: Date;
}
