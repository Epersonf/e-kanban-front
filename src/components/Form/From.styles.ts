import styled from 'styled-components'; // Importar styled

// --- Definição do Styled Component ---
// Criamos um componente estilizado baseado na tag <form>
export const StyledForm = styled.form`
  /* Aplicando estilos do tema Trello */
  background: ${props => props.theme.palette.primary.dark};
  /* Usando o borderRadius do tema (3px) - o inline era 8px */
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: ${props => props.theme.spacing(3)}px; /* 24px */
  min-width: 320px; /* Mantido o min-width */
  /* Usando uma sombra do tema (ex: a segunda sombra) */
  box-shadow: ${props => props.theme.shadows[2]};
  display: flex;
  flex-direction: column;
  /* Usando espaçamento do tema para o gap (era 12px) */
  gap: ${props => props.theme.spacing(1.5)}px;
`;