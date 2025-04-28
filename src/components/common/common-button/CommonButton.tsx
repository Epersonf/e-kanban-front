import React from 'react';
import { StyledButton } from './CommonButton.styles';

export interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  $variant: variant = 'primary',
  children,
  ...props
}) => {
  return (
    <StyledButton $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default CommonButton;