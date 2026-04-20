require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.SERVER_PORT || 3333;

// ─── Supabase ────────────────────────────────────────────────────
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// ─── Middlewares ─────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// ─── OpenPix Config ──────────────────────────────────────────────
const OPENPIX_APP_ID = process.env.OPENPIX_APP_ID || '';
const OPENPIX_BASE   = 'https://api.openpix.com.br/api/v1';

const openpix = axios.create({
  baseURL: OPENPIX_BASE,
  headers: {
    Authorization: OPENPIX_APP_ID,
    'Content-Type': 'application/json',
  },
});

// ─── Preços por tipo de serviço ──────────────────────────────────
const PRICES = {
  documento: 2900,  // R$ 29,00 em centavos
  premium:   5900,  // R$ 59,00 em centavos
};

const LABELS = {
  documento: 'Agilprev - Documento Previdenciário',
  premium:   'Agilprev - Documento + Análise Inteligente',
};

// ════════════════════════════════════════════════════════════════
// POST /api/session — Criar/salvar sessão
// ════════════════════════════════════════════════════════════════
app.post('/api/session', async (req, res) => {
  try {
    const { sessionId, serviceType, conversationData, nome, email } = req.body;
    const id = sessionId || uuidv4();

    const { error } = await supabase
      .from('agil_sessions')
      .upsert({
        id,
        service_type: serviceType,
        conversation_data: conversationData,
        nome,
        email,
        status: 'chat',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) throw error;
    res.json({ success: true, sessionId: id });
  } catch (e) {
    console.error('session error:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post('/api/enviar-email', async (req, res) => {
  try {
    const { email, nome } = req.body;

    const response = await resend.emails.send({
      from: 'Agilprev <onboarding@resend.dev>',
      to: email,
      subject: 'Seu documento Agilprev',
      html: `<p>Olá ${nome}, seu documento foi gerado com sucesso.</p>`,
    });

    res.json({ success: true, data: response });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ════════════════════════════════════════════════════════════════
// POST /api/create-charge — Criar cobrança PIX no OpenPix
// ════════════════════════════════════════════════════════════════
app.post('/api/create-charge', async (req, res) => {
  try {
    const { sessionId, serviceType } = req.body;

    if (!sessionId || !serviceType || !PRICES[serviceType]) {
      return res.status(400).json({ success: false, error: 'Dados inválidos.' });
    }

    const correlationID = `agil-${sessionId}-${Date.now()}`;
    const value = PRICES[serviceType];

    const { data } = await openpix.post('/charge', {
      correlationID,
      value,
      comment: LABELS[serviceType],
      expiresIn: 900, // 15 minutos
    });

    const charge = data?.charge || data;

    // Salvar charge no Supabase
    await supabase.from('agil_payments').upsert({
      session_id: sessionId,
      correlation_id: correlationID,
      service_type: serviceType,
      value,
      status: 'pending',
      pix_code: charge?.brCode || charge?.pixCopiaECola || '',
      qr_code_image: charge?.qrCodeImage || '',
      created_at: new Date().toISOString(),
    }, { onConflict: 'session_id' });

    // Atualizar status da sessão
    await supabase
      .from('agil_sessions')
      .update({ status: 'preview', updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    res.json({
      success: true,
      correlationID,
      pixCode: charge?.brCode || charge?.pixCopiaECola || '',
      qrCodeImage: charge?.qrCodeImage || '',
      expiresAt: charge?.expiresIn || 900,
    });

  } catch (e) {
    console.error('create-charge error:', e?.response?.data || e.message);
    res.status(500).json({ success: false, error: e?.response?.data?.error || e.message });
  }
});

// ════════════════════════════════════════════════════════════════
// GET /api/payment-status/:sessionId — Verificar status do pagamento
// ════════════════════════════════════════════════════════════════
app.get('/api/payment-status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('agil_payments')
      .select('status, service_type')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return res.json({ success: false, status: 'not_found' });
    }

    res.json({ success: true, status: data.status, serviceType: data.service_type });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════
// POST /api/openpix/webhook — Receber confirmação de pagamento
// ════════════════════════════════════════════════════════════════
app.post('/api/openpix/webhook', async (req, res) => {
  try {
    const body = req.body;
    console.log('🔔 OpenPix Webhook recebido:', JSON.stringify(body, null, 2));

    // OpenPix envia event = 'OPENPIX:CHARGE_COMPLETED' quando pago
    const event = body?.event || '';
    const correlationID = body?.charge?.correlationID || body?.correlationID || '';

    if (event === 'OPENPIX:CHARGE_COMPLETED' && correlationID) {
      // Extrair sessionId do correlationID (formato: agil-{sessionId})
      const { data: paymentRow, error: paymentError } = await supabase
  .from('agil_payments')
  .select('session_id')
  .eq('correlation_id', correlationID)
  .single();

if (paymentError || !paymentRow) {
  console.error('Erro buscando pagamento pelo correlationID:', paymentError?.message || 'não encontrado');
  return res.status(200).json({ message: 'ok' });
}

const sessionId = paymentRow.session_id;

      // Atualizar status no Supabase
      await supabase
        .from('agil_payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('correlation_id', correlationID);

      await supabase
        .from('agil_sessions')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      console.log(`✅ Pagamento confirmado para sessão: ${sessionId}`);

      // Buscar dados da sessão para envio de e-mail
      const { data: sessionData, error: sessionError } = await supabase
        .from('agil_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('Erro buscando sessão:', sessionError.message);
      } else {
        const email = sessionData?.email;
        const nome = sessionData?.nome || 'Cliente';

        if (email) {
          try {
            await resend.emails.send({
              from: 'Agilprev <contato@agilprev.com.br>',
              to: [email],
              subject: 'Pagamento aprovado - Agilprev',
              html: `<p>Olá ${nome}, seu pagamento foi aprovado com sucesso. Seu atendimento no Agilprev foi liberado.</p>`,
            });

            console.log('✅ E-mail enviado para:', email);
          } catch (emailError) {
            console.error('Erro ao enviar e-mail:', emailError.message);
          }
        } else {
          console.log('Sessão sem e-mail cadastrado:', sessionId);
        }
      }
    }

    // OpenPix exige HTTP 200 com corpo específico
    return res.status(200).json({ message: 'ok' });

  } catch (e) {
    console.error('webhook error:', e.message);
    return res.status(200).json({ message: 'ok' }); // sempre retornar 200 para a OpenPix
  }
});

// ════════════════════════════════════════════════════════════════
// POST /api/send-document-email — Enviar documento por e-mail (Resend)
// ════════════════════════════════════════════════════════════════
app.post('/api/send-document-email', async (req, res) => {
  try {
    const { to, customerName, serviceType, documentContent, sessionId } = req.body;

    if (!to || !documentContent) {
      return res.status(400).json({ success: false, error: 'E-mail e conteúdo do documento são obrigatórios.' });
    }

    const isPremium = serviceType === 'premium';
    const productLabel = isPremium
      ? 'Documento + Análise Inteligente Personalizada'
      : 'Documento Previdenciário';

    const { data, error } = await resend.emails.send({
      from: 'Agilprev <contato@agilprev.com.br>',
      to: [to],
      subject: `Agilprev — Seu ${productLabel} está pronto`,
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
        <body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: ${isPremium ? '#22c55e' : '#2563eb'}; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">AGILPREV</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Assistência Previdenciária Especializada</p>
            </div>

            <!-- Corpo -->
            <div style="padding: 32px;">
              <p style="font-size: 16px; color: #1e293b;">Olá${customerName ? `, <strong>${customerName}</strong>` : ''},</p>
              <p style="color: #475569;">Seu <strong>${productLabel}</strong> foi gerado com sucesso e está pronto para uso.</p>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; color: #15803d; font-weight: 700; font-size: 15px;">✅ Documento pronto para protocolo</p>
                <p style="margin: 8px 0 0; color: #166534; font-size: 13px;">
                  ${isPremium ? 'Inclui Documento Previdenciário + Análise Inteligente Personalizada + Página de Instruções' : 'Inclui Documento Previdenciário + Página de Instruções Práticas'}
                </p>
              </div>

              <p style="color: #475569; font-size: 14px; font-weight: 600;">Próximos passos:</p>
              <ol style="color: #64748b; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                <li>Abra o PDF que você baixou (ou salve o conteúdo abaixo)</li>
                <li>Imprima e assine todas as páginas</li>
                <li>Siga as instruções da <strong>Página em Anexo</strong> do documento</li>
                <li>Leve os documentos originais indicados</li>
                <li>Guarde o comprovante de protocolo</li>
              </ol>

              <!-- Preview do documento -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0; max-height: 300px; overflow: hidden;">
                <p style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Preview do documento</p>
                <pre style="font-family: monospace; font-size: 11px; color: #475569; white-space: pre-wrap; margin: 0; overflow: hidden; max-height: 240px;">${(documentContent || '').substring(0, 800)}${documentContent && documentContent.length > 800 ? '\n...' : ''}</pre>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 8px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  Dúvidas? Entre em contato:<br/>
                  📞 <strong>135</strong> (INSS) &nbsp;|&nbsp; ✉ <strong>contato@agilprev.com.br</strong> &nbsp;|&nbsp; 📱 <strong>(73) 99921-2498</strong>
                </p>
                <p style="color: #cbd5e1; font-size: 11px; margin: 12px 0 0;">
                  Esta Análise Inteligente é automatizada e não substitui advogado. Agilprev — Benefício Garantido.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw new Error(error.message);

    // Registrar envio no Supabase
    if (sessionId) {
      await supabase
        .from('agil_sessions')
        .update({ email_sent: true, email_sent_at: new Date().toISOString(), status: 'delivered' })
        .eq('id', sessionId);
    }

    console.log(`📧 E-mail enviado para ${to} | Session: ${sessionId}`);
    res.json({ success: true, emailId: data?.id });

  } catch (e) {
    console.error('send-document-email error:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ════════════════════════════════════════════════════════════════
// GET /api/health
// ════════════════════════════════════════════════════════════════
app.get('/api/health', (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Agilprev Server rodando em http://localhost:${PORT}`);
  console.log(`   OpenPix App ID: ${OPENPIX_APP_ID ? '✅ configurado' : '❌ faltando'}`);
  console.log(`   Supabase URL:   ${process.env.VITE_SUPABASE_URL ? '✅ configurado' : '❌ faltando'}\n`);
});
