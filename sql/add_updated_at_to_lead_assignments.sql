-- lead_assignments に updated_at カラムを追加
-- status 変更時のタイムスタンプを記録し、フィー確定の判定に使用する

ALTER TABLE lead_assignments
ADD COLUMN updated_at timestamptz DEFAULT now();

-- 既存レコードは created_at で初期化
UPDATE lead_assignments SET updated_at = created_at;

-- status 更新時に自動で updated_at を更新するトリガー
CREATE OR REPLACE FUNCTION update_lead_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lead_assignments_updated_at
  BEFORE UPDATE ON lead_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_assignments_updated_at();
