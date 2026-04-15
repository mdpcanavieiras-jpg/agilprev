-- =====================================================
-- AGILPREV — Setup das tabelas no Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. Sessões de atendimento
CREATE TABLE IF NOT EXISTS agil_sessions (
  id              TEXT PRIMARY KEY,
  service_type    TEXT NOT NULL CHECK (service_type IN ('documento', 'premium')),
  conversation_data JSONB,
  chat_document   TEXT,
  generated_document TEXT,
  status          TEXT NOT NULL DEFAULT 'chat'
                    CHECK (status IN ('chat', 'preview', 'pending_payment', 'paid', 'delivered')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pagamentos
CREATE TABLE IF NOT EXISTS agil_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT REFERENCES agil_sessions(id),
  correlation_id  TEXT UNIQUE NOT NULL,
  service_type    TEXT NOT NULL,
  value           INTEGER NOT NULL,  -- em centavos
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'expired', 'cancelled')),
  pix_code        TEXT,
  qr_code_image   TEXT,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_agil_payments_session ON agil_payments(session_id);
CREATE INDEX IF NOT EXISTS idx_agil_payments_correlation ON agil_payments(correlation_id);
CREATE INDEX IF NOT EXISTS idx_agil_sessions_status ON agil_sessions(status);

-- 4. RLS (Row Level Security) — leitura pública, escrita via service role
ALTER TABLE agil_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agil_payments ENABLE ROW LEVEL SECURITY;

-- Permitir leitura de sessão pelo próprio ID (anon)
CREATE POLICY "select own session" ON agil_sessions
  FOR SELECT USING (true);

-- Permitir leitura de pagamento por session_id (anon)
CREATE POLICY "select own payment" ON agil_payments
  FOR SELECT USING (true);

-- Escrita apenas via service role (backend)
CREATE POLICY "service role only insert sessions" ON agil_sessions
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR true);

CREATE POLICY "service role only insert payments" ON agil_payments
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR true);

CREATE POLICY "service role only update sessions" ON agil_sessions
  FOR UPDATE USING (true);

CREATE POLICY "service role only update payments" ON agil_payments
  FOR UPDATE USING (true);
