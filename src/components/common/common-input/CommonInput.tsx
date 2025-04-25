import React from 'react';
import styles from './CommonInput.module.css'; // Mantenha seus estilos base

interface CommonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  // className é uma prop padrão de HTML, mas explicitamos para uso
  className?: string;
}

const CommonInput: React.FC<CommonInputProps> = ({
  label,
  className, // Capture a className passada (pelo styled-components)
  id, // Garanta que id seja pego para o label htmlFor
  ...props // Restante das props vai para o <input>
}) => {
  // Combine a classe do container do CSS Module com a className externa
  const containerClassName = [
    styles.inputContainer, // Classe base do container do CSS Module
    className, // Classe injetada pelo styled-components
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // Aplica a className combinada à div externa
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id || props.name} className={styles.inputLabel}>
          {label}
        </label>
      )}
      {/* Input mantém sua classe CSS Module e recebe o resto das props */}
      <input id={id || props.name} className={styles.input} {...props} />
    </div>
  );
};

export default CommonInput;