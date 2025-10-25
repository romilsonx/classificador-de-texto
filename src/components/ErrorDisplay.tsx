import React from 'react';

// --- Props do Componente ---

interface ErrorDisplayProps {
  /** A mensagem de erro a ser exibida. Se for nula, o componente não renderiza nada. */
  message: string | null;
  /** Função para limpar a mensagem de erro. */
  onClear: () => void;
}

/**
 * Componente para exibir uma mensagem de erro em um cartão.
 * Inclui um botão para dispensar a mensagem.
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClear }) => {
  if (!message) return null; // Não renderiza nada se não houver erro

  return (
    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
      <div>
        <p className="font-semibold">Erro:</p>
        <p>{message}</p>
      </div>
      <button
        className="ml-4 px-2 py-1 text-sm bg-red-200 rounded-md hover:bg-red-300 transition duration-300"
        onClick={onClear}
      >
        X
      </button>
    </div>
  );
};
