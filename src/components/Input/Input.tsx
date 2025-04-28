import React from 'react';
import { StyledInput } from './Input.styles';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => (
  <StyledInput {...props} />
);

export default Input;
