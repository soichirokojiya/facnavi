function addCommas(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function formatAmount(amount: number): string {
  if (amount === 0) return "制限なし";
  if (amount >= 100000000) return `${addCommas(amount / 100000000)}億円`;
  if (amount >= 10000) return `${addCommas(amount / 10000)}万円`;
  return `${addCommas(amount)}円`;
}

export function formatFeeRange(min: number, max: number): string {
  return `${min}%〜${max}%`;
}
