import React from 'react';

// --- Props do Componente ---

interface ClassifierCardProps {
  /** O conteúdo a ser renderizado dentro do cartão. */
  children: React.ReactNode;
}

/**
 * Componente de "cartão" que serve como o contêiner principal para a interface de classificação.
 * Ele fornece a estrutura de fundo branco, preenchimento e sombra.
 */
export const ClassifierCard: React.FC<ClassifierCardProps> = ({ children }) => {
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      {children}
    </div>
  );
};
