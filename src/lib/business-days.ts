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

/**
 * 指定日から5営業日（土日除く）経過しているかを返す
 */
export function isLeadConfirmed(createdAt: string): boolean {
  const start = new Date(createdAt);
  let added = 0;
  const d = new Date(start);
  while (added < 5) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      added++;
    }
  }
  // 5営業日後の終わり（23:59:59）を過ぎているか
  d.setHours(23, 59, 59, 999);
  return new Date() > d;
}
