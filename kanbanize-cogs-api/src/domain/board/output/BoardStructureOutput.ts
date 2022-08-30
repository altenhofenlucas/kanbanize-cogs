import { BoardWorkflow } from "../entities/BoardWorkflow";

export interface BoardStructureOutput {
  id: number;
  name: string;
  active: boolean;
  workflows: BoardWorkflow;
  columns: any;
}
