import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => (
  <input
    {...props}
    style={{
      padding: 8,
      borderRadius: 4,
      border: '1px solid #ccc',
      ...props.style
    }}
  />
);

export default Input;
