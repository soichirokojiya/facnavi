import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

export interface InvoiceVars {
  invoiceNumber: string;
  issueDate: string;
  companyName: string; // 宛先会社名
  billingCompanyName: string;
  billingCompanyAddress: string;
  billingInvoiceNumber: string; // 適格請求書発行事業者登録番号
  bankInfo: string;
  notes: string;
  targetYear: string;
  targetMonth: string;
  lastDay: string;
  confirmedCount: number;
  feePerLead: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  siteUrl: string;
  paymentDeadline: string;
}

function fmt(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function generateInvoicePdf(vars: InvoiceVars): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // 日本語フォント登録（public/fonts から読み込み）
  const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");
  const fontData = fs.readFileSync(fontPath).toString("base64");
  doc.addFileToVFS("NotoSansJP-Regular.ttf", fontData);
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.setFont("NotoSansJP");

  const pageW = 210;
  const marginL = 20;
  const marginR = 20;
  const contentW = pageW - marginL - marginR;
  let y = 20;

  // ========== タイトル ==========
  doc.setFontSize(22);
  doc.setFont("NotoSansJP", "normal");
  const title = "請 求 書";
  const titleW = doc.getTextWidth(title);
  doc.text(title, (pageW - titleW) / 2, y);
  y += 4;
  // タイトル下二重線
  doc.setLineWidth(0.8);
  doc.line(marginL + 30, y, pageW - marginR - 30, y);
  doc.setLineWidth(0.3);
  doc.line(marginL + 30, y + 1.2, pageW - marginR - 30, y + 1.2);
  y += 10;

  // ========== メタ情報（請求書番号・発行日）==========
  doc.setFontSize(9);
  const metaRight = pageW - marginR;
  doc.text(`請求書番号: ${vars.invoiceNumber}`, metaRight - 80, y);
  doc.text(`発行日: ${vars.issueDate}`, metaRight - 30, y);
  y += 12;

  // ========== ヘッダー（宛先 左 / 発行元 右下）==========
  // 宛先（左寄せ）
  doc.setFontSize(14);
  const toName = vars.companyName;
  doc.text(toName, marginL, y);
  const toNameW = doc.getTextWidth(toName);
  doc.setLineWidth(0.5);
  doc.line(marginL, y + 1.5, marginL + toNameW, y + 1.5);
  doc.setFontSize(13);
  doc.text("御中", marginL + toNameW + 3, y);
  y += 10;

  // 発行元（右寄せ、宛先の下）
  const fromX = metaRight;
  doc.setFontSize(10);
  doc.text(vars.billingCompanyName, fromX, y, { align: "right" });
  y += 5;
  doc.setFontSize(8);
  doc.text(vars.billingCompanyAddress, fromX, y, { align: "right" });
  y += 4;
  doc.setFontSize(7);
  doc.text(`適格請求書発行事業者登録番号: ${vars.billingInvoiceNumber}`, fromX, y, { align: "right" });
  y += 12;

  // ========== ご請求金額（税込）ボックス ==========
  const boxH = 14;
  doc.setDrawColor(51, 51, 51);
  doc.setLineWidth(0.6);
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(marginL, y, contentW, boxH, 1, 1, "FD");

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("ご請求金額（税込）", marginL + 6, y + boxH / 2 + 1);

  doc.setFontSize(20);
  const amountStr = `¥${fmt(vars.totalAmount)}`;
  doc.text(amountStr, metaRight - 6, y + boxH / 2 + 2, { align: "right" });
  y += boxH + 10;

  // ========== 明細テーブル ==========
  const colWidths = [contentW * 0.45, contentW * 0.15, contentW * 0.20, contentW * 0.20];
  const headers = ["品目", "数量", "単価（税抜）", "金額（税抜）"];
  const rowH = 9;

  // ヘッダー行
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.3);
  let x = marginL;
  for (let i = 0; i < 4; i++) {
    doc.rect(x, y, colWidths[i], rowH, "FD");
    x += colWidths[i];
  }
  doc.setFontSize(9);
  doc.setTextColor(0);
  x = marginL;
  for (let i = 0; i < 4; i++) {
    doc.text(headers[i], x + colWidths[i] / 2, y + rowH / 2 + 1, { align: "center" });
    x += colWidths[i];
  }
  y += rowH;

  // データ行
  const rowData = [
    `リード送客フィー（${vars.targetYear}年${vars.targetMonth}月分）`,
    `${vars.confirmedCount}件`,
    `${fmt(vars.feePerLead)}円`,
    `${fmt(vars.subtotal)}円`,
  ];
  x = marginL;
  for (let i = 0; i < 4; i++) {
    doc.rect(x, y, colWidths[i], rowH);
    x += colWidths[i];
  }
  doc.setFontSize(9);
  x = marginL;
  doc.text(rowData[0], x + 3, y + rowH / 2 + 1);
  x += colWidths[0];
  doc.text(rowData[1], x + colWidths[1] / 2, y + rowH / 2 + 1, { align: "center" });
  x += colWidths[1];
  doc.text(rowData[2], x + colWidths[2] - 3, y + rowH / 2 + 1, { align: "right" });
  x += colWidths[2];
  doc.text(rowData[3], x + colWidths[3] - 3, y + rowH / 2 + 1, { align: "right" });
  y += rowH + 8;

  // ========== 集計テーブル（右寄せ）==========
  const sumW = contentW * 0.5;
  const sumX = marginL + contentW - sumW;
  const sumColW = sumW / 2;
  const summaryRows = [
    { label: "小計（税抜）", value: `${fmt(vars.subtotal)}円` },
    { label: `消費税（${vars.taxRate}%対象）`, value: `${fmt(vars.taxAmount)}円` },
    { label: "合計（税込）", value: `${fmt(vars.totalAmount)}円`, isTotal: true },
  ];

  for (const row of summaryRows) {
    if (row.isTotal) {
      doc.setLineWidth(0.6);
      doc.setDrawColor(51, 51, 51);
    }
    // ラベルセル
    doc.setFillColor(240, 240, 240);
    doc.rect(sumX, y, sumColW, rowH, "FD");
    doc.setFontSize(row.isTotal ? 10 : 9);
    doc.text(row.label, sumX + sumColW / 2, y + rowH / 2 + 1, { align: "center" });
    // 値セル
    doc.setDrawColor(204, 204, 204);
    if (row.isTotal) doc.setDrawColor(51, 51, 51);
    doc.rect(sumX + sumColW, y, sumColW, rowH);
    doc.text(row.value, sumX + sumW - 3, y + rowH / 2 + 1, { align: "right" });
    y += rowH;
    doc.setDrawColor(204, 204, 204);
    doc.setLineWidth(0.3);
  }
  y += 10;

  // ========== 対象期間・お支払期限 ==========
  const infoColW = contentW / 2;

  doc.setLineWidth(0.8);
  doc.setDrawColor(51, 51, 51);
  doc.line(marginL, y, marginL + 0.8, y + 7);
  doc.setFontSize(10);
  doc.text("対象期間", marginL + 4, y + 4);
  doc.setFontSize(9);
  doc.text(
    `${vars.targetYear}年${vars.targetMonth}月1日〜${vars.targetMonth}月${vars.lastDay}日`,
    marginL + 4,
    y + 10
  );

  doc.line(marginL + infoColW, y, marginL + infoColW + 0.8, y + 7);
  doc.setFontSize(10);
  doc.text("お支払期限", marginL + infoColW + 4, y + 4);
  doc.setFontSize(9);
  doc.text(vars.paymentDeadline, marginL + infoColW + 4, y + 10);
  y += 18;

  // ========== お振込先 ==========
  doc.setLineWidth(0.8);
  doc.setDrawColor(51, 51, 51);
  doc.line(marginL, y, marginL + 0.8, y + 7);
  doc.setFontSize(10);
  doc.text("お振込先", marginL + 4, y + 4);
  y += 10;
  doc.setFontSize(9);
  const bankLines = vars.bankInfo.split("\n");
  for (const line of bankLines) {
    doc.text(line, marginL + 4, y);
    y += 5;
  }
  y += 5;

  // ========== 備考 ==========
  doc.setDrawColor(221, 221, 221);
  doc.setLineWidth(0.3);
  doc.line(marginL, y, marginL + contentW, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(85, 85, 85);
  if (vars.notes) {
    doc.text(`※ ${vars.notes}`, marginL, y);
    y += 5;
  }
  doc.text(
    `※ 詳細はパートナーダッシュボードよりご確認いただけます。`,
    marginL,
    y
  );
  y += 5;
  doc.setTextColor(37, 99, 235);
  doc.text(`   ${vars.siteUrl}/partner`, marginL, y);

  // PDF出力
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
