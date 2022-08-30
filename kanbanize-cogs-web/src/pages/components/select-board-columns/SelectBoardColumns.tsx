import { useContext } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMore from '@mui/icons-material/ExpandMore';

import { BoardAnalysisFormContext } from "../../BoardAnalysis";
import { SelectBoardColumnsList } from "./select-board-columns-list/SelectBoardColumnsList";

export function SelectBoardColumns() {
  const { board, handleSelectColumn, isColumnSelected } = useContext(BoardAnalysisFormContext);

  return (
    <>
      <Typography variant="subtitle1">
        Selecione uma ou mais colunas:
      </Typography>
      {
        !board 
          ? 
            <Accordion disabled>
              <AccordionSummary
                expandIcon={<ExpandMore />}
              >
                <Typography>Escolha um board para continuar</Typography>
              </AccordionSummary>
            </Accordion>
          : 
            (
              board.workflows
                  .filter((workflow) => workflow.active)
                  .map((workflow) => {
                    return (
                      <Accordion key={workflow.name}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography>{workflow.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <SelectBoardColumnsList 
                            workflow={workflow}
                            handleSelectColumn={handleSelectColumn}
                            isColumnSelected={isColumnSelected}
                          />
                        </AccordionDetails>
                      </Accordion>
                  )
                })
            )
      }
    </>
  )
}