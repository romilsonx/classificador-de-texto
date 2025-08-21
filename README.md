# Classificador de Texto com IA

Este é um aplicativo web construído com Next.js que utiliza a API do Google Gemini para classificar textos em categorias como sentimento, tonalidade e intenção. Ideal para demonstrar habilidades em desenvolvimento web e integração com Inteligência Artificial.

## Funcionalidades

- Classificação de texto em tempo real (Sentimento, Tonalidade, Intenção).
- Interface de usuário intuitiva e responsiva.
- Limite de 5 consultas por sessão para demonstração.
- Utiliza a API do Google Gemini (modelo `gemini-1.5-flash`).

## Tecnologias Utilizadas

- **Next.js:** Framework React para desenvolvimento de aplicações web.
- **React:** Biblioteca JavaScript para construção de interfaces de usuário.
- **Tailwind CSS:** Framework CSS para estilização rápida e responsiva.
- **Google Gemini API:** Para processamento e classificação de texto com IA.
- **TypeScript:** Linguagem de programação que adiciona tipagem estática ao JavaScript.

## Como Instalar e Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (ou yarn) instalados em seu sistema.

### 1. Clone o Repositório

```bash
git clone https://github.com/romilsonx/classificador-de-texto.git
cd classificador-de-texto/site
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure a Chave da API do Gemini

Crie um arquivo `.env.local` na raiz do diretório `site` (onde está o `package.json`) e adicione sua chave da API do Google Gemini:

```
GEMINI_API_KEY=SUA_CHAVE_DA_API_DO_GEMINI_AQUI
```

Você pode obter sua chave da API do Gemini no [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Execute o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:3000` (ou outra porta, se a 3000 estiver em uso).

## Como Usar

1.  Acesse o aplicativo em seu navegador.
2.  Digite ou cole o texto que deseja classificar na área de texto.
3.  Clique no botão "Analisar Texto".
4.  O resultado da classificação (sentimento, tonalidade e intenção) será exibido abaixo.
5.  Você tem um limite de 5 consultas por sessão. Para reiniciar o contador, clique em "Reiniciar Sessão".

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a licença [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).