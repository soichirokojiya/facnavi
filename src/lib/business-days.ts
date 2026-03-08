/**
 * リードフィー締め日ユーティリティ
 * 締め日: リード発生月の翌月10日
 */

/**
 * 指定月の締め日（翌月10日 23:59:59）を返す
 */
export function getDeadline(year: number, month: number): Date {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return new Date(nextYear, nextMonth - 1, 10, 23, 59, 59, 999);
}

/**
 * 指定月の締め日を過ぎているかを返す
 */
export function isDeadlinePassed(year: number, month: number): boolean {
  return new Date() > getDeadline(year, month);
}
