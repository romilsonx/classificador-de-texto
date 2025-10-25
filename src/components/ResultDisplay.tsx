import React from 'react';
import { ClassificationItem } from './ClassificationItem';

// --- Tipos ---

interface ClassificationResultData {
  sentimento: string;
  tonalidade: string;
  intencao: string;
}

// --- Props do Componente ---

interface ResultDisplayProps {
  /** O objeto de resultado da classificação. Se for nulo, o componente não renderiza nada. */
  result: ClassificationResultData | null;
}

/**
 * Componente que exibe a seção de resultados da classificação.
 * Renderiza um título e uma lista de itens de classificação.
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null; // Não renderiza nada se não houver resultado

  return (
    <div className="mt-6 transition-all duration-300 ease-in-out">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Resultado da Classificação:</h2>
      <div className="space-y-3">
        <ClassificationItem category="sentimento" value={result.sentimento} />
        <ClassificationItem category="tonalidade" value={result.tonalidade} />
        <ClassificationItem category="intencao" value={result.intencao} />
      </div>
    </div>
  );
};
