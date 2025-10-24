'use client';

import { useState } from 'react';

interface ClassificationResult {
  sentimento: string;
  tonalidade: string;
  intencao: string;
}

export default function Home() {
  const [text, setText] = useState('Este é um exemplo de texto para classificar. Espero que funcione bem!');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmptyInputError, setShowEmptyInputError] = useState(false);

  const classifyText = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowEmptyInputError(false); // Reset error on new attempt

    if (text.trim() === '') {
      setShowEmptyInputError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido na classificação.');
      }

      const data: ClassificationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao conectar com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Classificador de Texto</h1>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          rows={6}
          placeholder="Digite o texto para classificação..."
          value={text}
          onChange={(e) => { setText(e.target.value); setShowEmptyInputError(false); }}
        ></textarea>

        {showEmptyInputError && (
          <p className="text-red-500 text-sm mb-4">Por favor, digite algum texto para classificar.</p>
        )}

                <div className="flex space-x-4">
                  <button
                    className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={classifyText}
                    disabled={loading || text.trim() === ''}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Classificando...
                      </span>
                    ) : (
                      'Classificar Texto'
                    )}
                  </button>
                  <button
                    className="px-6 bg-gray-300 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setText('');
                      setResult(null);
                      setError(null);
                      setShowEmptyInputError(false);
                    }}
                    disabled={loading}
                  >
                    Limpar
                  </button>
                </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold">Erro:</p>
              <p>{error}</p>
            </div>
            <button
              className="ml-4 px-2 py-1 text-sm bg-red-200 rounded-md hover:bg-red-300 transition duration-300"
              onClick={() => setError(null)}
            >
              X
            </button>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-semibold mb-2">Resultado da Classificação:</h2>
            <p><strong>Sentimento:</strong> {result.sentimento}</p>
            <p><strong>Tonalidade:</strong> {result.tonalidade}</p>
            <p><strong>Intenção:</strong> {result.intencao}</p>
          </div>
        )}
      </div>
    </div>
  );
}