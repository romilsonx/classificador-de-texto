import React from 'react';

/**
 * Componente de cabeçalho simples para a aplicação.
 * Exibe o título principal da página.
 */
export const Header: React.FC = () => {
  return (
    <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
      Classificador de Texto com IA
    </h1>
  );
};
