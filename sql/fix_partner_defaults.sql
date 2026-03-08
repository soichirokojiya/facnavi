-- fee_per_lead が 0 のパートナーを 15000 に更新
UPDATE partner_companies SET fee_per_lead = 15000 WHERE fee_per_lead = 0 OR fee_per_lead IS NULL;

-- min_amount が 0 のパートナーを 10000 に更新
UPDATE partner_companies SET min_amount = 10000 WHERE min_amount = 0 OR min_amount IS NULL;
