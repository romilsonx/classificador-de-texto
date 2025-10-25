import React from 'react';

// --- Tipos e Dados ---

const examples = [
  {
    label: 'Profissional',
    text: 'Prezados, gostaria de agendar uma reunião para discutir os resultados do último trimestre. Fico à disposição para alinharmos um horário.',
  },
  {
    label: 'Informal',
    text: 'E aí, tudo certo? Bora marcar aquele café semana que vem? Me avisa!',
  },
  {
    label: 'Reclamação',
    text: 'Recebi o produto com defeito. Exijo um reembolso imediato ou a troca do item. Aguardo uma solução urgente.',
  },
];

// --- Props do Componente ---

interface ExamplePickerProps {
  /** Função a ser chamada quando um botão de exemplo é clicado. */
  onExampleClick: (text: string) => void;
}

/**
 * Componente que renderiza uma seleção de botões de exemplo.
 * Permite que o usuário preencha rapidamente a área de texto com exemplos pré-definidos.
 */
export const ExamplePicker: React.FC<ExamplePickerProps> = ({ onExampleClick }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Experimente com um exemplo:</h2>
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example.label}
            onClick={() => onExampleClick(example.text)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
};
