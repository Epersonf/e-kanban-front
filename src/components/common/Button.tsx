import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', style, ...props }) => {
  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 4,
    padding: '6px 12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    ...style
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? { background: '#5aac44', color: '#fff' }
      : { background: '#eee', color: '#026aa7' };

  return <button {...props} style={{ ...baseStyle, ...variantStyle }} />;
};

export default Button;
