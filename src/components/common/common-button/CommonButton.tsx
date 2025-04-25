import React from 'react';
import styles from './CommonButton.module.css'; // Mantenha seus estilos base

interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
  // className é adicionado implicitamente pelas ButtonHTMLAttributes,
  // mas vamos ser explícitos para clareza e para usá-lo.
  className?: string;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  variant = 'primary',
  children,
  className, // Capture a className passada (pelo styled-components)
  ...props
}) => {
  // Combine as classes base dos CSS Modules com a className externa
  // A className externa (de styled-components) vem por último para maior especificidade, se necessário.
  const combinedClassName = [
    styles.button, // Classe base do CSS Module
    styles[variant], // Classe de variante do CSS Module
    className, // Classe injetada pelo styled-components
  ]
    .filter(Boolean) // Remove quaisquer classes undefined/null/vazias
    .join(' ');

  return (
    // Aplique a classe combinada e repasse outras props
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default CommonButton;