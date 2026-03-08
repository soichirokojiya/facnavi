# 請求書メール自動送信 仕様書

## 概要

毎月10日の締め日後、11日に前月分の請求書PDFを生成しメールに添付して各パートナーへ自動送信する。

---

## 現状の仕組み

| 項目 | 現在 |
|------|------|
| cronスケジュール | `vercel.json`: 毎月10日 00:00 UTC |
| メール形式 | テキストメールのみ（PDF添付なし） |
| テンプレート | `billing-template.ts` + 管理画面で編集可能 |
| 送信ログ | なし（レスポンスで返すのみ） |

---

## 変更内容

### 1. cronスケジュール変更

**ファイル:** `vercel.json`

```
変更前: "0 0 10 * *"（毎月10日 00:00 UTC = JST 9:00）
変更後: "0 0 11 * *"（毎月11日 00:00 UTC = JST 9:00）
```

10日の締め日が完了した後に送信するため。

---

### 2. PDF請求書の生成

#### 請求書レイアウト

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                      請 求 書                         │
│                                                      │
│  請求書番号: INV-202603-XXXXXXXX    発行日: 2026年4月11日  │
│                                                      │
│  ┌─────────────────┐    ┌──────────────────────────┐ │
│  │ 宛先             │    │ 発行元                    │ │
│  │ {会社名} 御中     │    │ Common Future & Co.株式会社│ │
│  │                  │    │ 〒249-0008               │ │
│  │                  │    │ 福岡県福岡市中央区天神4-6-28 いちご天神ノースビル7階   │ │
│  │                  │    │ 登録番号: T9011001105902  │ │
│  └─────────────────┘    └──────────────────────────┘ │
│                                                      │
│  ご請求金額: ¥XXX,XXX（税込）                          │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ 品目              │ 数量  │ 単価    │ 金額     │  │
│  ├────────────────────────────────────────────────┤  │
│  │ リード送客フィー    │ XX件 │ XX,XXX円│ XXX,XXX円│  │
│  ├────────────────────────────────────────────────┤  │
│  │ 小計（税抜）                      │ XXX,XXX円 │  │
│  │ 消費税（10%対象）                  │  XX,XXX円 │  │
│  │ 合計（税込）                      │ XXX,XXX円 │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  対象期間: 2026年3月1日〜3月31日                       │
│  お支払期限: 2026年4月30日                             │
│                                                      │
│  ■ お振込先                                          │
│  楽天銀行 第二営業支店（252）                           │
│  普通 7671151                                        │
│  Common Future & Co.株式会社                          │
│  ※振込手数料はお客様ご負担にてお願いいたします            │
│                                                      │
│  ■ 備考                                              │
│  詳細はパートナーダッシュボードよりご確認いただけます。     │
│  https://facnavi.info/partner                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### PDF記載項目（インボイス制度対応）

| # | 項目 | 値 | 備考 |
|---|------|-----|------|
| 1 | タイトル | 請求書 | |
| 2 | 請求書番号 | `{YYYY}-{3桁業者番号}-{3桁連番}` | 業者番号=partner_number、連番=年内通し番号（年リセット） |
| 3 | 発行日 | cronジョブ実行日（11日） | |
| 4 | 発行元 商号 | Common Future & Co.株式会社 | site_settings: `billing_company_name` |
| 5 | 発行元 住所 | 福岡県福岡市中央区天神4-6-28 いちご天神ノースビル7階 | site_settings: `billing_company_address` |
| 6 | 適格請求書発行事業者番号 | T9011001105902 | site_settings: `billing_invoice_number` |
| 7 | 宛先 | {会社名} 御中 | partner_companies.name |
| 8 | ご請求金額（税込） | 合計金額を大きく表示 | |
| 9 | 明細テーブル | 品目 / 数量 / 単価 / 金額 | |
| 10 | 品目 | リード送客フィー | |
| 11 | 数量 | 確定リード数（件） | |
| 12 | 単価 | fee_per_lead（税抜） | |
| 13 | 金額 | 数量 × 単価 | |
| 14 | 小計（税抜） | 上記金額 | |
| 15 | 消費税 | `{tax_rate}%対象` と明記 | 軽減税率と区分 |
| 16 | 合計（税込） | 小計 + 消費税 | |
| 17 | 対象期間 | {YYYY}年{MM}月1日〜{MM}月{lastDay}日 | |
| 18 | 支払期限 | 翌月末日 | site_settings: `billing_due_date_rule` |
| 19 | 振込先 | 楽天銀行 第二営業支店（252）普通 7671151 Common Future & Co.株式会社 | site_settings: `billing_bank_info` |
| 20 | 振込手数料 | 「振込手数料はお客様ご負担」 | site_settings: `billing_notes` |
| 21 | 備考 | ダッシュボードURL | |

#### PDFファイル名

```
ファクナビ_請求書_{YYYY}年{MM}月_{会社名}.pdf
```

#### PDF生成ライブラリ

`jspdf` を使用（サーバーサイドでNode.js上で動作、日本語フォント埋め込み）

---

### 3. メール送信の変更

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| 本文形式 | テキストのみ | テキスト（既存テンプレート維持） |
| PDF添付 | なし | あり（Resendの`attachments`で添付） |
| 0件の場合 | 送信する | 送信する（0円の請求書） |

