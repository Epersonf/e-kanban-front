import styled, { css } from 'styled-components';
// Importe os componentes COMUNS MODIFICADOS
import CommonInput from '../../components/common/common-input/CommonInput';
import CommonButton from '../../components/common/common-button/CommonButton';

// ADICIONE 'export' AQUI
export const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => `${theme.spacing(2)}px`};
  background-color: ${({ theme }) => theme.palette.background.default};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

// ADICIONE 'export' AQUI
export const Title = styled.h1`
  ${({ theme }) => theme.typography.h5}; // Usando estilo de tipografia do tema
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => `${theme.spacing(3)}px`}; // 24px
  text-align: center;
`;

// ADICIONE 'export' AQUI
export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; // Um pouco maior, mais comum
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: ${({ theme }) => `${theme.spacing(4)}px`}; // 32px
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows[2]}; // Usando sombra do tema
`;

// ADICIONE 'export' AQUI
export const InputGroup = styled.div`
  margin-bottom: ${({ theme }) => `${theme.spacing(2)}px`}; // 16px

  label {
    display: block; // Garante que a label fique acima
    ${({ theme }) => theme.typography.caption}; // Estilo de legenda para label
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-bottom: ${({ theme }) => `${theme.spacing(0.5)}px`}; // 4px
  }
`;

// Este já estava correto
export const StyledInput = styled(CommonInput)`
  /* Os estilos aqui serão aplicados à DIV externa (styles.inputContainer) */
  margin: 0;
  padding: 0;

  input {
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing(1.5)}px ${theme.spacing(1.75)}px`};
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    line-height: ${({ theme }) => theme.typography.body1.lineHeight};
    color: ${({ theme }) => theme.palette.text.primary};
    background-color: ${({ theme }) => theme.palette.background.paper};
    border: 1px solid ${({ theme }) => theme.palette.border.main};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    box-sizing: border-box;

    &::placeholder {
      color: ${({ theme }) => theme.palette.text.disabled};
      opacity: 1;
    }

    &:hover {
      border-color: ${({ theme }) => theme.palette.text.primary};
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.palette.primary.main};
      box-shadow: 0 0 0 1px ${({ theme }) => theme.palette.primary.main};
    }

    &[aria-invalid='true'] {
      border-color: ${({ theme }) => theme.palette.error.main};
      &:focus {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.palette.error.main};
      }
    }
  }

  label {
     /* Estilos para label se necessário sobrescrever CommonInput */
  }
`;

// Interface para tipar as props do StyledButton
interface StyledButtonProps {
  variant?: string;
}

// Este já estava correto
export const StyledButton = styled(CommonButton)<StyledButtonProps>`
  font-size: ${({ theme }) => theme.typography.button.fontSize};
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  line-height: ${({ theme }) => theme.typography.button.lineHeight};
  text-transform: ${({ theme }) => theme.typography.button.textTransform as any};
  padding: ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  margin-top: ${({ theme }) => `${theme.spacing(1)}px`};
  border: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.palette.primary.main}40;
  }

  &:active {
      box-shadow: ${({ theme }) => theme.shadows[1]};
  }

  &[type="submit"] {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    box-shadow: ${({ theme }) => theme.shadows[1]};

    &:hover {
      background-color: ${({ theme }) => theme.palette.primary.main}E0;
      box-shadow: ${({ theme }) => theme.shadows[2]};
    }

    &:disabled {
       background-color: ${({ theme }) => theme.palette.text.disabled}40;
       color: ${({ theme }) => theme.palette.text.disabled};
       box-shadow: none;
       cursor: not-allowed;
    }
  }

  ${({ variant, theme }) =>
    variant === 'secondary' &&
    css`
      background-color: transparent;
      color: ${theme.palette.primary.main};
      border: 1px solid ${theme.palette.primary.main}80;

      &:hover {
        background-color: ${theme.palette.primary.main}10;
        border-color: ${theme.palette.primary.main};
      }

       &:disabled {
         color: ${theme.palette.text.disabled};
         border-color: ${theme.palette.text.disabled}80;
         background-color: transparent;
         cursor: not-allowed;
       }
    `}
`;

// ADICIONE 'export' AQUI
export const MessageParagraph = styled.p<{ $isError?: boolean }>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme, $isError: isError }) => isError ? theme.palette.error.main : theme.palette.text.secondary};
  margin-top: ${({ theme }) => `${theme.spacing(2)}px`}; // 16px
  text-align: center;
  min-height: ${({ theme }) => theme.typography.body2.lineHeight}em; // Reserva espaço
`;

// ADICIONE 'export' AQUI
export const LoadingSpinner = styled.div` // Um spinner simples para exemplo
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border-left-color: ${({ theme }) => theme.palette.primary.main};
  margin: ${({ theme }) => `${theme.spacing(2)}px`} auto 0; // Centraliza

  animation: spin 1s ease infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;