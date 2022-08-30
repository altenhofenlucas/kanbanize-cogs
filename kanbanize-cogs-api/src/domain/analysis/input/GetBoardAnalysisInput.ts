export interface GetBoardAnalysisInput {
  apiKey: string;
  boardId: string;
  initialAnalysisDate: string;
  endAnalysisDate: string;
  selectedColumnsIds: number[];
}
