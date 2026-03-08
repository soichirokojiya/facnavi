-- billing_logs テーブル作成
CREATE TABLE IF NOT EXISTS billing_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  partner_company_id UUID REFERENCES partner_companies(id),
  target_month TEXT NOT NULL,
  confirmed_count INTEGER NOT NULL,
  amount_excl_tax INTEGER NOT NULL,
  tax_amount INTEGER NOT NULL,
  amount_incl_tax INTEGER NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- partner_companies に業者番号カラムを追加
ALTER TABLE partner_companies
  ADD COLUMN IF NOT EXISTS partner_number SERIAL;

-- 既存パートナーに created_at 順で採番
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
