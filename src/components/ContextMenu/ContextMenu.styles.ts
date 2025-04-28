// src/components/common/ContextMenu/ContextMenu.styles.ts
import styled, { css } from 'styled-components';

// Interface para props do item de menu que afetam o estilo
interface MenuItemStyleProps {
  isDestructive?: boolean;
  disabled?: boolean;
}

// Container principal do menu
// Recebe top/left para posicionamento absoluto
export const MenuWrapper = styled.div<{ top: number; left: number }>`
  position: fixed; // Usar fixed para posicionar relativo à viewport
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  background: ${props => props.theme.palette.background.paper};
  border-radius: ${props => props.theme.shape.borderRadius};
  box-shadow: ${props => props.theme.shadows[2]}; // Sombra de menu/dropdown
  padding: ${props => props.theme.spacing(0.5)}px 0; // Espaçamento vertical interno (4px)
  min-width: 180px;
  max-width: 280px;
  z-index: 1100; // Z-index alto para menus de contexto
  overflow: hidden; // Garante que itens respeitem o border-radius
`;

// Botão que representa cada item do menu
// Usa a interface para tipar as props que afetam o estilo
export const MenuItemButton = styled.button<MenuItemStyleProps>`
  /* Reset e Estilos Base */
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;

  /* Estilos do Tema */
  padding: ${props => props.theme.spacing(0.75)}px ${props => props.theme.spacing(1.5)}px; /* 6px 12px */
  font-size: ${props => props.theme.typography.body1.fontSize}; // 14px
  font-family: ${props => props.theme.typography.fontFamily};
  color: ${props => props.theme.palette.text.primary};

  /* Estilo Hover (apenas se não desabilitado) */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.palette.action.hover};
  }

  /* Estilo Desabilitado */
  ${props =>
    props.disabled &&
    css`
      color: ${props.theme.palette.text.disabled};
      cursor: not-allowed;
      background-color: transparent !important; // Garante que não haja fundo no hover
    `}

  /* Estilo Destrutivo (ex: Excluir) */
  ${props =>
    props.isDestructive && !props.disabled && // Só aplica se não estiver desabilitado
    css`
      color: ${props.theme.palette.error.main};

      &:hover:not(:disabled) {
        background-color: ${props.theme.palette.error.main}15; // Fundo vermelho claro no hover
        color: ${props.theme.palette.error.dark}; // Texto vermelho escuro no hover
      }
    `}

    /* Estilo de foco (simples) */
    &:focus {
        outline: none;
        background-color: ${props => props.theme.palette.action.selected}; // Um pouco mais escuro que o hover
    }

    /* Espaçamento para ícone (se houver) */
    > svg {
        margin-right: ${props => props.theme.spacing(1)}px; // 8px
        flex-shrink: 0; // Impede que o ícone encolha
        /* Cor do ícone pode herdar ou ser definida */
        /* color: ${props => props.theme.palette.text.secondary}; */
    }
`;

// Divisor opcional entre itens de menu
export const MenuDivider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.palette.border.main};
  margin: ${props => props.theme.spacing(0.5)}px 0; // 4px de margem vertical
`;