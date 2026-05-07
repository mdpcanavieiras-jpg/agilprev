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
  
      tipoDocumento: 'MANDADO_SEGURANCA_DEMORA'
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