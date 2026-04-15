# Agilprev — Guia de Deploy e Configuração

Este guia ensina como colocar o projeto no ar do zero, mesmo sem experiência técnica avançada.

---

## Testar localmente primeiro (antes de subir)

### Passo 1 — Instalar Node.js

Se não tiver instalado: acesse [nodejs.org](https://nodejs.org) → baixe a versão **LTS** → instale normalmente.

### Passo 2 — Abrir o terminal na pasta do projeto

No Mac: clique com botão direito na pasta do projeto → "Novo Terminal na Pasta"
No Windows: segure Shift + botão direito → "Abrir janela do PowerShell aqui"

### Passo 3 — Instalar dependências e rodar

```bash
# Instalar dependências do frontend
npm install

# Rodar o projeto
npm run dev
```

Abra o navegador em **http://localhost:3000** — o site deve aparecer.

### Passo 4 — Testar com link público (para ver no celular ou compartilhar)

Em outro terminal, na mesma pasta:

```bash
ngrok http 3000
```

Se não tiver o ngrok: acesse [ngrok.com](https://ngrok.com) → crie conta grátis → baixe e instale.

A URL pública aparece no terminal. Qualquer pessoa com o link consegue acessar.

> **Nota:** enquanto o terminal estiver aberto, o site funciona. Se fechar, para.

---

## Colocar no ar de verdade (permanente)

Para o site funcionar 24/7 com pagamento PIX real, são necessários 4 serviços. Todos têm plano gratuito ou barato.

---

### SERVIÇO 1 — Supabase (banco de dados) — Grátis

O banco guarda as sessões e confirmações de pagamento.

**1.** Acesse [supabase.com](https://supabase.com) → faça login → abra o projeto **Agilprev**

**2.** No menu esquerdo clique em **SQL Editor** → clique em **New query**

**3.** Copie e cole o conteúdo do arquivo `server/setup-database.sql` → clique **Run**

**4.** Vá em **Settings** (engrenagem) → **API Keys** → seção **Secret keys**
- Clique no olho para revelar
- Copie o valor que começa com `sb_secret_...`
- Guarde: isso é o `SUPABASE_SERVICE_ROLE_KEY`

---

### SERVIÇO 2 — Railway (backend) — ~R$ 25/mês

O backend processa o pagamento PIX e envia e-mails.

**1.** Suba o projeto no GitHub:
- Crie conta em [github.com](https://github.com)
- Crie um repositório **privado** chamado `agilprev`
- Instale o GitHub Desktop em [desktop.github.com](https://desktop.github.com)
- Arraste a pasta do projeto para o GitHub Desktop → publique no repositório privado

**2.** Acesse [railway.app](https://railway.app) → faça login com GitHub → clique **New Project** → **Deploy from GitHub repo** → selecione o repositório

**3.** Quando perguntar o diretório raiz, coloque: `server`

**4.** Vá em **Variables** e adicione uma por uma:

```
VITE_SUPABASE_URL        = https://xfznmbkzgysdgqiboghr.supabase.co
SUPABASE_SERVICE_ROLE_KEY = sb_secret_... (o que você copiou no passo anterior)
RESEND_API_KEY           = re_AvbkuVF2_5zK2rCLSWFFpMJkQWDn4GXy6
OPENPIX_APP_ID           = (preencher depois no passo 3)
FRONTEND_URL             = (preencher depois no passo 4)
SERVER_PORT              = 3333
```

**5.** Vá em **Settings** → **Networking** → clique em **Generate Domain**
- Copie a URL gerada (ex: `https://agilprev-server.railway.app`)
- Guarde: isso é o endereço do seu backend

---

### SERVIÇO 3 — OpenPix (pagamento PIX) — Grátis

Gera o QR Code PIX e avisa quando o pagamento for feito.

**1.** Acesse [app.openpix.com.br](https://app.openpix.com.br)
- Login: `03275294580` / Senha: `Rikimaru@567`

**2.** No menu esquerdo clique em **API/Plugins** → clique na API que você criou → copie o **App ID**
- Guarde: isso é o `OPENPIX_APP_ID`

**3.** Volte ao Railway → adicione a variável:
```
OPENPIX_APP_ID = (o App ID que você copiou)
```

**4.** Ainda no OpenPix, clique em **Novo Webhook** (botão verde no canto superior direito):
- **URL:** `https://SEU-BACKEND.railway.app/api/openpix/webhook`
  *(substitua pelo endereço que o Railway gerou)*
- **Evento:** selecione `OPENPIX:CHARGE_COMPLETED`
- Salve

> Esse webhook é o que avisa seu sistema quando alguém paga. Sem ele, o pagamento não libera o PDF.

---

### SERVIÇO 4 — Vercel (frontend) — Grátis

Hospeda o site que os usuários vão acessar.

**1.** Acesse [vercel.com](https://vercel.com) → faça login com GitHub → clique **Add New Project**

**2.** Selecione o repositório `agilprev`

**3.** Antes de confirmar o deploy, clique em **Environment Variables** e adicione:

```
VITE_OPENAI_API_KEY      = (definir no .env.local)
VITE_SUPABASE_URL        = https://xfznmbkzgysdgqiboghr.supabase.co
VITE_SUPABASE_ANON_KEY   = (definir no .env.local)
OPENPIX_APP_ID           = (o App ID do OpenPix)
RESEND_API_KEY           = (definir no .env.local)
VITE_API_URL             = https://SEU-BACKEND.railway.app (URL do Railway)
FRONTEND_URL             = (preencher depois que a Vercel gerar a URL)
```

**4.** Clique **Deploy** — aguarde ~2 minutos

**5.** A Vercel vai gerar uma URL (ex: `https://agilprev.vercel.app`)
- Copie essa URL
- Volte ao Railway → adicione/atualize:
  ```
  FRONTEND_URL = https://agilprev.vercel.app
  ```
- Volte à Vercel → adicione/atualize:
  ```
  FRONTEND_URL = https://agilprev.vercel.app
  ```

---

## Verificar se está tudo funcionando

Abra o site na URL da Vercel e faça o fluxo completo:

1. Clique em "Resolver meu caso agora"
2. Escolha um produto
3. Converse com o chat até gerar o documento
4. Veja o preview
5. Clique em "Desbloquear" — o QR Code PIX deve aparecer
6. Pague com qualquer valor de teste (R$ 29 ou R$ 59)
7. O PDF deve baixar automaticamente

Se o QR Code aparecer e o PDF baixar após o pagamento → **está 100% funcionando**.

---

## Tempo estimado: 40 minutos
