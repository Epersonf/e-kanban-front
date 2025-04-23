import React from 'react';
import styles from './CommonInput.module.css';

interface CommonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const CommonInput: React.FC<CommonInputProps> = ({ label, ...props }) => {
  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <input className={styles.input} {...props} />
    </div>
  );
};

export default CommonInput;