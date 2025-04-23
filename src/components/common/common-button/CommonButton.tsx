import React from 'react';
import styles from './CommonButton.module.css';

interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const buttonClass = `${styles.button} ${styles[variant]}`;
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default CommonButton;