-- facnavi: 全テーブルにRLSを有効化
-- service_roleキーはRLSをバイパスするため、アプリの動作に影響なし

ALTER TABLE public.mitsumori_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.takedown_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;
