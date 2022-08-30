import fs from 'fs';

import { BoardAnalysisFileOutput } from "../output/BoardAnalysisFileOutput";
import { BoardAnalysisOutput } from "../output/BoardAnalysisOutput";
import { CardColumnsAnalysisOutput } from '../../card/output/CardColumnsAnalysisOutput';

class GetBoardAnalysisReportUseCase {

  public async execute(boardAnalysis: BoardAnalysisOutput): Promise<BoardAnalysisFileOutput> {
    const { boardName, columns, cards } = boardAnalysis;
    const now = new Date();

    const fileName = `${boardName}-${now.getTime()}-export.csv`;
    const filePath = `./tmp/${fileName}`;

    fs.writeFileSync(filePath, this.buildHeaders() + '\r\n');

    cards.forEach(async (card) => {
      const {
        boardName,
        cardId,
        cardTitle,
        cardCurrentColumn,
        cardType,
        cardTags,
        isCardTypeCost,
        cardUrl,
        cardAssignee,
        cardPairProgramming,
        cardReviewer,
        cardColumnsAnalysis,
      } = card;

      cardColumnsAnalysis
        .sort(this.sortByColumnName)
        .forEach(columnAnalysis => {
          const { columnName, author, touchTimeBusiness } = columnAnalysis;
          const row: string[] = [];

          row.push(`"${boardName}"`);
          row.push(`"${cardId}"`);
          row.push(`"${cardTitle}"`);
          row.push(`"${cardCurrentColumn}"`);
          row.push(`"${cardType}"`);
          row.push(`"${cardTags}"`);
          row.push(`"${this.getCostOrInnovationString(isCardTypeCost)}"`);
          row.push(`"${cardUrl}"`);
          row.push(`"${cardAssignee}"`);
          row.push(`"${cardPairProgramming}"`);
          row.push(`"${cardReviewer}"`);
          row.push(`"${columnName}"`);
          row.push(`"${author}"`);
          row.push(`"${this.getTimeToDisplay(touchTimeBusiness)}"`);
          fs.appendFileSync(filePath, row + '\r\n');
        })
    });

    return { fileName, filePath: `./tmp/${fileName}` }
  }

  public removeFile(filePath: string) {
    fs.unlink(filePath, () => { });
  }

  private getCostOrInnovationString(isCardTypeCost: boolean) {
    return isCardTypeCost ? 'Cost' : 'Innovation';
  }

  private sortByColumnName(a: CardColumnsAnalysisOutput, b: CardColumnsAnalysisOutput): number {
    const nameA = a.columnName.toLowerCase();
    const nameB = b.columnName.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  private buildHeaders() {
    const header = [
      'Board Name',
      'Card Id',
      'Card Title',
      'Card Current Column',
      'Card Type',
      'Card Tags',
      'Card Cost/Innovation',
      'Card Url',
      'Card Assignee',
      'Card Pair Programming',
      'Card Reviewer',
      'Column Name',
      'Author',
      'Touch Time',
    ];

    return header.toString();
  }

  private getTimeToDisplay(time: number) {
    if (time === 0) {
      return '00:00:00';
    }
    let seconds: number = parseInt((time / 1000).toFixed());
    let minutes: number = Math.floor(seconds / 60);
    let hours: number = 0;

    let secondsToDisplay: string = "";
    let minutesToDisplay: string = "";
    let hoursToDisplay: string = "";

    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hoursToDisplay = (hours >= 10) ? `${hours}` : `0${hours}`;
      minutes = minutes - (hours * 60);
    }

    minutesToDisplay = (minutes >= 10) ? `${minutes}` : `0${minutes}`;

    seconds = Math.floor(seconds % 60);
    secondsToDisplay = (seconds >= 10) ? `${seconds}` : `0${seconds}`;

    if (hours > 0) {
      return `${hoursToDisplay}:${minutesToDisplay}:${secondsToDisplay}`;
    }
    if (minutes > 0) {
      return `00:${minutesToDisplay}:${secondsToDisplay}`;
    }

    return `00:00:${secondsToDisplay}`;
  }
}

export default GetBoardAnalysisReportUseCase;
