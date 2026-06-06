import { DOCUMENT_KNOWLEDGE_BASE, ADDITIONAL_CONTEXT, PREMIUM_ANALYSIS_TEMPLATE } from './documentKnowledgeBase';
import { DOCUMENT_SKILLS } from './skills/documentKnowledgeBase';
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

function getRelevantDocumentSkill(summary: string) {
  const normalizedSummary = summary.toLowerCase();

  for (const [skillName, skill] of Object.entries(DOCUMENT_SKILLS)) {
    const matched = skill.palavrasChave.some((keyword: string) =>
      normalizedSummary.includes(keyword.toLowerCase())
    );

    if (matched) {
      return {
        skillName,
        ...skill
      };
    }
  }

  return null;
}
/**
 * Documento Básico: chama a OpenAI com a knowledge base completa + conversa
 */
export async function generateBasicDocument(conversation: ConversationMessage[]): Promise<GenerateResult> {
  const summary = conversation.map(m => `${m.role}: ${m.content}`).join('\n\n');

  const detectedSkill = getRelevantDocumentSkill(summary);
  const skillContext = detectedSkill
  ? `
TIPO DETECTADO: ${detectedSkill.tipoDocumento}

TÍTULO RECOMENDADO:
${(detectedSkill as any).tituloDocumento || ''}

OBJETIVO DO DOCUMENTO:
${(detectedSkill as any).objetivoDocumento || ''}

FUNDAMENTAÇÃO LEGAL ESPECÍFICA:
${(detectedSkill as any).fundamentacaoLegal || ''}

ARGUMENTOS PRINCIPAIS:
${(detectedSkill as any).argumentosPrincipais?.join('\n') || ''}

PEDIDOS RECOMENDADOS:
${(detectedSkill as any).pedidosRecomendados?.join('\n') || ''}

PRÓXIMOS PASSOS:
${(detectedSkill as any).proximosPassos?.join('\n') || ''}

PERGUNTAS IMPORTANTES:
${detectedSkill.perguntasExtras.join('\n')}

O documento deve ser estruturado especificamente para este tipo de caso, usando a fundamentação, argumentos, pedidos e próximos passos acima.
`
  : '';

  const prompt = `${DOCUMENT_KNOWLEDGE_BASE}

${ADDITIONAL_CONTEXT}

${skillContext}

===SKILL IDENTIFICADA===

Tipo de Documento:
${detectedSkill?.tipoDocumento || 'DOCUMENTO_PREVIDENCIARIO'}

Perguntas Relevantes:
${detectedSkill?.perguntasExtras?.join('\n') || 'Nenhuma'}

Instrução:
Caso uma skill tenha sido identificada, adapte o documento ao contexto específico detectado.

===CONVERSA COMPLETA===
${summary}

===INSTRUÇÕES===
Com base na conversa acima e na base de conhecimento, gere o documento previdenciário FORMAL, ÚTIL e PERSONALIZADO para o caso do usuário.

REGRAS OBRIGATÓRIAS:
1. Identifique o tipo de documento mais adequado ao caso, com base nas respostas reais do usuário.
2. Use estrutura formal clara: Título, Identificação, Resumo do Caso, Dos Fatos, Do Direito, Dos Pedidos e Encerramento.
3. Use fundamentação legal relacionada ao benefício ou problema informado.
4. Cite apenas fundamentos legais compatíveis com o caso. Não cite leis aleatórias.
5. Não invente dados pessoais, datas, número de protocolo, endereço, vara, comarca ou cidade.
6. Se a data atual for necessária, use exatamente: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.
7. Se o número de protocolo não tiver sido informado, escreva: "pedido administrativo junto ao INSS", sem colchetes.
8. Nunca escreva placeholders como [Data], [número do protocolo], [cidade], [nome] ou similares.
9. Remova totalmente qualquer seção chamada "DO VALOR DA CAUSA".
10. Não atribua valor à causa.
11. Não gere texto dizendo "Dá-se à causa o valor de...".
12. Ao final do documento principal, escreva o local e data apenas se a cidade tiver sido informada. Caso contrário, escreva apenas a data.
13. Inclua a seção "PÁGINA EM ANEXO – INSTRUÇÕES PRÁTICAS" somente após o encerramento do documento.
14. A página em anexo deve ser separada conceitualmente do documento principal, com título próprio.
15. Linguagem formal, clara e acessível.
16. Não prometa resultado, não garanta aprovação e não critique o INSS de forma ofensiva.
17. Gere apenas texto puro do documento.
18. A seção DOS FATOS deve conter no mínimo 3 parágrafos explicando a situação relatada pelo usuário.
19. A seção DO DIREITO deve explicar de forma clara os direitos relacionados ao caso identificado.
20. A seção DOS PEDIDOS deve ser específica para o problema apresentado.
21. A seção PÁGINA EM ANEXO – INSTRUÇÕES PRÁTICAS deve conter orientações detalhadas e acionáveis.
22. Sempre explicar próximos passos possíveis junto ao INSS.
23. O documento deve ter aparência de documento profissional elaborado para protocolo administrativo.
24. Evite textos genéricos ou excessivamente curtos.
25. Desenvolva os tópicos com profundidade adequada ao caso apresentado.
26. Se não houver informação de cidade ou vara competente, escrever apenas:
"À JUSTIÇA FEDERAL COMPETENTE".
27. É proibido gerar:
[CIDADE]
[CIDADE/UF]
[DATA]
[NOME]
[PROTOCOLO]
___ª Vara
ou qualquer placeholder semelhante.
28. Nunca utilize markdown.
29. Não utilize **texto**, ##, ###, --- ou qualquer sintaxe markdown.
30. Entregue somente texto puro.
31. DOS FATOS deve possuir no mínimo 3 parágrafos.
32. DO DIREITO deve possuir no mínimo 2 parágrafos.
33. DOS PEDIDOS deve conter fundamentação e explicação do motivo de cada pedido.
34. O documento deve possuir no mínimo 1 página completa de conteúdo antes da seção de instruções práticas.
35. Desenvolva os fatos com riqueza de detalhes baseada exclusivamente nas informações fornecidas pelo usuário.
36. Explique de forma didática por que o direito do usuário pode estar sendo afetado.
37. As orientações práticas devem conter passo a passo claro para o cidadão comum.

IMPORTANTE:
O documento deve parecer profissional, personalizado e confiável, mesmo sendo a versão básica.

Gere o documento COMPLETO agora:`;

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 4000,
      }),
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const data = await res.json() as { content?: string; message?: string; choices?: { message?: { content?: string } }[] };
    const content = (data.content || data.message || '').trim();
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
  console.log('PREMIUM START');
  console.log('Prompt size:', prompt.length);

  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 2500,
    }),
  });

  console.log('STATUS PREMIUM:', res.status);

  if (!res.ok) throw new Error(`Erro ${res.status}`);

  const data = await res.json() as { choices?: { message?: { content?: string } }[] };

  console.log('DATA PREMIUM:', data);

  const content =
  (data as any).content?.trim?.() ||
  (data as any).message?.trim?.() ||
  data.choices?.[0]?.message?.content?.trim() ||
  '';
  return { success: true, content };
} catch (e) {
  return { success: false, content: '', error: (e as Error).message };
}
}
