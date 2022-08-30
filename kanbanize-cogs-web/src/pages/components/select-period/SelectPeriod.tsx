import { useContext } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { BoardAnalysisFormContext } from "../../BoardAnalysis";
import styles from "./SelectPeriod.module.css";

export function SelectPeriod() {
  const { handleSelectStartDate, handleSelectEndDate, startDate, endDate } = useContext(BoardAnalysisFormContext);

  function onStartDateChange(value: Date | null) {
    if (!value) { return; }
    handleSelectStartDate(value);
  }
  
  function onEndDateChange(value: Date | null) {
    if (!value) { return; }
    handleSelectEndDate(value);
  }

  return (
    <>
      <Typography align="left" variant="subtitle1">
        Selecione o período de análise:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className={styles.dateInput}>
          <DesktopDatePicker
            label="Início do período de análise"
            value={startDate}
            onChange={onStartDateChange}
            renderInput={(params) => 
              (<TextField {...params} required fullWidth/>)}
          />
        </div>
        <div className={styles.dateInput}>
          <DesktopDatePicker 
            label="Final do período de análise"
            value={endDate}
            onChange={onEndDateChange}
            renderInput={(params: any) => 
              (<TextField className={styles.dateInput} {...params} required fullWidth/>)}
          />
        </div>
      </LocalizationProvider>
    </>
  )
}