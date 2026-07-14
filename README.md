# Controle Vovô 👴📅

Aplicativo web para controlar os serviços prestados ao meu avô (**Cuidadora** e
**Fisioterapia**) no formato de uma agenda mensal. Marque os dias em que cada serviço
foi prestado e o app calcula, no fim do mês, quanto pagar a cada um e quanto cabe a
cada pessoa que divide o custo.

## Funcionalidades

- 📅 **Agenda mensal**: toque em um dia para marcar/desmarcar os serviços prestados.
- 💰 **Resumo (dashboard)**: total por serviço (dias × valor), total do mês e **valor por pessoa** (dividido por 4 por padrão).
- ⚙️ **Ajustes**: editar nome, cor e **valor por dia** de cada serviço, adicionar/remover serviços e mudar o número de pessoas.
- Dados salvos na nuvem (Supabase) — persistem entre acessos e dispositivos.
- Feito para ser **fácil de usar** (fontes grandes, alto contraste) e funciona muito bem no **celular**.

## Tecnologias

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) (banco PostgreSQL)
- Hospedagem na [Vercel](https://vercel.com)

## Como rodar localmente

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Crie um projeto no Supabase** (gratuito) em https://supabase.com.

3. **Crie as tabelas**: no painel do Supabase, abra o **SQL Editor**, cole o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e execute.

4. **Configure as variáveis de ambiente**: copie `.env.local.example` para `.env.local` e
   preencha com os dados do seu projeto (em **Settings → API** no Supabase):
   ```bash
   cp .env.local.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```

5. **Rode o app**
   ```bash
   npm run dev
   ```
   Abra http://localhost:3000.

## Como colocar no ar (deploy)

1. Suba o código para um repositório no **GitHub**.
2. Garanta que o passo 3 acima (rodar o `schema.sql`) já foi feito no seu Supabase.
3. Em https://vercel.com, clique em **Add New → Project** e importe o repositório.
4. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (os mesmos valores do `.env.local`).
5. Clique em **Deploy**. Pronto — o site fica no ar numa URL da Vercel.

> Os planos gratuitos da Vercel e do Supabase são suficientes para esse uso.

## Sobre privacidade / acesso

O link é **aberto** (sem senha), conforme combinado. Se um dia quiser proteger o acesso,
os caminhos mais simples são: uma senha única (comparada a uma variável de ambiente) ou o
**Supabase Auth** — nenhum dos dois exige mudar o modelo de dados.
