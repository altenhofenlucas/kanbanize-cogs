import { DateTime, Interval } from "luxon";

const EIGHT_HOURS_MILLISECONDS = 28800000;

export const getMillisecondsBetweenDates = (start: string, end: string): number => {
  const startDateTime = DateTime.fromSQL(start, { locale: global.locale });
  const endDateTime = DateTime.fromSQL(end, { locale: global.locale });
  return Interval.fromDateTimes(startDateTime, endDateTime).toDuration().toMillis();
}

export const getMillisecondsBetweenDatesWithoutWeekend = (start: string, end: string): number => {
  let startDateTime = DateTime.fromSQL(start, { locale: global.locale });
  let endDateTime = DateTime.fromSQL(end, { locale: global.locale });

  if (hasSameDate(startDateTime, endDateTime)) {
    return endDateTime.diff(startDateTime, 'milliseconds').toObject().milliseconds;
  }

  startDateTime = normalizeBusinessDate(startDateTime);
  endDateTime = normalizeBusinessDate(endDateTime);

  let currentDate = startDateTime.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  let totalTimeWithoutWeekend: number = 0;

  while (currentDate.toMillis() <= endDateTime.toMillis()) {
    if (currentDate.weekday < 6) {

      if (hasSameDate(currentDate, startDateTime)) {
        const startDateEndOfDay = startDateTime.set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
        totalTimeWithoutWeekend += startDateEndOfDay.diff(startDateTime, 'milliseconds').toObject().milliseconds;
      } else if (hasSameDate(currentDate, endDateTime)) {
        const endDateStartOfDay = endDateTime.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
        totalTimeWithoutWeekend += endDateTime.diff(endDateStartOfDay, 'milliseconds').toObject().milliseconds;
      } else {
        totalTimeWithoutWeekend += EIGHT_HOURS_MILLISECONDS;
      }
    }
    currentDate = currentDate.plus({ day: 1 });
  }

  return totalTimeWithoutWeekend;
}

export const getDaysBetweenDates = (start: string, end: string): number => {
  const startDateTime = DateTime.fromSQL(start, { locale: global.locale });
  const endDateTime = DateTime.fromSQL(end, { locale: global.locale });
  const days = Interval.fromDateTimes(startDateTime, endDateTime).toDuration('days').toObject().days;
  return days < 1 ? 0 : days;
}

export const getDaysBetweenDatesWithoutWeekend = (start: string, end: string): number => {
  const startDateTime = DateTime.fromSQL(start, { locale: global.locale });
  const endDateTime = DateTime.fromSQL(end, { locale: global.locale });

  if (startDateTime.day === endDateTime.day) {
    return 1;
  }

  let currentDate = startDateTime;
  let daysWithoutWeekend: number = 0;

  while (currentDate.toMillis() <= endDateTime.toMillis()) {
    if (currentDate.weekday < 6) {
      daysWithoutWeekend++;
    }
    currentDate = currentDate.plus({ day: 1 });
  }

  return daysWithoutWeekend;
}

export const getDateTimeFromString = (date: string): DateTime => {
  return DateTime.fromSQL(date, { locale: global.locale });
}

export const getDateStringWithoutTime = (date: string): string => {
  return DateTime.fromSQL(date, { locale: global.locale }).toFormat('yyyy-MM-dd');
}

export const getDateFromString = (date: string): Date => {
  const newDate = DateTime.fromSQL(date, { locale: global.locale });
  return newDate.toJSDate();
}

export const getStringDateFromJSDate = (date: Date): string => {
  const newDate = DateTime.fromJSDate(date);
  return newDate.toSQL();
}

export const getStartOfBusinnesDay = (date: string): string => {
  const newDate = DateTime.fromSQL(date, { locale: global.locale });
  return newDate.set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).toSQL();
}

export const getEndOfBusinnesDay = (date: string): string => {
  const newDate = DateTime.fromSQL(date, { locale: global.locale });
  return newDate.set({ hour: 18, minute: 0, second: 0, millisecond: 0 }).toSQL();
}

export const getCurrentStringDate = (): string => {
  return DateTime.now().toSQL();
}

export const isBeforeDate = (referenceDate: string, otherDate: string): boolean => {
  const firstDate = DateTime.fromSQL(referenceDate, { locale: global.locale });
  const secondDate = DateTime.fromSQL(otherDate, { locale: global.locale });
  return firstDate < secondDate;
}

export const isAfterDate = (referenceDate: string, otherDate: string): boolean => {
  const firstDate = DateTime.fromSQL(referenceDate, { locale: global.locale });
  const secondDate = DateTime.fromSQL(otherDate, { locale: global.locale });
  return firstDate > secondDate;
}

export const getBusinessTimeBetweenDates = (start: string, end: string): number => {
  const startDateTime = DateTime.fromSQL(start, { locale: global.locale });
  const endDateTime = DateTime.fromSQL(end, { locale: global.locale });

  if (startDateTime.day === endDateTime.day) {
    return endDateTime.diff(startDateTime, 'milliseconds').toObject().milliseconds;
  }

  let currentDate = startDateTime;
  let totalBusinessTime: number = 0;

  while (currentDate.toMillis() <= endDateTime.toMillis()) {
    if (currentDate.weekday < 6) {

      if (hasSameDate(currentDate, startDateTime)) {
        const startDateEndOfDay = startDateTime.set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
        totalBusinessTime += startDateEndOfDay.diff(startDateTime, 'milliseconds').toObject().milliseconds;
      } else if (hasSameDate(currentDate, endDateTime)) {
        const endDateStartOfDay = endDateTime.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
        totalBusinessTime += endDateTime.diff(endDateStartOfDay, 'milliseconds').toObject().milliseconds;
      } else {
        totalBusinessTime += 8;
      }
    }
    currentDate = currentDate.plus({ day: 1 });
  }

  return totalBusinessTime;
}
function normalizeBusinessDate(date: DateTime) {
  if (date.hour < 8) {
    date = date.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  } else if (date.hour > 17) {
    date = date.set({ hour: 18, minute: 0, second: 0, millisecond: 0 });
  }
  return date;
}

function hasSameDate(leftDate: DateTime, rightDate: DateTime) {
  return leftDate.hasSame(rightDate, 'day') && leftDate.hasSame(rightDate, 'month') && leftDate.hasSame(rightDate, 'year');
}
