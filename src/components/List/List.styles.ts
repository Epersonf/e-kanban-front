import styled from 'styled-components';

// --- Styled Components Definition ---

// Container principal da lista (coluna)
export const ListWrapper = styled.div`
  background-color: ${props => props.theme.palette.background.default}; /* Cinza claro do tema */
  border-radius: ${props => props.theme.shape.borderRadius}; /* 4px do tema */
  width: 280px; /* Largura fixa para a coluna */
  margin: 0 ${props => props.theme.spacing(1)}px; /* Espaçamento horizontal entre listas (8px) */
  display: flex;
  flex-direction: column;
  /* Garante que a lista não encolha em um container flex row */
  flex-shrink: 0;
  /* Altura máxima para permitir scroll interno se necessário */
  max-height: 100%;
  /* Sombra sutil */
  box-shadow: ${props => props.theme.shadows[1]};
`;

// Cabeçalho da lista (contém título e botão delete)
export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1.5)}px; /* 8px 12px */
  border-bottom: 1px solid ${props => props.theme.palette.border.main}; /* Linha divisória sutil */
`;

// Estilo base para o título e o input para consistência
const titleBaseStyles = (theme: any) => `
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.h5.fontSize}; /* 1.5rem */
  font-weight: ${theme.typography.h5.fontWeight}; /* 500 */
  color: ${theme.palette.text.primary};
  margin: 0;
  padding: ${theme.spacing(0.5)}px ${theme.spacing(0.75)}px; /* Espaçamento interno (4px 6px) */
  flex-grow: 1; /* Para ocupar espaço */
  border: 1px solid transparent; /* Para manter o layout ao trocar para input */
  border-radius: ${theme.shape.borderRadius};
`;

// Título da Lista (h3)
export const ListTitle = styled.h3<{ onClick?: () => void }>`
  ${props => titleBaseStyles(props.theme)}
  cursor: pointer;
  /* Adiciona um leve feedback visual no hover */
  &:hover {
    background-color: ${props => props.theme.palette.action?.hover ?? '#0000000f'};
  }
`;

// Input para edição do título
export const ListTitleInput = styled.input`
  ${props => titleBaseStyles(props.theme)}
  box-sizing: border-box; /* Garante que padding/border não aumentem o tamanho */
  border: 1px solid ${props => props.theme.palette.primary.main}; /* Borda visível durante edição */
  outline: none;
  width: 100%; /* Ocupar todo o espaço disponível no header */
  background-color: ${props => props.theme.palette.background.paper};
`;

// Botão para deletar a lista inteira
export const DeleteListButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.palette.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing(0.5)}px; /* 4px */
  margin-left: ${props => props.theme.spacing(1)}px; /* 8px */
  font-size: 1.2rem; /* Tamanho do ícone '✕' */
  line-height: 1;
  border-radius: ${props => props.theme.shape.borderRadius};

  &:hover {
    color: ${props => props.theme.palette.error.main};
    background-color: ${props => props.theme.palette.action?.hover ?? '#0000000f'};
  }
`;

// Área onde os cards são renderizados e podem ser soltos (Droppable)
// Recebe uma prop 'isDraggingOver' para mudar o background
export const CardDropArea = styled.div<{ $isDraggingOver: boolean }>`
  padding: 0 ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1)}px; /* 0 8px 8px */
  min-height: 50px;
  /* Cor de fundo muda quando um card está sendo arrastado sobre a área */
  background-color: ${props =>
    props.$isDraggingOver
      ? props.theme.palette.action?.selected ?? '#e0f2f7' /* Azul claro ou cor de seleção do tema */
      : 'transparent'};
  transition: background-color 0.2s ease;
  border-bottom-left-radius: ${props => props.theme.shape.borderRadius}; /* Para arredondar cantos inferiores */
  border-bottom-right-radius: ${props => props.theme.shape.borderRadius};
  flex-grow: 1; /* Ocupa o espaço restante na coluna */
  overflow-y: auto; /* Adiciona scroll se a lista de cards for muito grande */
`;