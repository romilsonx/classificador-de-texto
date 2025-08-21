"use client";

import { useState, useEffect } from "react";

// Definição da estrutura do resultado da classificação
type ClassificationResult = {
  sentimento: string;
  tonalidade: string;
  intencao: string;
};

const MAX_QUERIES = 5; // Limite de consultas por sessão

export default function HomePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queriesLeft, setQueriesLeft] = useState(MAX_QUERIES);

  // Carrega o contador do localStorage ao iniciar
  useEffect(() => {
    const storedQueries = localStorage.getItem('classifierQueriesLeft');
    if (storedQueries) {
      setQueriesLeft(parseInt(storedQueries, 10));
    }
  }, []);

  // Salva o contador no localStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem('classifierQueriesLeft', queriesLeft.toString());
  }, [queriesLeft]);

  const handleClassify = async () => {
    if (queriesLeft <= 0) {
      setError("Limite de 5 consultas por sessão atingido. Por favor, reinicie a sessão.");
      return;
    }

    if (!text.trim()) {
      setError("Por favor, insira um texto para classificar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`A resposta da API não foi bem-sucedida: ${response.statusText}`);
      }

      const data: ClassificationResult = await response.json();
      setResult(data);
      setQueriesLeft(prev => prev - 1); // Decrementa o contador

    } catch (err) {
      setError("Ocorreu um erro ao classificar o texto. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setQueriesLeft(MAX_QUERIES);
    setError(null);
    setText("");
    setResult(null);
    localStorage.removeItem('classifierQueriesLeft'); // Opcional: remove do localStorage para garantir reset completo
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-800">
      <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Analisador de Texto com IA
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mt-2">
            Insira um texto e descubra seu sentimento, tonalidade e intenção.
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
            rows={8}
            disabled={isLoading || queriesLeft <= 0}
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleClassify}
              disabled={isLoading || queriesLeft <= 0}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center mr-2"
            >
              {isLoading ? (
                <>
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
            <button
              onClick={handleResetSession}
              className="bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Reiniciar Sessão
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-right">Consultas restantes: {queriesLeft} de {MAX_QUERIES}</p>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resultado da Análise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-lg text-blue-800">Sentimento</h3>
                <p className="text-xl text-blue-900">{result.sentimento}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-lg text-green-800">Tonalidade</h3>
                <p className="text-xl text-green-900">{result.tonalidade}</p>
              </div>
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

// Adicionando a animação de fade-in no CSS global
// É necessário adicionar isso em `src/app/globals.css`
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 1s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
*/