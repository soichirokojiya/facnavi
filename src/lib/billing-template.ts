/**
 * 請求メールテンプレート
 *
 * 利用可能なプレースホルダー:
 *   {YYYY}          - 対象年
 *   {MM}            - 対象月（ゼロ埋め）
 *   {lastDay}       - 対象月の末日
 *   {会社名}        - パートナー会社名
 *   {total}         - 総リード数
 *   {removed}       - 取り下げ承認数
 *   {billable}      - フィー対象リード数
 *   {fee_per_lead}  - 単価（カンマ区切り）
 *   {subtotal}      - 小計（税抜、カンマ区切り）
 *   {tax_rate}      - 消費税率
 *   {tax_amount}    - 消費税額（カンマ区切り）
 *   {amount}        - 請求金額（税込、カンマ区切り）
 *   {siteUrl}       - サイトURL
 *   {adminEmail}    - 管理者メールアドレス
 */

export const DEFAULT_BILLING_SUBJECT =
  "【ファクナビ】{YYYY}年{MM}月分 リード送客フィーのご案内";

export const DEFAULT_BILLING_BODY = `{会社名} 御中

いつもファクナビをご利用いただき、誠にありがとうございます。

{MM}月分のリード送客フィーが確定しましたのでご案内いたします。

━━━━━━━━━━━━━━━━━━━━━━━━
■ 請求内容
━━━━━━━━━━━━━━━━━━━━━━━━
対象期間: {YYYY}年{MM}月1日〜{MM}月{lastDay}日
総リード数: {total}件
取り下げ承認: {removed}件
フィー対象リード数: {billable}件
単価: {fee_per_lead}円（税抜）
━━━━━━━━━━━━━━━━━━━━━━━━
小計: {subtotal}円
消費税（{tax_rate}%）: {tax_amount}円
ご請求金額: {amount}円（税込）
━━━━━━━━━━━━━━━━━━━━━━━━

詳細はパートナーダッシュボードよりご確認いただけます。
{siteUrl}/partner

ご不明な点がございましたら、お気軽にお問い合わせください。

──────────────────
ファクナビ運営事務局
{adminEmail}
──────────────────`;

/**
 * テンプレート内の {key} プレースホルダーを値で置換する
 */
export function renderBillingTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+|会社名)\}/g, (match, key) => {
    return key in vars ? vars[key] : match;
  });
}
