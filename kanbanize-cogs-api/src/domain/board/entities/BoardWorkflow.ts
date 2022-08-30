import { BoardColumn } from "./BoardColumn";

export interface BoardWorkflow {
  id: number;
  name: string;
  position: string;
  active: boolean;
  columns: BoardColumn[],
}
