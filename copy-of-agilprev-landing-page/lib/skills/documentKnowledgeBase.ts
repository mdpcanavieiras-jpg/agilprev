export const DOCUMENT_SKILLS = {
    aposentadoria: {
      palavrasChave: [
        'aposentadoria',
        'aposentar',
        'tempo de contribuição',
        'idade'
      ],
  
      perguntasExtras: [
        'Qual sua idade atual?',
        'Você já trabalhou com carteira assinada?',
        'Seu pedido foi negado ou ainda está em análise?'
      ],
  
      tipoDocumento: 'REQUERIMENTO_APOSENTADORIA'
    },
  
    demoraINSS: {
      palavrasChave: [
        'demora',
        'atrasado',
        'sem resposta',
        'faz meses',
        'não responde',
        'parado'
      ],
    
      perguntasExtras: [
        'Há quantos meses o pedido está parado?',
        'Você possui número de protocolo?',
        'Recebeu alguma carta do INSS?'
      ],
    
      tipoDocumento: 'MANDADO_SEGURANCA_DEMORA',
    
      tituloDocumento: 'Análise de Demora Administrativa do INSS',
    
      objetivoDocumento: `
    Avaliar situação de benefício ou requerimento que permanece sem decisão administrativa por período superior ao esperado.
    `,
    
      fundamentacaoLegal: `
    A Administração Pública possui dever de decidir os requerimentos apresentados pelos cidadãos dentro de prazo razoável.
    
    A Constituição Federal assegura a duração razoável do processo.
    
    A Lei 9.784/1999 determina que os processos administrativos sejam concluídos em prazo adequado.
    
    Em situações de demora excessiva pode existir fundamento para medidas administrativas ou judiciais.
    `,
    
      argumentosPrincipais: [
        'existência de protocolo administrativo',
        'demora superior ao prazo razoável',
        'ausência de resposta do INSS',
        'necessidade de conclusão do requerimento',
        'direito à análise administrativa'
      ],
    
      pedidosRecomendados: [
        'solicitação de andamento',
        'pedido de conclusão da análise',
        'reclamação administrativa',
        'avaliação de mandado de segurança quando aplicável'
      ],
    
      proximosPassos: [
        'guardar protocolo',
        'acompanhar Meu INSS',
        'registrar novas movimentações',
        'manter documentos organizados'
      ]
    },
  
    beneficioNegado: {
      palavrasChave: [
        'negado',
        'indeferido',
        'benefício negado',
        'aposentadoria negada'
      ],
  
      perguntasExtras: [
        'Qual benefício foi negado?',
        'Você recebeu carta de indeferimento?',
        'Qual foi o motivo informado pelo INSS?'
      ],
  
      tipoDocumento: 'RECURSO_ADMINISTRATIVO'
    },
  
    loas: {
      palavrasChave: [
        'loas',
        'bpc',
        'benefício assistencial'
      ],
  
      perguntasExtras: [
        'O pedido é para idoso ou deficiência?',
        'Você recebe algum outro benefício?',
        'Qual renda da família?'
      ],
  
      tipoDocumento: 'REQUERIMENTO_LOAS'
    }
  };

  export const HERO_SKILLS = {
    acolhimento: {
      palavrasChave: [
        'inss',
        'benefício',
        'aposentadoria',
        'loas',
        'bpc',
        'recurso',
        'negado',
        'demora'
      ],
  
      orientacao: `
  O Hero deve acolher, explicar com calma e orientar o usuário sem gerar documento.
  
  Fazer perguntas simples e identificar:
  - se é atraso
  - negativa
  - aposentadoria
  - LOAS/BPC
  - revisão
  - exigência do INSS
  
  O Hero deve:
  - responder de forma humana
  - evitar linguagem jurídica difícil
  - explicar próximos passos
  - encaminhar para Documento Básico ou Premium quando fizer sentido
  `
    }
  };
  export const PREMIUM_SKILLS = {
    analiseInteligente: {
      palavrasChave: [
        'premium',
        'análise',
        'estratégia',
        'urgente',
        'risco',
        'indeferido',
        'negado',
        'demora',
        'parado',
        'bpc',
        'loas',
        'aposentadoria',
        'exigência',
        'recurso'
      ],
  
      orientacao: `
  O Premium deve realizar análise estratégica do caso previdenciário.
  
  OBJETIVOS:
  - reduzir erros administrativos;
  - orientar próximos passos;
  - classificar riscos;
  - explicar situação atual;
  - alinhar expectativas;
  - orientar documentos importantes.
  
  CLASSIFICAÇÃO:
  - caso simples;
  - atenção moderada;
  - caso sensível;
  - caso crítico.
  
  O Premium deve:
  - explicar riscos sem alarmismo;
  - evitar promessas;
  - usar linguagem humana;
  - orientar de forma estratégica;
  - explicar o que normalmente acontece no INSS;
  - orientar documentos importantes;
  - explicar erros comuns;
  - explicar próximos passos seguros.
  
  O Premium NÃO deve:
  - garantir benefício;
  - prometer aprovação;
  - substituir advogado;
  - afirmar vitória judicial;
  - criar conflito com o INSS.
  `
    }
  };