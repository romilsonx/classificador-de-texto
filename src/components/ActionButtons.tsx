import React from 'react';
import { Loader2 } from 'lucide-react'; // Ícone de carregamento

// --- Props do Componente ---

interface ActionButtonsProps {
  /** Flag que indica se a aplicação está em estado de carregamento. */
  isLoading: boolean;
  /** Flag que indica se a área de texto está vazia. */
  isTextEmpty: boolean;
  /** Função a ser chamada ao clicar no botão 'Classificar'. */
  onClassify: () => void;
  /** Função a ser chamada ao clicar no botão 'Limpar'. */
  onClear: () => void;
}

/**
 * Renderiza os botões de ação principais: "Classificar" e "Limpar".
 * Gerencia os estados de carregamento e desabilitado.
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({ isLoading, isTextEmpty, onClassify, onClear }) => {
  return (
    <div className="flex space-x-4">
      <button
        className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClassify}
        disabled={isLoading || isTextEmpty}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Classificando...
          </span>
        ) : (
          'Classificar Texto'
        )}
      </button>
      <button
        className="px-6 bg-gray-300 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClear}
        disabled={isLoading}
      >
        Limpar
      </button>
    </div>
  );
};
