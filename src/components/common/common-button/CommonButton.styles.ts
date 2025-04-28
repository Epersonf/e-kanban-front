import { css, styled } from "styled-components";
import { CommonButtonProps } from "./CommonButton";

export const StyledButton = styled.button<CommonButtonProps>`
  /* Reset básico e estilos comuns */
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease, color 0.2s ease-in-out, border-color 0.2s ease;

  /* Estilos baseados na tipografia e forma do tema Trello */
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.button.fontSize};
  font-weight: ${props => props.theme.typography.button.fontWeight};
  line-height: ${props => props.theme.typography.button.lineHeight};
  text-transform: ${props => props.theme.typography.button.textTransform}; // 'none'
  border-radius: ${props => props.theme.shape.borderRadius}; // 3px
  padding: ${props => props.theme.spacing(0.75)}px ${props => props.theme.spacing(1.5)}px; /* 6px 12px */

  /* --- Estilos Variantes --- */

  /* Padrão (Primary - Azul Trello) */
  background-color: ${props => props.theme.palette.primary.main};
  color: ${props => props.theme.palette.primary.contrastText};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.palette.primary.dark};
  }
   &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.palette.primary.main}60;
  }


  /* Variante Secundária (Fundo claro, texto escuro) */
  ${props =>
    props.$variant === 'secondary' &&
    css`
      background-color: ${props.theme.palette.action.hover};
      color: ${props.theme.palette.text.primary};

      &:hover:not(:disabled) {
        background-color: ${props.theme.palette.action.selected};
      }
      &:focus {
         box-shadow: 0 0 0 3px ${props.theme.palette.text.secondary}60;
      }
    `}

  /* Variante Accent (usando a cor secundária do tema - Rosa Material) */
  /* Se quiser outra cor (ex: error, success, warning), ajuste aqui */
  ${props =>
    props.$variant === 'accent' &&
    css`
      background-color: ${props.theme.palette.secondary.main}; /* Cor 'secondary' do tema */
      color: ${props.theme.palette.secondary.contrastText};

      &:hover:not(:disabled) {
        /* Gerar um tom mais escuro para o hover do accent */
        /* Exemplo: filter: brightness(90%); ou definir secondary.dark no tema */
        filter: brightness(90%);
      }
      &:focus {
         box-shadow: 0 0 0 3px ${props.theme.palette.secondary.main}60;
      }
    `}


  /* --- Estilos Desabilitados --- */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    box-shadow: none;
     /* Resetar filtro de brilho se aplicado no hover */
     filter: none;
  }
`;
