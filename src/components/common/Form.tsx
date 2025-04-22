import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form: React.FC<FormProps> = ({ children, ...props }) => (
  <form {...props} style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 320, boxShadow: '0 2px 8px #0003', display: 'flex', flexDirection: 'column', gap: 12, ...props.style }}>
    {children}
  </form>
);

export default Form;
