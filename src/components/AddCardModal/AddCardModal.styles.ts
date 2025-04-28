// src/components/modals/AddCardModal.styles.ts
import styled from 'styled-components';
// Importando Form para estilizá-lo diretamente (se ele aceitar className)
// Ou importe e use como wrapper se ele não aceitar className
import BaseForm from '../Form/Form'; // Renomeado para evitar conflito

// Reutilizando ou redefinindo o Overlay (similar ao CardDetailsModal)
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0; // Equivalente a top: 0, left: 0, width: 100vw, height: 100vh
  background: ${props => props.theme.palette.background.overlay}; // Usando cor do tema
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; // Z-index alto para modais
  padding: ${props => props.theme.spacing(2)}px; // Espaçamento nas bordas em telas pequenas
`;

// Estilizando o componente Form importado (assumindo que aceita className)
// Ou crie um wrapper 'ModalContent' como no CardDetailsModal e coloque <BaseForm> dentro
export const AddCardForm = styled(BaseForm)`
  background: ${props => props.theme.palette.background.paper};
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: ${props => props.theme.spacing(3)}px; // 24px
  box-shadow: ${props => props.theme.shadows[2]}; // Sombra do tema
  width: 100%; // Ocupa largura disponível
  max-width: 450px; // Largura máxima do modal
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(2)}px; // Espaço entre título, inputs e botões (16px)
`;

// Título do Modal
export const ModalTitle = styled.h2`
  margin: 0;
  margin-bottom: ${props => props.theme.spacing(1)}px; // Espaço abaixo do título (8px)
  font-size: ${props => props.theme.typography.h5.fontSize}; // Estilo do tema
  font-weight: ${props => props.theme.typography.h5.fontWeight};
  color: ${props => props.theme.palette.text.primary};
  text-align: center; // Centralizar título do modal de adição
`;

// Reutilizando o container de botões do CardDetailsModal (ou redefinindo)
export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing(1)}px; // 8px
  margin-top: ${props => props.theme.spacing(1)}px; // Espaço acima dos botões (8px)
`;