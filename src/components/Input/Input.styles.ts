import styled from 'styled-components';

export const StyledInput = styled.input`
  /* Estilos base do tema Trello */
  width: 100%; /* Ocupa toda a largura disponível por padrão */
  padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1.5)}px; /* 8px 12px (ajustado para ser igual ao textarea/modal anterior) */
  border-radius: ${props => props.theme.shape.borderRadius}; /* 3px (do tema) */
  border: 1px solid ${props => props.theme.palette.border.main}; /* Cinza claro do tema ('#dfe1e6') */
  background: ${props => props.theme.palette.background.paper}; /* Fundo branco */
  color: ${props => props.theme.palette.text.primary}; /* Cor de texto principal */
  font-size: ${props => props.theme.typography.body1.fontSize}; /* 14px (do tema) */
  font-family: ${props => props.theme.typography.fontFamily}; /* Fonte do tema */
  box-sizing: border-box; /* Garante padding/border corretos */
  transition: border-color 0.2s ease, box-shadow 0.2s ease; /* Transição suave no foco */

  /* Estilos de Foco */
  &:focus {
    outline: none; /* Remove o outline padrão */
    border-color: ${props => props.theme.palette.primary.main}; /* Muda a cor da borda para o azul primário */
    /* Adiciona um anel de foco (box-shadow) */
    box-shadow: 0 0 0 2px ${props => props.theme.palette.primary.main}40; /* Azul primário com 25% de opacidade */
  }

  /* Estilo do Placeholder */
  &::placeholder {
    color: ${props => props.theme.palette.text.subtle ?? props.theme.palette.text.disabled}; /* Cor de texto sutil/desabilitada */
  }

  /* Estilos quando desabilitado (opcional, mas bom ter) */
  &:disabled {
    cursor: not-allowed;
    background-color: ${props => props.theme.palette.action.disabledBackground};
    color: ${props => props.theme.palette.text.disabled};
    border-color: transparent; // Ou manter a cor de borda padrão?
    box-shadow: none;
  }
`;