# Classificador de Texto com IA

Este é um projeto de aplicação web construído com Next.js que utiliza a API do Google Gemini para analisar e classificar textos. A aplicação foi desenvolvida com foco em segurança, experiência do usuário e qualidade de código, seguindo as melhores práticas de desenvolvimento web moderno.

## Funcionalidades

- **Classificação Inteligente**: Analisa o texto em três categorias distintas:
  - **Sentimento**: Positivo, Negativo ou Neutro.
  - **Tonalidade**: Formal ou Informal.
  - **Intenção**: Profissional, Pessoal, Transacional ou Informativo.
- **Apresentação Visual dos Resultados**: Utiliza ícones e cores para fornecer um feedback claro e imediato sobre a classificação.
- **Exemplos Prontos**: Botões de exemplo que permitem testar a aplicação rapidamente com diferentes tipos de texto.
- **Interface Reativa e Moderna**: Construída com React e estilizada com Tailwind CSS.

## Captura de Tela

*Insira uma captura de tela da aplicação aqui.*

![Captura de Tela da Aplicação](URL_DA_IMAGEM_AQUI)

## Destaques de Segurança

Foram implementadas múltiplas camadas de segurança para proteger a aplicação e a API:

- **Proteção de Chave de API**: A chave de API é utilizada exclusivamente no backend e carregada via variáveis de ambiente, nunca sendo exposta no lado do cliente.
- **Mitigação de Injeção de Prompt**: O prompt enviado à IA é "blindado", com instruções explícitas e delimitadores para separar as instruções dos dados do usuário, prevenindo que o modelo seja manipulado.
- **Rate Limiting**: A API possui um limite de requisições por IP para prevenir abuso e ataques de negação de serviço.
- **Validação de Entrada**: O tamanho do texto de entrada é validado no servidor para controlar custos e evitar sobrecarga.

## Arquitetura e Qualidade de Código

O projeto segue uma arquitetura baseada em componentes para garantir organização, manutenibilidade e reutilização de código.

- **Componentização**: A interface é dividida em componentes modulares e bem definidos, localizados em `src/components`.
- **Orquestração Centralizada**: A página principal (`src/app/page.tsx`) atua como um orquestrador, gerenciando o estado e o fluxo de dados, enquanto delega a renderização aos componentes filhos.
- **Código Comentado**: O código-fonte, especialmente os componentes e a lógica de negócio, é documentado com comentários que explicam suas responsabilidades e funcionamento.

## Tecnologias Utilizadas

- **Frontend**:
  - [Next.js](https://nextjs.org/) (React Framework)
  - [React](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (para ícones)
- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [Google Gemini API](https://ai.google.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)

## Como Executar o Projeto

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- Uma chave de API do [Google Gemini](https://ai.google.dev/).

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Renomeie o arquivo `.env.example` para `.env.local`.
    - Abra o arquivo `.env.local` e substitua `SUA_CHAVE_API_AQUI` pela sua chave de API do Google Gemini.
    ```
    # .env.local
    GOOGLE_API_KEY=SUA_CHAVE_API_AQUI
    ```

### Executando a Aplicação

Com as dependências instaladas e as variáveis de ambiente configuradas, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação em funcionamento.
