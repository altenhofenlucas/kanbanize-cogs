import { getDaysBetweenDates, getDaysBetweenDatesWithoutWeekend, getMillisecondsBetweenDates, getMillisecondsBetweenDatesWithoutWeekend, isAfterDate, isBeforeDate } from "../../../utils/date-utils";

export const STATUS_INITIAL_STATE = 0;
export const STATUS_IN_COLUMN = 1;
export const STATUS_BLOCKED = 2;
export const STATUS_FINISHED = 3;

class CardColumnAnalysis {

  status: number = 0;
  cardId: number = 0;
  columnName: string = '';
  analysisStartDate: string = '';
  analysisEndDate: string = '';
  cardCreationDate: string = '';
  cardCreationAuthor: string = '';

  //** Column */
  author: string = '';
  entryColumnDate: string = '';
  leaveColumnDate: string = '';
  inColumnTime: number = 0;
  inColumnTimeBusiness: number = 0;
  inColumnDays: number = 0;
  inColumnBusinessDays: number = 0;

  //** Blocking */
  blockedBy: string[] = [];
  startBlockingDate: string = '';
  endBlockingDate: string = '';
  blockedTime: number = 0;
  blockedTimeBusiness: number = 0;
  blockedDays: number = 0;
  blockedBusinessDays: number = 0;

  touchTime: number = 0;
  touchTimeBusiness: number = 0;

  constructor(cardId: number, columnName: string, startOfAnalysisDate: string, endOfAnalysisDate: string) {
    this.status = STATUS_INITIAL_STATE;
    this.cardId = cardId;
    this.columnName = columnName;
    this.analysisStartDate = startOfAnalysisDate;
    this.analysisEndDate = endOfAnalysisDate;
  }

  public registerCardCreationDate({ cardCreationDate, cardCreationAuthor }) {
    this.cardCreationDate = cardCreationDate;
    this.cardCreationAuthor = cardCreationAuthor;
  }

  public registerEntryColumnMove({ moveAuthor, moveDate }) {
    if (isAfterDate(moveDate, this.analysisEndDate)) {
      throw new Error(`ERROR (${this.cardId}): Ignorando movimento de entrada da coluna '${this.columnName}' - entrada ocorreu depois da data final de analise`);
    }

    this.status = STATUS_IN_COLUMN;
    this.author = moveAuthor;    
    if (isBeforeDate(moveDate, this.analysisStartDate)) {
      this.entryColumnDate = this.analysisStartDate;
    } else {
      this.entryColumnDate = moveDate;
    }
  }

  public registerLeaveColumnMove({ moveDate }) {
    if (this.status !== STATUS_IN_COLUMN) {
      try {
        this.registerEntryColumnMove({
          moveAuthor: this.cardCreationAuthor,
          moveDate: this.cardCreationDate,
        });  
      } catch (error) {
        throw new Error(`ERROR (${this.cardId}): Ignorando movimento de saída da coluna '${this.columnName}' - card não possui data de entrada valida`);
      }     
    }

    if (isBeforeDate(moveDate, this.analysisStartDate)) {
      this.status = STATUS_INITIAL_STATE;
      this.author = '';
      this.entryColumnDate = '';
      throw new Error(`ERROR (${this.cardId}): Ignorando movimento de saída da coluna '${this.columnName}' - ocorreu antes da data incial de analise`);
    }

    if (isAfterDate(moveDate, this.analysisEndDate)) {
      this.leaveColumnDate = this.analysisEndDate;
    } else {
      this.leaveColumnDate = moveDate;
    }
    
    this.status = STATUS_FINISHED;
    
    this.inColumnTime = getMillisecondsBetweenDates(this.entryColumnDate, this.leaveColumnDate);
    this.inColumnTimeBusiness = getMillisecondsBetweenDatesWithoutWeekend(this.entryColumnDate, this.leaveColumnDate);
    this.inColumnDays = getDaysBetweenDates(this.entryColumnDate, this.leaveColumnDate);
    this.inColumnBusinessDays = getDaysBetweenDatesWithoutWeekend(this.entryColumnDate, this.leaveColumnDate);
    this.touchTime = this.inColumnTime - this.blockedTime;
    this.touchTimeBusiness = this.inColumnTimeBusiness - this.blockedTimeBusiness;
  }

  public registerStartBlocking({ actionAuthor, actionDate }) {
    if (this.status !== STATUS_IN_COLUMN) {
      throw new Error(`ERROR (${this.cardId}): Ignorando bloqueio na coluna '${this.columnName}' - ocorreu fora da coluna`);
    }

    if (isAfterDate(actionDate, this.analysisEndDate)) {
      throw new Error(`ERROR (${this.cardId}): Ignorando bloqueio na coluna '${this.columnName}' - ocorreu depois da data final de analise`);
    }

    if (isBeforeDate(actionDate, this.analysisStartDate)) {
      this.startBlockingDate = this.analysisStartDate;
    } else {
      this.startBlockingDate = actionDate;
    }

    this.status = STATUS_BLOCKED;
    this.blockedBy.push(actionAuthor);
  }

  public registerFinishBlocking({ actionDate }) {
    if (this.status !== STATUS_BLOCKED) {
      throw new Error(`ERROR (${this.cardId}): Ignorando desbloqueio na coluna '${this.columnName}' - ocorreu sem bloqueio`);
    }

    if (isBeforeDate(actionDate, this.analysisStartDate)) {
      this.status = STATUS_IN_COLUMN;
      this.blockedBy.pop();
      this.startBlockingDate = undefined;
      throw new Error(`ERROR (${this.cardId}): Ignorando desbloqueio na coluna '${this.columnName}' - ocorreu depois da data final de analise`);
    }

    if (isAfterDate(actionDate, this.analysisEndDate)) {
      this.endBlockingDate = this.analysisEndDate;
    } else {
      this.endBlockingDate = actionDate;
    }

    this.status = STATUS_IN_COLUMN;

    this.blockedTime += getMillisecondsBetweenDates(this.startBlockingDate, this.endBlockingDate);
    this.blockedTimeBusiness += getMillisecondsBetweenDatesWithoutWeekend(this.startBlockingDate, this.endBlockingDate);
    this.blockedDays += getDaysBetweenDates(this.startBlockingDate, this.endBlockingDate);
    this.blockedBusinessDays += getDaysBetweenDatesWithoutWeekend(this.startBlockingDate, this.endBlockingDate);
  }

}

export default CardColumnAnalysis;