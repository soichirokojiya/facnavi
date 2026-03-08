import { getDeadline, isDeadlinePassed, isLeadConfirmed } from "@/lib/business-days";

export interface LeadRow {
  id: string;
  status: string;
  created_at: string;
  updated_at: string | null;
}

export interface MonthlyStats {
  month: string; // "2026-03"
  total: number;
  removed: number;
  takedownRequested: number;
  confirmedCount: number;    // active + 5営業日経過
  unconfirmedCount: number;  // active + 5営業日以内
  confirmed: boolean; // 翌月10日経過で月次確定
}

/**
 * リードのフィー計上月を決定する
 *
 * 基本: created_at の月に計上
 * 例外: 締め日を過ぎても審査中だったリードが後から確定した場合、
 *       確定時点（updated_at）が属する締め月に計上
 */
export function getBillingMonth(lead: LeadRow): string {
  const created = new Date(lead.created_at);
  const createdYear = created.getFullYear();
  const createdMonth = created.getMonth() + 1;
  const createdKey = `${createdYear}-${String(createdMonth).padStart(2, "0")}`;
  const createdDeadline = getDeadline(createdYear, createdMonth);

  // 審査中ならまだ確定していないので created_at 月に仮計上
  if (lead.status === "takedown_requested") {
    return createdKey;
  }

  // updated_at がない、または締め日以前に確定 → created_at 月
  const updated = lead.updated_at ? new Date(lead.updated_at) : null;
  if (!updated || updated <= createdDeadline) {
    return createdKey;
  }

  // 締め日後に確定 → updated_at が属する締め月に計上
  const updatedDate = updated.getDate();
  const updatedMonth = updated.getMonth() + 1;
  const updatedYear = updated.getFullYear();

  if (updatedDate <= 10) {
    // 10日以前 → 前月分
    const m = updatedMonth === 1 ? 12 : updatedMonth - 1;
    const y = updatedMonth === 1 ? updatedYear - 1 : updatedYear;
    return `${y}-${String(m).padStart(2, "0")}`;
  } else {
    // 11日以降 → 当月分
    return `${updatedYear}-${String(updatedMonth).padStart(2, "0")}`;
  }
}

/**
 * リード一覧を直近12ヶ月分の月別に集計する
 */
export function aggregateByMonth(leads: LeadRow[]): MonthlyStats[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push(key);
  }

  const monthMap = new Map<
    string,
    { total: number; removed: number; takedownRequested: number; confirmedCount: number; unconfirmedCount: number }
  >();
  for (const m of months) {
    monthMap.set(m, { total: 0, removed: 0, takedownRequested: 0, confirmedCount: 0, unconfirmedCount: 0 });
  }

  for (const lead of leads) {
    const billingMonth = getBillingMonth(lead);
    const bucket = monthMap.get(billingMonth);
    if (!bucket) continue;

    bucket.total++;
    if (lead.status === "removed") {
      bucket.removed++;
    } else if (lead.status === "takedown_requested") {
      bucket.takedownRequested++;
    } else if (isLeadConfirmed(lead.created_at)) {
      bucket.confirmedCount++;
    } else {
      bucket.unconfirmedCount++;
    }
  }

  return months.map((month) => {
    const bucket = monthMap.get(month)!;
    const [y, m] = month.split("-").map(Number);

    return {
      month,
      total: bucket.total,
      removed: bucket.removed,
      takedownRequested: bucket.takedownRequested,
      confirmedCount: bucket.confirmedCount,
      unconfirmedCount: bucket.unconfirmedCount,
      confirmed: isDeadlinePassed(y, m),
    };
  });
}

/**
 * 指定月のリードを集計する（cronバッチ用）
 */
export function aggregateForMonth(
  leads: LeadRow[],
  targetMonth: string
): { total: number; removed: number; takedownRequested: number; confirmedCount: number; unconfirmedCount: number } {
  let total = 0;
  let removed = 0;
  let takedownRequested = 0;
  let confirmedCount = 0;
  let unconfirmedCount = 0;

  for (const lead of leads) {
    const billingMonth = getBillingMonth(lead);
    if (billingMonth !== targetMonth) continue;

    total++;
    if (lead.status === "removed") {
      removed++;
    } else if (lead.status === "takedown_requested") {
      takedownRequested++;
    } else if (isLeadConfirmed(lead.created_at)) {
      confirmedCount++;
    } else {
      unconfirmedCount++;
    }
  }

  return {
    total,
    removed,
    takedownRequested,
    confirmedCount,
    unconfirmedCount,
  };
}
