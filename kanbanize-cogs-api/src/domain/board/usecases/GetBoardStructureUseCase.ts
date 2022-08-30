import BoardGateway from "../gateway/BoardGateway";

import { BoardColumn } from "../entities/BoardColumn";
import { BoardWorkflow } from "../entities/BoardWorkflow";

import { GetBoardStructureInput } from "../input/GetBoardStructureInput";
import { BoardStructureOutput } from "../output/BoardStructureOutput";

interface Board {
  workflow_order: any;
  workflows: any;
  columns: any;
}

interface Workflow {
  name: string;
  position: number;
  is_enabled: boolean;
  top_columns: number[];
}

class GetBoardStructureUseCase {

  gateway: BoardGateway;

  constructor() {
    this.gateway = new BoardGateway();
  }

  public async execute({ boardId, apiKey }: GetBoardStructureInput): Promise<BoardStructureOutput> {

    const boardStructure = await this.gateway.findBoardStructure({ boardId, apiKey });

    return {
      id: boardStructure.id,
      name: boardStructure.name,
      active: !boardStructure.is_archived,
      workflows: this.buildWorkflows(boardStructure),
      columns: boardStructure.columns,
    }

  }

  private buildWorkflows({ workflow_order, workflows, columns }: Board): BoardWorkflow {

    return workflow_order.map((id: number) => {
      const { name, position, is_enabled, top_columns }: Workflow = workflows[id]
      return {
        id,
        name: name,
        position: position,
        active: is_enabled,
        columns: this.buildColumns(columns, top_columns),
      }
    });
  }

  private buildColumns(columns: any, ids: number[]): BoardColumn[] {
    return ids.map(id => {
      const column = columns[id];
      return {
        id,
        workflowId: column.workflow_id,
        name: column.name
      }
    });
  }
}

export default GetBoardStructureUseCase;
