export const DOCUMENT_SKILLS = {
  aposentadoria: {
    palavrasChave: [
      'aposentadoria',
      'aposentar',
      'tempo de contribuição',
      'idade',
      'aposentadoria por idade',
      'aposentadoria por tempo',
      'aposentadoria especial',
      'cnis',
      'contribuição',
      'carteira assinada',
      'inss atrasado'
    ],
  
    perguntasExtras: [
      'Qual sua idade atual?',
      'Você já trabalhou com carteira assinada?',
      'Você possui CNIS atualizado?',
      'Seu pedido foi negado ou ainda está em análise?',
      'Existe algum vínculo ou contribuição que não aparece no CNIS?'
    ],
  
    tipoDocumento: 'REQUERIMENTO_APOSENTADORIA',
  
    tituloDocumento: 'Análise Previdenciária de Aposentadoria',
  
    objetivoDocumento: `
  Avaliar situação relacionada a pedido de aposentadoria, considerando idade, tempo de contribuição, vínculos no CNIS, períodos trabalhados, contribuições e eventual negativa ou demora do INSS.
  `,
  
    fundamentacaoLegal: `
  A aposentadoria previdenciária depende da análise dos requisitos legais aplicáveis ao caso concreto, como idade, tempo de contribuição, qualidade de segurado quando exigida, carência e regras de transição.
  
  A análise deve considerar o histórico contributivo do segurado, vínculos registrados no CNIS, períodos trabalhados com carteira assinada, contribuições individuais e eventuais inconsistências cadastrais.
  
  Quando houver negativa, demora ou ausência de reconhecimento de vínculos, podem ser cabíveis providências administrativas, recurso ou complementação documental.
  `,
  
    argumentosPrincipais: [
      'verificação da idade e do tempo de contribuição',
      'análise do CNIS e dos vínculos registrados',
      'possibilidade de existência de vínculos não computados',
      'necessidade de comprovação de períodos trabalhados',
      'análise de eventual negativa ou demora do INSS',
      'importância da documentação previdenciária organizada'
    ],
  
    pedidosRecomendados: [
      'análise do requerimento de aposentadoria',
      'reconhecimento dos períodos contributivos comprovados',
      'correção de vínculos ou contribuições inconsistentes',
      'reavaliação da decisão administrativa quando houver negativa',
      'concessão do benefício quando preenchidos os requisitos legais'
    ],
  
    proximosPassos: [
      'baixar o CNIS atualizado no Meu INSS',
      'separar carteira de trabalho e carnês de contribuição',
      'verificar vínculos ausentes ou com erro',
      'guardar protocolo do pedido administrativo',
      'acompanhar andamento pelo Meu INSS',
      'avaliar recurso administrativo em caso de indeferimento'
    ]
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
  
    auxilioDoenca: {
      palavrasChave: [
        'auxílio-doença',
        'auxilio doença',
        'benefício por incapacidade',
        'incapacidade',
        'perícia',
        'atestado',
        'laudo médico',
        'doença',
        'afastado do trabalho'
      ],
    
      perguntasExtras: [
        'Qual doença ou condição motivou o afastamento?',
        'Você possui laudo médico ou atestado atualizado?',
        'Já passou por perícia do INSS?',
        'O benefício foi negado, cessado ou ainda está em análise?'
      ],
    
      tipoDocumento: 'REQUERIMENTO_AUXILIO_DOENCA',
    
      tituloDocumento: 'Análise Previdenciária de Auxílio-Doença',
    
      objetivoDocumento: `
    Avaliar situação relacionada a pedido de auxílio-doença ou benefício por incapacidade temporária, considerando incapacidade para o trabalho, documentos médicos, perícia do INSS e situação administrativa do requerimento.
    `,
    
      fundamentacaoLegal: `
    O auxílio-doença, atualmente chamado benefício por incapacidade temporária, é destinado ao segurado que demonstra incapacidade temporária para o exercício de sua atividade laboral.
    
    A análise normalmente envolve qualidade de segurado, carência quando exigida, documentação médica e avaliação pericial.
    
    Quando houver demora excessiva, negativa indevida ou ausência de análise adequada, podem ser cabíveis medidas administrativas ou judiciais, conforme o caso concreto.
    `,
    
      argumentosPrincipais: [
        'existência de incapacidade temporária para o trabalho',
        'necessidade de análise médica e administrativa',
        'importância de laudos, exames e atestados atualizados',
        'caráter alimentar do benefício',
        'impacto da demora ou negativa na subsistência do segurado'
      ],
    
      pedidosRecomendados: [
        'análise do requerimento administrativo',
        'realização ou reavaliação de perícia médica',
        'consideração dos documentos médicos apresentados',
        'concessão ou restabelecimento do benefício, quando cabível',
        'orientação para recurso administrativo em caso de negativa'
      ],
    
      proximosPassos: [
        'organizar laudos, exames e atestados médicos',
        'verificar situação do pedido no Meu INSS',
        'guardar comprovantes de protocolo',
        'acompanhar comunicações do INSS',
        'avaliar recurso administrativo ou orientação jurídica em caso de negativa'
      ]
    },

    auxilioMaternidade: {
      palavrasChave: [
        'auxílio maternidade',
        'auxilio maternidade',
        'salário maternidade',
        'salario maternidade',
        'maternidade',
        'gestante',
        'gravidez',
        'parto',
        'bebê',
        'nascimento',
        'adoção',
        'mãe',
        'mei maternidade',
        'segurada especial'
      ],
    
      perguntasExtras: [
        'A criança já nasceu ou ainda está gestante?',
        'Qual foi a data do parto ou previsão do parto?',
        'Você trabalha com carteira assinada, é MEI, contribuinte individual, desempregada ou segurada especial?',
        'Você possui certidão de nascimento, atestado médico ou documentos da gravidez?',
        'O pedido foi negado, está em análise ou ainda não foi feito?'
      ],
    
      tipoDocumento: 'REQUERIMENTO_AUXILIO_MATERNIDADE',
    
      tituloDocumento: 'Análise Previdenciária de Salário-Maternidade',
    
      objetivoDocumento: `
    Avaliar situação relacionada ao salário-maternidade, benefício devido em razão de parto, adoção, guarda judicial para fins de adoção ou situações legalmente previstas, considerando a categoria da segurada e os documentos apresentados.
    `,
    
      fundamentacaoLegal: `
    O salário-maternidade é benefício previdenciário destinado à proteção da maternidade e da criança.
    
    A análise pode variar conforme a condição da requerente, como empregada, contribuinte individual, MEI, desempregada em período de graça, trabalhadora rural ou segurada especial.
    
    Para análise do direito, são relevantes documentos como certidão de nascimento, atestado médico, documentos pessoais, comprovantes de contribuição, vínculo de trabalho ou documentos que demonstrem atividade rural, quando aplicável.
    `,
    
      argumentosPrincipais: [
        'proteção previdenciária à maternidade',
        'necessidade de análise da qualidade de segurada',
        'verificação da categoria da requerente',
        'importância da certidão de nascimento ou atestado médico',
        'possibilidade de direito mesmo em situações de desemprego, conforme o caso',
        'necessidade de comprovação documental adequada'
      ],
    
      pedidosRecomendados: [
        'análise do requerimento de salário-maternidade',
        'consideração dos documentos apresentados',
        'verificação da qualidade de segurada',
        'concessão do benefício quando preenchidos os requisitos',
        'reavaliação administrativa em caso de negativa'
      ],
    
      proximosPassos: [
        'separar RG, CPF e comprovante de residência',
        'separar certidão de nascimento da criança ou atestado médico',
        'verificar vínculos e contribuições no Meu INSS',
        'guardar protocolo do pedido administrativo',
        'acompanhar o andamento pelo Meu INSS',
        'avaliar recurso administrativo em caso de indeferimento'
      ],

      cuidadosImportantes: [
        'não afirmar que houve parto se o usuário não informou',
        'não afirmar que a criança nasceu se isso não foi confirmado',
        'não presumir vínculo de emprego, MEI, desemprego ou segurada especial',
        'não presumir documentação já apresentada ao INSS',
        'usar linguagem neutra quando faltarem informações essenciais'
      ],
    },

    beneficioNegado: {
      palavrasChave: [
        'negado',
        'indeferido',
        'benefício negado',
        'aposentadoria negada',
        'auxílio negado',
        'bpc negado',
        'loas negado',
        'pedido negado',
        'não foi aprovado',
        'carta de indeferimento'
      ],
    
      perguntasExtras: [
        'Qual benefício foi negado?',
        'Você recebeu carta de indeferimento?',
        'Qual foi o motivo informado pelo INSS?',
        'Você ainda está dentro do prazo para recurso?',
        'Você possui documentos para contestar a negativa?'
      ],
    
      tipoDocumento: 'RECURSO_ADMINISTRATIVO',
    
      tituloDocumento: 'Análise de Benefício Negado pelo INSS',
    
      objetivoDocumento: `
    Avaliar situação em que o INSS negou ou indeferiu um benefício previdenciário ou assistencial, identificando possíveis fundamentos para recurso administrativo, complementação de documentos ou nova análise do pedido.
    `,
    
      fundamentacaoLegal: `
    Quando o INSS nega um benefício, o segurado ou requerente tem direito de compreender o motivo da negativa e, quando cabível, apresentar recurso administrativo.
    
    A Administração Pública deve observar os princípios do contraditório, da ampla defesa, da motivação dos atos administrativos, da razoabilidade e da eficiência.
    
    Em casos de indeferimento, é importante analisar a carta de decisão, o motivo informado pelo INSS, os documentos apresentados e a possibilidade de complementar provas.
    `,
    
      argumentosPrincipais: [
        'existência de decisão administrativa desfavorável',
        'necessidade de análise do motivo do indeferimento',
        'possibilidade de apresentação de recurso administrativo',
        'direito ao contraditório e à ampla defesa',
        'possibilidade de juntada de documentos complementares',
        'necessidade de demonstrar erro, omissão ou insuficiência na análise do INSS'
      ],
    
      pedidosRecomendados: [
        'reconsideração da decisão administrativa',
        'recebimento e análise de recurso administrativo',
        'reavaliação dos documentos apresentados',
        'possibilidade de juntada de novos documentos',
        'nova análise do direito ao benefício solicitado'
      ],
    
      proximosPassos: [
        'baixar ou consultar a carta de indeferimento',
        'verificar o motivo exato da negativa',
        'separar documentos que comprovem o direito ao benefício',
        'observar prazo para recurso administrativo',
        'protocolar recurso pelo Meu INSS ou buscar orientação especializada'
      ]
    },
  
    loas: {
      palavrasChave: [
        'loas',
        'bpc',
        'benefício assistencial',
        'idoso',
        'deficiência',
        'pcd',
        'autismo',
        'incapacidade',
        'baixa renda',
        'cadunico',
        'cadúnico'
      ],
    
      perguntasExtras: [
        'O pedido é para idoso ou pessoa com deficiência?',
        'Qual a renda aproximada da família?',
        'Você está inscrito no CadÚnico?',
        'O benefício foi negado ou está em análise?',
        'Possui laudos médicos ou relatórios sociais?'
      ],
    
      tipoDocumento: 'REQUERIMENTO_LOAS',
    
      tituloDocumento: 'Análise de Benefício Assistencial LOAS/BPC',
    
      objetivoDocumento: `
    Avaliar situação relacionada ao Benefício de Prestação Continuada (BPC/LOAS), considerando requisitos de renda, deficiência, idade e vulnerabilidade social.
    `,
    
      fundamentacaoLegal: `
    O Benefício de Prestação Continuada é garantido pela Lei Orgânica da Assistência Social.
    
    O benefício pode ser concedido ao idoso com 65 anos ou mais e à pessoa com deficiência que demonstre impedimentos de longo prazo e situação de vulnerabilidade social.
    
    A análise considera renda familiar, cadastro social, documentação médica quando aplicável e demais requisitos previstos na legislação.
    `,
    
      argumentosPrincipais: [
        'situação de vulnerabilidade social',
        'necessidade de proteção assistencial',
        'existência de deficiência ou idade avançada',
        'importância do CadÚnico atualizado',
        'necessidade de análise completa da situação familiar'
      ],
    
      pedidosRecomendados: [
        'análise do requerimento assistencial',
        'realização de avaliação social',
        'realização de avaliação médica quando necessária',
        'consideração dos documentos apresentados',
        'concessão do benefício quando preenchidos os requisitos'
      ],
    
      proximosPassos: [
        'manter CadÚnico atualizado',
        'organizar documentos da família',
        'separar comprovantes de renda',
        'guardar protocolos do INSS',
        'acompanhar o pedido pelo Meu INSS'
      ]
    },

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