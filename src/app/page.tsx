"use client";

import { useState, useEffect } from "react";

// --- Definição de Tipos e Constantes ---

// Define a estrutura esperada do resultado da classificação da API.
type ClassificationResult = {
  sentimento: string;
  tonalidade: string;
  intencao: string;
};

// Limite máximo de consultas por sessão para o rate limiting.
const MAX_QUERIES = 5; 

// --- Componente Principal da Página ---

export default function HomePage() {
  // --- Estados do Componente ---

  // Armazena o texto que o usuário digita na textarea.
  const [text, setText] = useState("");
  // Armazena o resultado da classificação recebido da API.
  const [result, setResult] = useState<ClassificationResult | null>(null);
  // Controla o estado de carregamento (true enquanto a API está sendo chamada).
  const [isLoading, setIsLoading] = useState(false);
  // Armazena mensagens de erro para serem exibidas ao usuário.
  const [error, setError] = useState<string | null>(null);
  // Controla o número de consultas restantes para o usuário na sessão atual.
  const [queriesLeft, setQueriesLeft] = useState(MAX_QUERIES);

  // --- Efeitos para Gerenciamento de Sessão (localStorage) ---

  // useEffect para carregar o contador de consultas restantes do localStorage ao iniciar o componente.
  // Garante que o limite de uso persista entre recarregamentos da página na mesma sessão.
  useEffect(() => {
    const storedQueries = localStorage.getItem('classifierQueriesLeft');
    if (storedQueries) {
      setQueriesLeft(parseInt(storedQueries, 10));
    }
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez, na montagem do componente.

  // useEffect para salvar o contador de consultas restantes no localStorage sempre que ele muda.
  // Isso mantém o estado atualizado para futuras visitas na mesma sessão.
  useEffect(() => {
    localStorage.setItem('classifierQueriesLeft', queriesLeft.toString());
  }, [queriesLeft]); // Roda sempre que 'queriesLeft' é atualizado.

  // --- Handler para Classificação de Texto ---

  /**
   * Função assíncrona que lida com a submissão do texto para classificação.
   * Gerencia o estado de carregamento, erros e a chamada à API.
   */
  const handleClassify = async () => {
    // Verifica se o limite de consultas foi atingido.
    if (queriesLeft <= 0) {
      setError("Limite de 5 consultas por sessão atingido. Por favor, reinicie a sessão.");
      return;
    }

    // Validação básica: verifica se há texto para classificar.
    if (!text.trim()) {
      setError("Por favor, insira um texto para classificar.");
      return;
    }

    // Reseta estados de UI e inicia o carregamento.
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Faz a chamada à API backend para o endpoint de classificação.
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      // Verifica se a resposta da API foi bem-sucedida (status 2xx).
      if (!response.ok) {
        // Tenta extrair a mensagem de erro da resposta JSON da API.
        const errorData = await response.json();
        throw new Error(errorData.error || `A resposta da API não foi bem-sucedida: ${response.statusText}`);
      }

      // Converte a resposta para JSON e atualiza o estado com o resultado da classificação.
      const data: ClassificationResult = await response.json();
      setResult(data);
      // Decrementa o contador de consultas restantes após uma classificação bem-sucedida.
      setQueriesLeft(prev => prev - 1); 

    } catch (err: any) {
      // Captura e exibe erros durante a chamada da API.
      setError(err.message || "Ocorreu um erro ao classificar o texto. Tente novamente.");
      console.error(err);
    } finally {
      // Finaliza o estado de carregamento, independentemente do sucesso ou falha.
      setIsLoading(false);
    }
  };

  /**
   * Função para reiniciar a sessão do usuário, resetando o contador de consultas.
   * Útil para permitir que o usuário continue testando após atingir o limite.
   */
  const handleResetSession = () => {
    setQueriesLeft(MAX_QUERIES);
    setError(null);
    setText("");
    setResult(null);
    // Remove o item do localStorage para garantir um reset completo da sessão.
    localStorage.removeItem('classifierQueriesLeft'); 
  };

  // --- Renderização do Componente (JSX) ---

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-800">
      <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8">
        {/* Cabeçalho da Aplicação */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Analisador de Texto com IA
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mt-2">
            Insira um texto e descubra seu sentimento, tonalidade e intenção.
          </p>
        </header>

        {/* Área de Input e Controles */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
            rows={8}
            disabled={isLoading || queriesLeft <= 0} // Desabilita se estiver carregando ou sem consultas
          />
          <div className="flex justify-between items-center mt-4">
            {/* Botão de Classificar */}
            <button
              onClick={handleClassify}
              disabled={isLoading || queriesLeft <= 0} // Desabilita se estiver carregando ou sem consultas
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center mr-2"
            >
              {isLoading ? (
                <>
                  {/* Ícone de Spinner para o estado de carregamento */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando...
                </>
              ) : (
                "Analisar Texto"
              )}
            </button>
            {/* Botão de Reiniciar Sessão */}
            <button
              onClick={handleResetSession}
              className="bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Reiniciar Sessão
            </button>
          </div>
          {/* Exibe o contador de consultas restantes */}
          <p className="text-sm text-gray-600 mt-2 text-right">Consultas restantes: {queriesLeft} de {MAX_QUERIES}</p>
        </div>

        {/* Seção de Erro: aparece se houver uma mensagem de erro */}
        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Seção de Resultado: aparece após a classificação bem-sucedida */}
        {result && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resultado da Análise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {/* Cartão de Sentimento */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg text-blue-800">Sentimento</h3>
                <p className="text-xl text-blue-900">{result.sentimento}</p>
              </div>
              {/* Cartão de Tonalidade */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-lg text-green-800">Tonalidade</h3>
                <p className="text-xl text-green-900">{result.tonalidade}</p>
              </div>
              {/* Cartão de Intenção */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold text-lg text-purple-800">Intenção</h3>
                <p className="text-xl text-purple-900">{result.intencao}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
