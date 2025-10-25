import React from 'react';
import { Smile, Frown, Meh, Briefcase, MessageCircle, Building, User, ShoppingCart, Info, Type } from 'lucide-react';

// --- Tipos e Configurações de Estilo ---

// Define as categorias de classificação possíveis.
export type ClassificationCategory = 'sentimento' | 'tonalidade' | 'intencao';

/**
 * Objeto de configuração para os estilos de cada categoria de classificação.
 * Mapeia cada valor possível a um ícone da biblioteca lucide-react e a classes de estilo do Tailwind CSS.
 */
const classificationStyles: Record<ClassificationCategory, Record<string, { icon: React.ElementType; className: string }>> = {
  sentimento: {
    Positivo: { icon: Smile, className: 'bg-green-100 text-green-800' },
    Negativo: { icon: Frown, className: 'bg-red-100 text-red-800' },
    Neutro: { icon: Meh, className: 'bg-gray-100 text-gray-800' },
  },
  tonalidade: {
    Formal: { icon: Briefcase, className: 'bg-blue-100 text-blue-800' },
    Informal: { icon: MessageCircle, className: 'bg-purple-100 text-purple-800' },
  },
  intencao: {
    Profissional: { icon: Building, className: 'bg-indigo-100 text-indigo-800' },
    Pessoal: { icon: User, className: 'bg-teal-100 text-teal-800' },
    Transacional: { icon: ShoppingCart, className: 'bg-orange-100 text-orange-800' },
    Informativo: { icon: Info, className: 'bg-sky-100 text-sky-800' },
  },
};

// --- Props do Componente ---

interface ClassificationItemProps {
  /** A categoria da classificação (ex: 'sentimento'). */
  category: ClassificationCategory;
  /** O valor classificado pelo modelo (ex: 'Positivo'). */
  value: string;
}

// --- Componente de Item de Classificação ---

/**
 * Um componente de UI que exibe um único item do resultado da classificação.
 * Ele renderiza um cartão com um ícone, título e valor, estilizado de acordo com a categoria e o valor.
 */
export const ClassificationItem: React.FC<ClassificationItemProps> = ({ category, value }) => {
  // Busca o estilo correspondente ou usa um estilo padrão caso o valor não seja encontrado.
  const styles = classificationStyles[category]?.[value] || { icon: Type, className: 'bg-gray-100 text-gray-800' };
  const Icon = styles.icon;

  // Formata o título da categoria (ex: 'sentimento' -> 'Sentimento').
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className={`flex items-center p-3 rounded-lg ${styles.className}`}>
      <Icon className="h-6 w-6 mr-3" />
      <div className="flex-grow">
        <p className="text-sm font-medium opacity-75">{categoryTitle}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};
