import styled from 'styled-components';

// --- Modal Base ---

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Usando uma cor escura com transparência, ajuste se necessário */
  background: rgba(9, 30, 66, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // Rever z-index se tiver outros modais/elementos
  font-family: ${props => props.theme.typography.fontFamily};
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.palette.background.default}; /* '#f4f5f7' - Fundo cinza claro */
  border-radius: ${props => props.theme.shape.borderRadius}; /* 3px ou 4px do tema */
  padding: ${props => props.theme.spacing(3)}px; /* 24px */
  min-width: 450px;
  max-width: 600px;
  color: ${props => props.theme.palette.text.primary}; /* '#172b4d' - Cor principal do texto */
  /* Usar uma sombra do tema ou definir uma específica para modais */
  box-shadow: ${props => props.theme.shadows[2] ?? '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.08)'};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(2)}px; /* 16px - Espaçamento entre seções */
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(1)}px; /* 8px */
`;

export const ModalTitle = styled.h2`
  margin: 0;
  /* Usar um estilo de tipografia do tema */
  font-size: ${props => props.theme.typography.h5?.fontSize ?? '20px'};
  font-weight: ${props => props.theme.typography.h5?.fontWeight ?? 600};
  color: ${props => props.theme.palette.text.primary};
  /* Evitar que o título empurre o botão de fechar */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: ${props => props.theme.spacing(1)}px; /* Espaço para não colar no botão */
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.palette.text.secondary}; /* '#6b778c' - Cinza secundário */
  font-size: 24px;
  cursor: pointer;
  padding: ${props => props.theme.spacing(0.5)}px; /* 4px */
  line-height: 1;
  border-radius: 50%; /* Para um fundo de hover circular */
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;

  &:hover {
    color: ${props => props.theme.palette.text.primary};
    background-color: ${props => props.theme.palette.action?.hover ?? 'rgba(0,0,0,0.08)'};
  }
`;


// --- Formulário e Campos ---

export const FieldWrapper = styled.div`
  /* Apenas um container, pode não precisar de estilos */
`;

export const FieldLabel = styled.label`
  font-weight: 600;
  font-size: 12px;
  color: ${props => props.theme.palette.text.secondary}; /* '#5e6c84' - Outro tom de cinza */
  display: block;
  margin-bottom: ${props => props.theme.spacing(0.5)}px; /* 4px */
`;

// Estilo base para input e textarea
const inputBaseStyles = (theme: any) => `
  width: 100%;
  padding: ${theme.spacing(1)}px ${theme.spacing(1.5)}px; /* 8px 12px */
  border-radius: ${theme.shape.borderRadius}; /* 3px ou 4px */
  border: 1px solid ${theme.palette.divider}; /* '#dfe1e6' - Cinza da borda */
  background: ${theme.palette.background.paper}; /* '#fff' */
  color: ${theme.palette.text.primary};
  font-size: ${theme.typography.body1?.fontSize ?? '14px'};
  font-family: ${theme.typography.fontFamily};
  box-sizing: border-box; /* Importante! */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.palette.primary.main};
    box-shadow: 0 0 0 2px ${theme.palette.primary.main}40; /* Anel de foco com alpha */
  }

  &::placeholder {
    color: ${theme.palette.text.disabled};
  }
`;

export const StyledInput = styled.input`
  ${props => inputBaseStyles(props.theme)}
`;

export const StyledTextArea = styled.textarea`
  ${props => inputBaseStyles(props.theme)}
  resize: vertical;
  min-height: 80px; /* Altura mínima para textarea */
`;


// --- Seção de Proprietários (Owners) ---

export const OwnersSection = styled.div`
  /* Container para a seção de proprietários */
`;

export const SelectedOwnersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing(1)}px; /* 8px */
  margin-bottom: ${props => props.theme.spacing(1.5)}px; /* 12px */
`;

export const OwnerBadge = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.palette.border.main}; /* '#dfe1e6' */
  border-radius: ${props => props.theme.shape.borderRadius}; /* 3px ou 4px */
  padding: ${props => props.theme.spacing(0.5)}px ${props => props.theme.spacing(1)}px; /* 4px 8px */
`;

export const OwnerAvatar = styled.img<{ size?: number }>`
  width: ${props => props.size || 20}px;
  height: ${props => props.size || 20}px;
  border-radius: 50%;
  margin-right: ${props => props.theme.spacing(0.75)}px; /* 6px */
  display: block; // Evita espaço extra abaixo da imagem
`;

export const OwnerName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.palette.text.primary};
`;

export const RemoveOwnerButton = styled.button`
  margin-left: ${props => props.theme.spacing(0.75)}px; /* 6px */
  background: none;
  border: none;
  color: ${props => props.theme.palette.text.secondary}; /* '#6b778c' */
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${props => props.theme.palette.error.main};
  }
`;

export const OwnerSelectList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.palette.border.main}; /* '#dfe1e6' */
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: ${props => props.theme.spacing(1)}px; /* 8px */
`;

export const OwnerSelectItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing(0.5)}px 0; /* 4px 0 */
  cursor: pointer;
  border-radius: ${props => props.theme.shape.borderRadius};
  transition: background-color 0.1s ease-in-out;

  &:hover {
     background-color: ${props => props.theme.palette.action?.hover ?? 'rgba(0,0,0,0.04)'};
  }
`;

export const OwnerSelectCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${props => props.theme.spacing(1)}px; /* 8px */
  cursor: pointer;
  /* Estilização customizada do checkbox pode ser adicionada aqui se desejado */
`;

export const OwnerSelectLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.palette.text.primary};
  cursor: pointer;
  flex-grow: 1; // Ocupa espaço restante
`;

export const NoMembersText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.palette.text.secondary}; /* '#5e6c84' */
`;


// --- Botões de Ação ---

export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing(1)}px; /* 8px */
  margin-top: ${props => props.theme.spacing(2)}px; /* 16px */
`;

// Botão base com variantes
export const StyledButton = styled.button<{ $variant?: 'primary' | 'default' }>`
  border: none;
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(2)}px; /* 8px 16px */
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  font-family: ${props => props.theme.typography.fontFamily};
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease;

  /* Estilos do botão padrão (Cancelar) */
  background-color: ${props => props.theme.palette.background.default}; /* Ou background.paper? '#f4f5f7' */
  color: ${props => props.theme.palette.text.primary};

  &:hover {
    background-color: ${props => props.theme.palette.border.main}; /* '#dfe1e6' */
  }

  /* Estilos do botão primário (Salvar) */
  ${props => props.$variant === 'primary' && `
    background-color: ${props.theme.palette.primary.main}; /* '#0079bf' ou a cor primária do tema */
    color: ${props.theme.palette.primary.contrastText}; /* '#fff' */

    &:hover {
      /* Escurecer a cor primária no hover - ajuste o valor ou use theme.palette.primary.dark se existir */
      background-color: ${props.theme.palette.primary.dark ?? '#026aa7'};
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.$variant === 'primary' ? props.theme.palette.primary.main : props.theme.palette.text.secondary}60; /* Anel de foco com alpha */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;