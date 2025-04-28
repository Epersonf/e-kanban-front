import React from 'react';
import { StyledForm } from './From.styles';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form: React.FC<FormProps> = ({ children, ...props }) => (
  <StyledForm {...props}>{children}</StyledForm>
);

export default Form;
