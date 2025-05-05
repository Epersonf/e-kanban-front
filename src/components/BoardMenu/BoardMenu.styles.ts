// src/components/layout/BoardMenu.styles.ts
// (Ajuste o caminho conforme sua estrutura)
import styled from 'styled-components';

// Cores específicas deste componente (Recomendado: Mover para o tema)
const sidebarColors = {
  background: '#162447', // Azul escuro principal
  border: '#1f4068',     // Azul um pouco mais claro (borda, fundo ativo)
  title: '#5dade2',      // Azul claro para título/borda ativa
  text: '#ffffff',       // Texto principal (branco)
};

// --- Componentes Estilizados ---

// Container principal do menu lateral (<aside>)
// Recebe a prop 'collapsed' para ajustar a largura
export const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  width: ${props => (props.$collapsed ? '56px' : '240px')}; // Largura condicional
  background: ${sidebarColors.background};
  /* Usando padding do tema onde possível */
  padding: ${props => props.theme.spacing(3)}px 0; // 24px vertical, 0 horizontal
  border-right: 1px solid ${sidebarColors.border};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(1)}px; // 8px entre itens
  color: ${sidebarColors.text}; // Cor padrão do texto
  transition: width 0.2s ease-in-out; // Transição suave da largura
  position: relative; // Para posicionar o botão de toggle
  z-index: 2; // Acima do conteúdo principal, abaixo de modais talvez
  flex-shrink: 0; // Evita que o sidebar encolha
`;

// Botão para expandir/recolher o menu
export const ToggleButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing(2)}px; // 16px
  /* Posiciona para fora da sidebar */
  right: -${props => props.theme.spacing(2)}px; // -16px (ajuste fino se necessário)
  background: ${sidebarColors.border}; // Usa a cor da borda/ativa
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: ${sidebarColors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Usando sombra do tema */
  box-shadow: ${props => props.theme.shadows[1]};
  z-index: 3; // Acima da sidebar
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    /* Escurecer um pouco no hover */
    background-color: ${sidebarColors.background};
    /* Pode adicionar um leve scale */
    /* transform: scale(1.05); */
  }

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows[1]}, 0 0 0 3px ${sidebarColors.title}80; // Sombra + anel de foco azul claro
  }
`;

// Container para o conteúdo visível apenas quando não colapsado
export const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(0.5)}px; // Espaço menor entre botões de board
  overflow: hidden; // Garante que o conteúdo não vaze durante a transição
  flex-grow: 1; // Ocupa espaço vertical disponível
  padding-top: ${props => props.theme.spacing(2)}px; // Espaço acima do título "Boards"
`;

// Título "Boards"
export const MenuHeader = styled.div`
  /* Padding horizontal 24px */
  padding: 0 ${props => props.theme.spacing(3)}px;
  font-weight: bold;
  font-size: 1.125rem; // 18px
  margin-bottom: ${props => props.theme.spacing(2)}px; // 16px
  color: ${sidebarColors.title}; // Azul claro
  /* Evita seleção de texto */
  user-select: none;
`;

// Botão para selecionar um Board
// Recebe 'isSelected' para aplicar estilos ativos
export const BoardItem = styled.button<{ $isSelected: boolean }>`
  text-align: left;
  /* Padding: 12px 24px */
  padding: ${props => props.theme.spacing(1.5)}px ${props => props.theme.spacing(3)}px;
  background: ${props => (props.$isSelected ? sidebarColors.border : 'transparent')}; // Fundo ativo
  border: none;
  border-left: 4px solid ${props => (props.$isSelected ? sidebarColors.title : 'transparent')}; // Borda ativa
  color: ${sidebarColors.text};
  font-weight: ${props => (props.$isSelected ? 'bold' : 'normal')}; // Peso ativo
  font-size: 1rem; // 16px
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  width: 100%; // Ocupa toda a largura
  /* Truncate text if too long */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover:not(:disabled) {
    /* Fundo levemente mais claro que o sidebar ou igual ao ativo */
    background-color: ${props => props.theme.palette.action.hover ?? sidebarColors.border};
  }

   &:focus {
     outline: none;
     /* Adiciona um indicador de foco sutil */
     position: relative; // Necessário para o pseudo-elemento
     &::after {
       content: '';
       position: absolute;
       inset: 4px; // Pequeno espaço interno
       border-radius: ${props => props.theme.shape.borderRadius};
       border: 2px solid ${sidebarColors.title}80; // Anel de foco interno
     }
   }
`;

// Botão "+ Novo Board"
export const NewBoardButton = styled.button`
  /* Margem 24px */
  margin: ${props => props.theme.spacing(3)}px;
  /* Cor primária do Trello */
  background: ${props => props.theme.palette.primary.main};
  color: ${props => props.theme.palette.primary.contrastText};
  border: none;
  border-radius: ${props => props.theme.shape.borderRadius}; // 3px (era 4px)
  /* Padding 10px vertical, 0 horizontal -> centralizar texto */
  padding: ${props => props.theme.spacing(1.25)}px 0;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem; // 16px
  width: calc(100% - ${props => props.theme.spacing(6)}px); // Largura total menos margens
  text-align: center;
  transition: background-color 0.2s ease;
  margin-top: auto; // Empurra para o final do menu

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.palette.primary.dark};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.palette.primary.main}60; // Anel de foco primário
  }
`;