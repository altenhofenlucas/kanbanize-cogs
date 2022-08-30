import CardGateway from "../gateway/CardGateway";

import { GetBoardCardsInput } from "../input/GetBoardCardsInput";
import { BoardCardsOutput } from "../output/BoardCardOutput";

class GetBoardCardsUseCase {

  gateway: CardGateway;

  constructor() {
    this.gateway = new CardGateway();
  }

  public async execute({ apiKey, boardId, workflowIds, filterStartDate }: GetBoardCardsInput): Promise<BoardCardsOutput[]> {

    try {
      let cardIds: string[];

      const cardsFounded = await this.gateway.findActiveCards({ boardId, apiKey });
      if (cardsFounded.length > 1) {
        cardIds = cardsFounded
          .filter(task => workflowIds.includes(task.workflow_id))
          .map(task => task.taskid);  
      }
      
      const archivedCards = await this.gateway.findArchivedCards({ boardId, apiKey, filterStartDate });
      if (archivedCards.length > 1) {
        const archivedCardIds: string[] = archivedCards
          .filter(task => workflowIds.includes(task.workflow_id))
          .map(task => task.taskid);
        cardIds = cardIds.concat(archivedCardIds);
      }

      const cardsDetailsFounded = await this.gateway.findCardsDetails({ boardId, cardIds, apiKey });

      return cardsDetailsFounded.map(card => {
        return {
          id: card.taskid,
          boardId: card.boardid,
          title: card.title,
          type: card.type,
          tags: card.tags,
          assignee: card.assignee,
          priority: card.priority,
          size: card.size,
          externalLink: card.extlink,
          currentColumnName: card.columnname,
          workflowId: card.workflow_id,
          reporter: card.reporter,
          customFields: card.customfields,
          history: card.historydetails,
        }
      });

    } catch (error) {
      console.log(error);
    }
  }

}

export default GetBoardCardsUseCase;
