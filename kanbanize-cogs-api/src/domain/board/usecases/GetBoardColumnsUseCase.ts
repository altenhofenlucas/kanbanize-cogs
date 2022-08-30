import { BoardColumnsInput } from "../input/GetBoardColumnsInput";
import { BoardColumnsOutput } from "../output/BoardColumnsOutput";

class GetBoardColumnsUseCase {

  public execute({ columnsIds, boardStructure }: BoardColumnsInput): BoardColumnsOutput {
    let boardColumns: BoardColumnsOutput = { columns: [] };

    Object.keys(boardStructure.columns).map((columnId) => {
      if (columnsIds.includes(parseInt(columnId))) {
        const column = boardStructure.columns[columnId];

        boardColumns.columns.push({
          id: column.column_id,
          name: column.name,
          workflowId: column.workflow_id,
        });
      }
    });

    return boardColumns;
  }
}

export default GetBoardColumnsUseCase;
