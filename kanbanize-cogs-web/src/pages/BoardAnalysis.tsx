import { createContext, useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Skeleton from "@mui/material/Skeleton";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { AppHeader } from "./components/app-header/AppHeader";
import { startOfMonth, endOfDay, formatISO } from 'date-fns';

import { SelectBoard } from "./components/select-board/SelectBoard";
import { SelectBoardColumns } from "./components/select-board-columns/SelectBoardColumns";
import { SelectPeriod } from "./components/select-period/SelectPeriod";
import { doAnalysis, fetchAllBoard } from "../api/api";
import { LoggedUserContext } from "../App";

import styles from './BoardAnalysis.module.css';

export type Column = {
  id: number;
  name: string;
}

export type Workflow = {
  id: number;
  active: boolean;
  name: string;
  columns: Column[];
}

export type Board = {
  id: number;
  active: boolean;
  name: string;
  workflows: Workflow[];
}

interface IBoardAnalysisFormContext {
  visibleBoards: Board[];
  board?: Board;
  columns: number[];
  startDate: Date;
  endDate: Date;
  handleLoading: (isLoading: boolean) => void;
  handleSelectBoard: (boardSelected: Board) => void;
  handleSelectColumn: (selectedColumn: number) => void;
  isColumnSelected: (columnId: number) => boolean;
  handleSelectStartDate: (startDate: Date) => void;
  handleSelectEndDate: (endDate: Date) => void;
}

export const BoardAnalysisFormContext = createContext({} as IBoardAnalysisFormContext);

export function BoardAnalysis() {
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ analyseButtonLoading, setAnalyseButtonLoading ] = useState<boolean>(false);
  const [ visibleBoards, setVisibleBoards] = useState<Board[]>([]);
  const [ board, setBoard ] = useState<Board>();
  const [ columns, setColumns ] = useState<number[]>([]);
  const [ startDate, setStartDate ] = useState<Date>(startOfMonth(new Date()));
  const [ endDate, setEndDate ] = useState<Date>(endOfDay(new Date()));

  const { loggedUserApiKey } = useContext(LoggedUserContext);

  useEffect(() => {
    handleLoading(true);
    
    const fetchBoards = async () => {
      const { boards } = await fetchAllBoard(loggedUserApiKey!);
      const filteredBoards = boards.filter((board) => board.active);
      setVisibleBoards(filteredBoards);
      handleLoading(false);
    }

    fetchBoards();
  }, []);

  function handleLoading(isLoading: boolean) {
    setLoading(isLoading);
  }

  function handleSelectBoard(boardSelected: Board) {
    setBoard(boardSelected);
  }

  function handleSelectColumn(selectedColumn: number) {
    if (isColumnSelected(selectedColumn)) {
      const filteredColumns = columns.filter(column => column !== selectedColumn);
      setColumns([...filteredColumns]);
    } else {
      setColumns([...columns, selectedColumn]);
    }
  }

  function isColumnSelected(columnId: number) {
    return columns.indexOf(columnId) !== -1;
  }

  function handleSelectStartDate(newStartDate: Date) {
    setStartDate(newStartDate);
  }

  function handleSelectEndDate(newEndDate: Date) {
    setEndDate(newEndDate);
  }

  const isFormValid = !!board 
    && columns.length
    && !!startDate
    && !!endDate

  async function handleAnalysis() {
    if(!board) { return; }
    setAnalyseButtonLoading(true);

    const file = await doAnalysis({
      boardId: board.id,
      columns,
      startDate: formatISO(startDate, { representation: 'date' }),
      endDate: formatISO(endDate, { representation: 'date' }),
    }, loggedUserApiKey!);

    downloadFile(`board-analysis-${board.id}-${board.name}`, file);
  }

  function downloadFile(fileName: string, file: Blob) {
    const downloadLink = document.createElement("a");
    if (downloadLink.download !== undefined) {
      const url = URL.createObjectURL(file);
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", fileName);
      downloadLink.style.visibility = 'hidden';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    setAnalyseButtonLoading(false);
  }

  return (
    <div className={styles.container}>
      <AppHeader />
      <BoardAnalysisFormContext.Provider value={
        {
          visibleBoards,
          board,
          columns,
          startDate,
          endDate,
          handleLoading,
          handleSelectBoard,
          handleSelectColumn,
          isColumnSelected,
          handleSelectStartDate,
          handleSelectEndDate
        }
      }>
        
        <FormControl margin="normal" fullWidth>
          { 
            loading 
              ? <Skeleton animation="wave"  variant="rectangular" width={700} height={100} /> 
              : <SelectBoard required={true} /> 
          }
        </FormControl>

        <FormControl margin="normal" fullWidth>
          { 
            loading 
              ? <Skeleton animation="wave"  variant="rectangular" width={700} height={90} /> 
              : <SelectBoardColumns /> }
        </FormControl>

        <FormControl margin="normal" fullWidth>
          { 
            loading 
              ? <Skeleton animation="wave"  variant="rectangular" width={700} height={130} /> 
              : <SelectPeriod /> }
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <LoadingButton
            variant="contained"
            endIcon={<SaveAltIcon />}
            loading={analyseButtonLoading}
            loadingPosition="end"
            disabled={!isFormValid}
            onClick={handleAnalysis}
            disableElevation
          >
            Analisar
          </LoadingButton>
        </FormControl>
      </BoardAnalysisFormContext.Provider>
    </div>
  )
}
