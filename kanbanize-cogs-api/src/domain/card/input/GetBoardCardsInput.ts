export interface GetBoardCardsInput {
  apiKey: string;
  boardId: string;
  workflowIds: number[];
  filterStartDate: string;
}
