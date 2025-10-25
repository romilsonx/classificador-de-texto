/*
 * =====================================================================================
 *   Página Principal (Home)
 * =====================================================================================
 *
 *   Este é o componente principal da página, atuando como o "orquestrador" da aplicação.
 *   
 *   Responsabilidades:
 *   1. Gerenciamento de Estado: Mantém todo o estado da aplicação, como o texto de entrada,
 *      o resultado da classificação, o estado de carregamento e os erros.
 *   2. Lógica de Negócio: Contém a função `classifyText` que se comunica com a API de backend.
 *   3. Composição da UI: Monta a interface do usuário combinando os componentes modulares
 *      da pasta `src/components`.
 *
 *   A componentização permite que este arquivo seja focado na lógica e no fluxo de dados,
 *   enquanto os detalhes de apresentação são delegados aos componentes filhos.
 *
 * =====================================================================================
 */

'use client';

import { useState } from 'react';

// Importação dos componentes de UI modulares
import { Header } from '@/components/Header';
import { ClassifierCard } from '@/components/ClassifierCard';
import { ExamplePicker } from '@/components/ExamplePicker';
import { TextInput } from '@/components/TextInput';
import { ActionButtons } from '@/components/ActionButtons';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ResultDisplay } from '@/components/ResultDisplay';

// --- Tipos ---

interface ClassificationResult {
  sentimento: string;
  tonalidade: string;
  intencao: string;
}

// --- Componente Principal da Página ---

export default function Home() {
  // --- Gerenciamento de Estado ---
  const [text, setText] = useState('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmptyInputError, setShowEmptyInputError] = useState(false);

  // --- Handlers de Eventos e Lógica ---

  /**
   * Define o texto da área de texto com um exemplo e limpa o estado anterior.
   */
  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
    setResult(null);
    setError(null);
    setShowEmptyInputError(false);
  };

  /**
   * Limpa a área de texto e todos os estados relacionados.
   */
  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
    setShowEmptyInputError(false);
  };

  /**
   * Envia o texto para a API de backend para classificação.
   */
  const classifyText = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowEmptyInputError(false);

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

  // --- Renderização da UI ---

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 font-sans">
      <Header />

      <ClassifierCard>
        <ExamplePicker onExampleClick={handleExampleClick} />
        
        <TextInput 
          value={text} 
          onChange={(value) => { setText(value); setShowEmptyInputError(false); }} 
          isLoading={loading} 
        />

        {showEmptyInputError && (
          <p className="text-red-500 text-sm mb-4">Por favor, digite algum texto para classificar.</p>
        )}

        <ActionButtons 
          isLoading={loading}
          isTextEmpty={text.trim() === ''}
          onClassify={classifyText}
          onClear={handleClear}
        />
      </ClassifierCard>

      <ErrorDisplay message={error} onClear={() => setError(null)} />

      {/* O ResultDisplay só será renderizado se houver um resultado */}
      {result && (
        <div className="w-full max-w-md mt-6">
          <ResultDisplay result={result} />
        </div>
      )}
    </main>
  );
}