Resend添付の形式:
```typescript
await resend.emails.send({
  from: `ファクナビ <${fromEmail}>`,
  to: partner.email,
  subject,
  text: body,
  attachments: [{
    filename: `ファクナビ_請求書_${vars.YYYY}年${vars.MM}月_${partner.name}.pdf`,
    content: pdfBuffer, // Base64 or Buffer
  }],
});
```

---

### 4. 送信ログ（billing_logs テーブル）

```sql
CREATE TABLE billing_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,  -- "INV-2026-000001"
  partner_company_id UUID REFERENCES partner_companies(id),
  target_month TEXT NOT NULL,           -- "2026-03"
  confirmed_count INTEGER NOT NULL,
  amount_excl_tax INTEGER NOT NULL,
  tax_amount INTEGER NOT NULL,
  amount_incl_tax INTEGER NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 年内連番を取得する関数
-- partner_companiesに業者番号カラムを追加
ALTER TABLE partner_companies
  ADD COLUMN partner_number SERIAL;

-- 既存パートナーにcreated_at順で採番
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM partner_companies
)
UPDATE partner_companies SET partner_number = numbered.rn
FROM numbered WHERE partner_companies.id = numbered.id;

-- 請求書番号を生成する関数
CREATE OR REPLACE FUNCTION next_invoice_number(target_year INTEGER, p_partner_number INTEGER)
RETURNS TEXT AS $$
DECLARE
  year_prefix TEXT;
  seq INTEGER;
BEGIN
  year_prefix := target_year || '-';
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM LENGTH(year_prefix) + 5) AS INTEGER)
  ), 0) + 1
  INTO seq
  FROM billing_logs
  WHERE invoice_number LIKE year_prefix || '%';
  RETURN year_prefix || LPAD(p_partner_number::TEXT, 3, '0') || '-' || LPAD(seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;
```

---

### 5. site_settings 追加キー

| key | value | 管理画面で編集 |
|-----|-------|--------------|
| `billing_company_name` | `Common Future & Co.株式会社` | Yes |
| `billing_company_address` | `〒810-0001 福岡県福岡市中央区天神4-6-28 いちご天神ノースビル7階` | Yes |
| `billing_invoice_number` | `T9011001105902` | Yes |
| `billing_bank_info` | `楽天銀行 第二営業支店（252）普通 7671151\nCommon Future & Co.株式会社` | Yes |
| `billing_notes` | `振込手数料はお客様ご負担にてお願いいたします` | Yes |

初期値はSupabaseに直接INSERTし、以降は管理画面から変更可能にする。

---

### 6. 管理画面の変更

**ファイル:** `src/app/admin/settings/page.tsx`

「請求設定」セクションに以下を追加:

- 発行元 商号（テキスト入力）
- 発行元 住所（テキスト入力）
- 適格請求書発行事業者番号（テキスト入力）
- 振込先情報（テキストエリア）
- 備考（テキスト入力）
- 消費税率（既存）
- メール件名・本文（既存）

---

### 7. 管理画面からの手動再送

「請求設定」セクション下部に:

- 対象月セレクター（直近12ヶ月）
- 「請求書メール再送」ボタン
- 全パートナーに再送（確認ダイアログあり）

API: `POST /api/cron/billing` に `{ month: "2026-03" }` を送信して手動トリガー

---

## 処理フロー

```
毎月11日 00:00 UTC (JST 9:00) — Vercel Cron
  │
  ├─ 1. CRON_SECRET で認証（手動再送時はadminセッション認証）
  ├─ 2. 前月の targetMonth 算出
  ├─ 3. site_settings 一括取得
  │     - tax_rate, テンプレート
  │     - billing_company_name, billing_company_address
  │     - billing_invoice_number, billing_bank_info, billing_notes
  ├─ 4. アクティブなパートナー全件取得
  │
  └─ 5. 各パートナーごとにループ:
       ├─ a. リード取得 → aggregateForMonth で集計
       ├─ b. 金額計算（小計 / 税額 / 合計）
       ├─ c. PDF請求書を生成（jspdf, メモリ上でBuffer化）
       ├─ d. メールテンプレートをレンダリング
       ├─ e. Resendで送信（テキスト本文 + PDF添付）
       ├─ f. billing_logs にINSERT
       └─ g. 結果を記録（成功 / 失敗）
```

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `vercel.json` | cronスケジュールを11日に変更 |
| `src/app/api/cron/billing/route.ts` | PDF生成・添付・ログ記録を追加、POST対応（手動再送） |
| `src/lib/billing-pdf.ts` | 新規: PDF請求書生成ロジック |
| `src/app/admin/settings/page.tsx` | 請求元情報の編集フォーム追加、手動再送ボタン追加 |
| `src/app/api/admin/settings/route.ts` | 新しいsetting keyの保存対応 |
| `sql/create_billing_logs.sql` | 新規: billing_logsテーブル作成SQL |
| `package.json` | `jspdf` 追加 |

---

## 検証項目

- [ ] 毎月11日にcronが発動し、前月分の請求メールが送信される
- [ ] PDFが正しい日本語で表示される（フォント埋め込み）
- [ ] PDF記載内容がインボイス制度に準拠（登録番号・税率区分・発行者情報）
- [ ] 確定リード0件でも0円の請求書が送信される
- [ ] billing_logsに全送信結果が記録される
- [ ] 管理画面から請求元情報を変更 → PDFに反映される
- [ ] 管理画面からメール文面を変更 → メール本文に反映される
- [ ] 管理画面から手動再送 → 正常に送信される
- [ ] Resendの添付ファイルサイズ制限内に収まる
