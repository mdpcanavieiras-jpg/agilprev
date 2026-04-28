import { DOCUMENT_KNOWLEDGE_BASE, ADDITIONAL_CONTEXT, PREMIUM_ANALYSIS_TEMPLATE } from './documentKnowledgeBase';

const API_URL = import.meta.env.VITE_API_URL;
  

export interface ConversationMessage {
  role: string;
  content: string;
}

export interface GenerateResult {
  success: boolean;
  content: string;
  error?: string;
}

/**
 * Documento Básico: chama a OpenAI com a knowledge base completa + conversa
 */
export async function generateBasicDocument(conversation: ConversationMessage[]): Promise<GenerateResult> {
  const summary = conversation.map(m => `${m.role}: ${m.content}`).join('\n\n');

  const prompt = `${DOCUMENT_KNOWLEDGE_BASE}

${ADDITIONAL_CONTEXT}

===CONVERSA COMPLETA===
${summary}

===INSTRUÇÕES===
Com base na conversa acima e na base de conhecimento, gere o documento jurídico FORMAL e COMPLETO para protocolo no INSS.
1. Identifique o tipo de documento mais adequado ao caso.
2. Use estrutura formal correta (Título, Identificação, Dos Fatos, Do Direito, Do Pedido).
3. Inclua fundamentação legal completa: CF/88, Lei 8.213/91, Lei 9.784/99, jurisprudência.
4. Cite jurisprudência (STF, STJ, TNU) quando aplicável.
5. Use os dados reais coletados na conversa.
6. Ao final, inclua obrigatoriamente a "PÁGINA EM ANEXO – INSTRUÇÕES PRÁTICAS".
7. Formate com seções claras. Linguagem formal mas acessível.
8. Não inclua marcadores especiais. Apenas texto puro do documento.

Gere o documento COMPLETO agora:`;

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 4000,
      }),
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    return { success: true, content };
  } catch (e) {
    return { success: false, content: '', error: (e as Error).message };
  }
}

/**
 * Documento Premium: já vem do chat completo, mas enriquece com a knowledge base
 */
export async function generatePremiumDocument(
  conversation: ConversationMessage[],
  chatDocument: string
): Promise<GenerateResult> {
  const summary = conversation.map(m => `${m.role}: ${m.content}`).join('\n\n');

  const prompt = `${DOCUMENT_KNOWLEDGE_BASE}

${ADDITIONAL_CONTEXT}

${PREMIUM_ANALYSIS_TEMPLATE}

===CONVERSA COMPLETA===
${summary}

===DOCUMENTO JÁ GERADO NO CHAT (melhorar se necessário)===
${chatDocument}

===INSTRUÇÕES===
Com base em tudo acima:
1. Revise e melhore o documento formal se necessário (mais fundamentação, mais técnico, mais robusto).
2. Mantenha os 3 blocos: Documento Previdenciário + Análise Inteligente + Página de Instruções.
3. A Análise Inteligente deve seguir EXATAMENTE os 8 itens do template acima.
4. Nunca prometer resultado, não criticar o INSS, não sugerir fraude.
5. Texto puro, sem marcadores especiais.

Gere o documento COMPLETO E MELHORADO agora:`;

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 5000,
      }),
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    return { success: true, content };
  } catch (e) {
    return { success: false, content: '', error: (e as Error).message };
  }
}
