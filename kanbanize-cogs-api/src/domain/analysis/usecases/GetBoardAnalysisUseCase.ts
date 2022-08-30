import { GetBoardAnalysisInput } from "../input/GetBoardAnalysisInput";
import { BoardAnalysisOutput } from "../output/BoardAnalysisOutput";

import GetBoardStructureUseCase from "../../board/usecases/GetBoardStructureUseCase";
import { BoardStructureOutput } from "../../board/output/BoardStructureOutput";
import GetBoardCardsUseCase from "../../card/usecases/GetBoardCardsUseCase";
import { BoardCardsOutput } from "../../card/output/BoardCardOutput";
import GetCardColumnsAnalysisUseCase from "../../card/usecases/GetCardColumnsAnalysisUseCase";
import GetBoardColumnsUseCase from "../../board/usecases/GetBoardColumnsUseCase";
import { BoardColumn } from "../../board/entities/BoardColumn";
import { CardColumnsAnalysisOutput } from "../../card/output/CardColumnsAnalysisOutput";
import { getDateFromString, getDateStringWithoutTime } from "../../../utils/date-utils";
import { CardAnalysis } from "../entities/CardAnalysis";
import { BoardColumnsOutput } from "../../board/output/BoardColumnsOutput";

export interface ColumnsFromBoard {
  columnId: string;
  name: string;
  workflowId: number;
}

class GetBoardAnalysisUseCase {

  public async execute({ apiKey, boardId, initialAnalysisDate, endAnalysisDate, selectedColumnsIds }: GetBoardAnalysisInput): Promise<BoardAnalysisOutput> {
    try {
      const getBoardStructureUseCase = new GetBoardStructureUseCase();
      const getBoardColumnsUseCase = new GetBoardColumnsUseCase();
      const getBoardCardsUseCase = new GetBoardCardsUseCase();

      const boardStructure: BoardStructureOutput = await getBoardStructureUseCase.execute({ apiKey, boardId });

      const boardColumns: BoardColumnsOutput = await getBoardColumnsUseCase.execute({
        columnsIds: selectedColumnsIds,
        boardStructure 
      });

      const workflowIds: number[] = this.getSelectedWorkflowIds(boardColumns.columns);

      const cards: BoardCardsOutput[] = await getBoardCardsUseCase.execute({ 
        apiKey,
        boardId,
        workflowIds,
        filterStartDate: getDateStringWithoutTime(initialAnalysisDate),
      });

      let executionCardAnalysisCount = 1;
      let cardAnalysis: CardAnalysis[] = [];

      cards
        .filter(card => this.isCardTypeDevelopment(card.type))
        .forEach((card) => {
          const cardColumnsAnalysisUseCase = new GetCardColumnsAnalysisUseCase();

          const cardColumnAnalysisOutput: CardColumnsAnalysisOutput[] = cardColumnsAnalysisUseCase.execute({
            card,
            columns: boardColumns.columns,
            analysisInitialDate: getDateFromString(initialAnalysisDate),
            analysisEndDate: getDateFromString(endAnalysisDate),
          });

          if (!cardColumnAnalysisOutput.length) {
            return;
          }

          const [platformCustomField] = card.customFields.filter(customField => customField.fieldid === 4);
          const [pairProgrammingCustomField] = card.customFields.filter(customField => customField.fieldid === 13);
          const [reviewerCustomField] = card.customFields.filter(customField => customField.fieldid === 17);
          const [originCustomField] = card.customFields.filter(customField => customField.fieldid === 25);

          cardAnalysis.push({
            id: executionCardAnalysisCount++,
            boardName: boardStructure.name,
            cardId: card.id,
            cardTitle: card.title,
            cardType: card.type,
            cardTags: card.tags,
            isCardTypeCost: this.isCardTypeCost(card.type),
            cardUrl: `https://involves.kanbanize.com/ctrl_board/${boardId}/cards/${card.id}/details/`,
            cardPriority: card.priority,
            cardAssignee: card.assignee,
            cardCurrentColumn: card.currentColumnName,
            cardExternalUrl: card.externalLink,
            cardPairProgramming: pairProgrammingCustomField?.value ?? '',
            cardReviewer: reviewerCustomField?.value ?? '',
            cardPlatform: platformCustomField?.value ?? '',
            cardOrigin: originCustomField?.value ?? '',
            cardColumnsAnalysis: cardColumnAnalysisOutput,
          });
        });

      return {
        boardName: `${boardStructure.name}`,
        columns: boardColumns.columns.map(column => column.name),
        cards: cardAnalysis,
      }
    } catch (error) {
      console.log(error);
    }
  }

  private isCardTypeCost(type: string): boolean {
    return type.toLowerCase().includes('zendesk') || type.toLowerCase().includes('operation');
  }

  private isCardTypeDevelopment(type: string): boolean {
    return !type.toLowerCase().includes('product');
  }

  private getSelectedWorkflowIds(boardColumns: BoardColumn[]) {
    const workflowIds: Set<number> = new Set();
    boardColumns.forEach(column => workflowIds.add(column.workflowId));
    const selectedWorkflowIds: number[] = [...workflowIds];
    return selectedWorkflowIds;
  }
}

export default GetBoardAnalysisUseCase;
