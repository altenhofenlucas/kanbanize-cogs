import { CardCustomField } from "../entities/CardCustomField";
import { CardHistoryEvent } from "../entities/CardHistoryEvent";

export interface BoardCardsOutput {
  id: number;
  boardId: number;
  title: string;
  type: string;
  tags: string;
  assignee: string;
  priority: string;
  size: string;
  externalLink: string;
  currentColumnName: string;
  workflowId: number;
  reporter: string;
  customFields: CardCustomField[];
  history: CardHistoryEvent[];
}
