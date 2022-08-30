import { CardHistoryEvent } from "../entities/CardHistoryEvent";
import CardColumnAnalysis, { STATUS_BLOCKED, STATUS_INITIAL_STATE, STATUS_IN_COLUMN } from "../entities/CardColumnAnalysis";

import { CardColumnsAnalysisInput } from "../input/CardColumnsAnalysisInput";
import { CardColumnsAnalysisOutput } from "../output/CardColumnsAnalysisOutput";

import {
  getStringDateFromJSDate,
  getEndOfBusinnesDay,
  getStartOfBusinnesDay,
  isBeforeDate,
  isAfterDate
} from "../../../utils/date-utils";

const EVENT_TYPE_UPDATE = 'Updates';
const EVENT_TYPE_TRANSITION = 'Transitions';
const EVENT_TYPE_BLOCK = 'Blocks';

const EVENT_ACTION_TASK_CREATED = 'Task created';
const EVENT_ACTION_TASK_MOVED = 'Task moved';
const EVENT_ACTION_TASK_BLOCKED = 'Task blocked';
const EVENT_ACTION_TASK_UNBLOCKED = 'Task unblocked';

class GetCardColumnsAnalysisUseCase {

  public execute({ card, columns, analysisInitialDate, analysisEndDate }: CardColumnsAnalysisInput): CardColumnsAnalysisOutput[] {
    const cardHistory: CardHistoryEvent[] = card.history.sort(this.compareByHistoryId);
    const startOfAnalysisDate = getStartOfBusinnesDay(getStringDateFromJSDate(analysisInitialDate));
    const endOfAnalysisDate = getEndOfBusinnesDay(getStringDateFromJSDate(analysisEndDate));

    const columnsNames: string[] = columns
      .filter(column => column.workflowId === card.workflowId)
      .map(column => column.name);

    const output: CardColumnsAnalysisOutput[] = [];
    let allAnalysisColumns: CardColumnAnalysis[] = [];

    try {
      columnsNames.forEach(currentColumnName => {

        let cardCurrentColumnAnalysis = new CardColumnAnalysis(card.id, currentColumnName, startOfAnalysisDate, endOfAnalysisDate);

        cardHistory.forEach(event => {
          const { eventtype, historyevent, details, entrydate: eventDate, author } = event;

          if (isAfterDate(eventDate, endOfAnalysisDate)) {
            return;
          }

          if (eventtype === EVENT_TYPE_UPDATE && historyevent === EVENT_ACTION_TASK_CREATED) {
            cardCurrentColumnAnalysis.registerCardCreationDate({ 
              cardCreationDate: eventDate,
              cardCreationAuthor: author
            });
          }

          if (eventtype === EVENT_TYPE_TRANSITION && historyevent === EVENT_ACTION_TASK_MOVED) {
            const moveColumns = this.getMoveColumns(details);
            if (!moveColumns) {
              return;
            }

            const { fromColumn, toColumn } = moveColumns;

            if (currentColumnName === toColumn) {
              try {
                cardCurrentColumnAnalysis.registerEntryColumnMove({
                  moveAuthor: author,
                  moveDate: eventDate
                });
              } catch (error) {
                console.log(error.message);
              } finally {
                return;
              }
            }

            if (currentColumnName === fromColumn) {
              try {
                cardCurrentColumnAnalysis.registerLeaveColumnMove({
                  moveDate: eventDate,
                });

                allAnalysisColumns.push(cardCurrentColumnAnalysis);
                cardCurrentColumnAnalysis = new CardColumnAnalysis(card.id, currentColumnName, startOfAnalysisDate, endOfAnalysisDate);
              } catch (error) {
                console.log(error.message);
              } finally {
                return;
              }
            }
          }

          if (eventtype === EVENT_TYPE_BLOCK) {
            if (historyevent === EVENT_ACTION_TASK_BLOCKED) {
              try {
                cardCurrentColumnAnalysis.registerStartBlocking({
                  actionAuthor: author,
                  actionDate: eventDate,
                });
              } catch (error) {
                console.log(error.message);
              } finally {
                return;
              }              
            }

            if (historyevent === EVENT_ACTION_TASK_UNBLOCKED) {
              try {
                cardCurrentColumnAnalysis.registerFinishBlocking({
                  actionDate: eventDate,
                });  
              } catch (error) {
                console.log(error.message);
              } finally {
                return;
              }
            }
          }
        });

        if (cardCurrentColumnAnalysis.status === STATUS_BLOCKED) {
          console.log(`INFO (${card.id}): Card continua bloqueado na coluna '${currentColumnName}'`);
          cardCurrentColumnAnalysis.registerFinishBlocking({
            actionDate: endOfAnalysisDate,
          });
        }

        if (cardCurrentColumnAnalysis.status === STATUS_IN_COLUMN) {
          console.log(`INFO (${card.id}): Card continua na coluna '${currentColumnName}'`);
          cardCurrentColumnAnalysis.registerLeaveColumnMove({
            moveDate: endOfAnalysisDate,
          });

          allAnalysisColumns.push(cardCurrentColumnAnalysis);
          cardCurrentColumnAnalysis = new CardColumnAnalysis(card.id, currentColumnName, startOfAnalysisDate, endOfAnalysisDate);
        }

        if (!allAnalysisColumns.length) {
          return;
        }

        allAnalysisColumns.map(analysis => {
          output.push({
            columnName: analysis.columnName,
            author: analysis.author,
            entryColumnDate: analysis.entryColumnDate,
            leaveColumnDate: analysis.leaveColumnDate,
            inColumnTime: analysis.inColumnTime,
            inColumnTimeBusiness: analysis.inColumnTimeBusiness,
            inColumnDays: analysis.inColumnDays,
            inColumnBusinessDays: analysis.inColumnBusinessDays,
            blockedBy: analysis.blockedBy.toString(),
            startBlockingDate: analysis.startBlockingDate,
            endBlockingDate: analysis.endBlockingDate,
            blockedTime: analysis.blockedTime,
            blockedTimeBusiness: analysis.blockedTimeBusiness,
            blockedDays: analysis.blockedDays,
            blockedBusinessDays: analysis.blockedBusinessDays,
            touchTime: analysis.touchTime,
            touchTimeBusiness: analysis.touchTimeBusiness,
          });
        });

        allAnalysisColumns = [];
      });

      return output;
    } catch (error) {
      console.log(error);
    }
  }

  private getMoveColumns(details: string): { fromColumn: string, toColumn: string } {
    const regexColumnName = /'(.*?)'/g;
    const columns = details.match(regexColumnName);
    if (!columns) { return }

    const fromColumn = columns[0].replace("'", '').replace("'", '');
    const secondColumn = columns.length > 2 ? columns[2] : columns[1];
    const toColumn = secondColumn.replace("'", '').replace("'", '');
    return {
      fromColumn,
      toColumn
    }
  }

  private compareByHistoryId(eventA: CardHistoryEvent, eventB: CardHistoryEvent) {
    const idA = parseInt(eventA.historyid);
    const idB = parseInt(eventB.historyid);

    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  }
}

export default GetCardColumnsAnalysisUseCase;
