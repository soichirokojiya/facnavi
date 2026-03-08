CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO site_settings (key, value) VALUES ('tax_rate', '10') ON CONFLICT (key) DO NOTHING;
