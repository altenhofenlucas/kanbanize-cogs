export interface CardColumnsAnalysisOutput {
  columnName: string;
  author: string;
  entryColumnDate: string;
  leaveColumnDate: string;
  inColumnTime: number;
  inColumnTimeBusiness: number;
  inColumnDays: number;
  inColumnBusinessDays: number;
  blockedBy: string;
  startBlockingDate: string;
  endBlockingDate: string;
  blockedTime: number;
  blockedTimeBusiness: number;
  blockedDays: number;
  blockedBusinessDays: number;
  touchTime: number;
  touchTimeBusiness: number;
}
