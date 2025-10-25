import React from 'react';

// --- Props do Componente ---

interface TextInputProps {
  /** O valor atual da área de texto. */
  value: string;
  /** Função chamada quando o valor da área de texto muda. */
  onChange: (value: string) => void;
  /** Flag que indica se o campo está em estado de carregamento. */
  isLoading: boolean;
}

/**
 * Componente de área de texto para a entrada do usuário.
 */
export const TextInput: React.FC<TextInputProps> = ({ value, onChange, isLoading }) => {
  return (
    <textarea
      className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black disabled:bg-gray-100"
      rows={6}
      placeholder="Digite o texto para classificação..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading} // Desabilita a área de texto durante o carregamento
    />
  );
};
