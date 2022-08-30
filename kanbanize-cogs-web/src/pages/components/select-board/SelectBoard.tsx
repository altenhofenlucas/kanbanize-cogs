import { useContext, useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { fetchBoard, FetchBoardResponseColumn, FetchBoardResponseWorkflow } from "../../../api/api";
import { LoggedUserContext } from "../../../App";
import { BoardAnalysisFormContext, Column, Workflow } from "../../BoardAnalysis";

export function SelectBoard({ ...rest }) {
  const [ selectedBoardId, setSelectedBoardId ] = useState<string>('');
  
  const { loggedUserApiKey } = useContext(LoggedUserContext);
  const { handleSelectBoard, handleLoading, visibleBoards, board } = useContext(BoardAnalysisFormContext);

  function onSelectedBoard(event: SelectChangeEvent) {
    setSelectedBoardId(event.target.value);
    const selectedBoardId = parseInt(event.target.value);
    handleLoading(true);
    fetchBoard(selectedBoardId, loggedUserApiKey!)
      .then(({ workflows }) => {
        const visibleBoard = visibleBoards.find((board) => board.id === selectedBoardId);
        if(!visibleBoard) { return; }

        handleSelectBoard({
          id: visibleBoard.id!,
          active: visibleBoard.active!,
          name: visibleBoard.name!,
          workflows: mapResponseWorkflowsToDomainWorkflows(workflows)
        });
        handleLoading(false);
      });
  }

  function mapResponseColumnsToDomainColumns(columns: FetchBoardResponseColumn[]): Column[] {
    return columns.map((column) => {
      return {
        id: column.id,
        name: column.name
      }
    });
  }

  function mapResponseWorkflowsToDomainWorkflows(workflows: FetchBoardResponseWorkflow[]): Workflow[] {
    return workflows.map((workflow) => {
      return {
        id: workflow.id,
        active: !!workflow.active,
        name: workflow.name,
        columns: mapResponseColumnsToDomainColumns(workflow.columns)
      }
    });
  }

  return (
    <>
      <Typography variant="subtitle1">
        Selecione um board:
      </Typography>
      <Select
        defaultValue={''}
        value={ board ? `${board.id}` : selectedBoardId  }
        onChange={onSelectedBoard}
        size="small"
        {...rest}
      >
        {visibleBoards && visibleBoards.map((board) => {
          return (<MenuItem key={board.id} value={board.id}>{board.name}</MenuItem>)
        })}
      </Select>
      <FormHelperText>Selecione um board para realizar a analise.</FormHelperText>
    </>
  )
}