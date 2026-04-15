/**
 * Diálogo educativo na landing — IA real com limites de uso.
 * Regras: máx. 3 trocas por sessão, sem pedir dados, sem gerar doc, sem citar preço.
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SESSION_KEY = 'agil_edu_count';
export const MAX_EXCHANGES = 3;

export const HERO_OPENING =
  'Olá! Qual é a sua situação com o INSS? Me conte em poucas palavras 👇';

const SYSTEM_PROMPT = `Você é um assistente rápido do Agilprev presente na página inicial do site.
Seu único papel: entender o problema do usuário em poucas trocas, dar uma resposta útil e direcionar para o atendimento completo.

CONTEXTO DO AGILPREV:
O Agilprev resolve problemas com o INSS gerando documentos jurídicos personalizados (requerimentos, recursos, revisões, mandados de segurança).
Dois produtos: Documento (R$ 29) e Documento + Análise Inteligente (R$ 59).

REGRAS OBRIGATÓRIAS:
- Respostas CURTAS: máximo 2-3 frases. Sem enrolação.
- Linguagem simples, zero juridiquês.
- Nunca pedir CPF, RG, endereço ou dados pessoais.
- Nunca prometer resultado ou garantir concessão.
- Nunca gerar documentos aqui.

FLUXO OBRIGATÓRIO (3 trocas no máximo):

Troca 1 — Entender o problema:
Responda com empatia em 1-2 frases. Identifique: demora, negativa, valor errado, exigência confusa, etc.

Troca 2 — Clarificar e validar:
Confirme o entendimento e explique em 1 frase qual é o caminho certo (ex: "Nesse caso, o ideal é um Recurso ao CRPS dentro de 30 dias.").

Troca 3 — Apresentar as opções (OBRIGATÓRIO na última troca):
Use EXATAMENTE este texto e inclua [[MOSTRAR_OPCOES]] ao final:
"Já entendi o suficiente para te ajudar. O Agilprev resolve isso para você em minutos:
• Documento Previdenciário — documento pronto para protocolo
• Documento + Análise Inteligente — documento + orientação personalizada do seu caso
[[MOSTRAR_OPCOES]]"

SITUAÇÕES ESPECIAIS:
- Saudação simples ("oi", "olá", "bom dia"): responda "Olá! Me conta: qual é o seu problema com o INSS?"
- Pergunta sobre o Agilprev: explique em 2 frases o que é e como funciona.
- Se o usuário já souber o que quer: vá direto para [[MOSTRAR_OPCOES]] sem esperar 3 trocas.
- Pergunta completamente fora do tema INSS/previdência: responda "Só consigo ajudar com questões do INSS e benefícios previdenciários. Tem alguma situação com o INSS que posso esclarecer?"
- NUNCA repita a mensagem de abertura como resposta. Sempre avance a conversa.

FRASE-CHAVE: Este chat orienta. O atendimento completo resolve.`;

const FALLBACK =
  'Sua situação tem encaminhamento possível. Muitas pessoas passam por benefício negado, demora ou valor incorreto — e a lei prevê prazos e formas de contestar. Estamos aqui para ajudar no próximo passo.';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EducationalResult {
  success: boolean;
  message: string;
  exchangesUsed: number;
  limitReached: boolean;
  error?: string;
}

export function getExchangeCount(): number {
  return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
}

export function resetExchangeCount(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// Chave injetada em tempo de build pelo Vite — com fallback direto garantido
const _KEY = import.meta.env.VITE_OPENAI_API_KEY as string;

export async function getEducationalResponse(
  history: ChatMessage[]
): Promise<EducationalResult> {
  const count = getExchangeCount();

  if (count >= MAX_EXCHANGES) {
    return {
      success: true,
      message: '',
      exchangesUsed: count,
      limitReached: true,
    };
  }

  const apiKey = _KEY;

  if (!apiKey?.trim()) {
    sessionStorage.setItem(SESSION_KEY, String(count + 1));
    return {
      success: true,
      message: FALLBACK,
      exchangesUsed: count + 1,
      limitReached: count + 1 >= MAX_EXCHANGES,
    };
  }

  try {
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
        ],
        temperature: 0.5,
        max_tokens: 350,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: { message?: string } })?.error?.message || 'Erro na API');
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim() || FALLBACK;
    const newCount = count + 1;
    sessionStorage.setItem(SESSION_KEY, String(newCount));

    return {
      success: true,
      message: text,
      exchangesUsed: newCount,
      limitReached: newCount >= MAX_EXCHANGES,
    };
  } catch (e) {
    console.error('getEducationalResponse:', e);
    const newCount = count + 1;
    sessionStorage.setItem(SESSION_KEY, String(newCount));
    return {
      success: true,
      message: FALLBACK,
      exchangesUsed: newCount,
      limitReached: newCount >= MAX_EXCHANGES,
      error: (e as Error).message,
    };
  }
}
