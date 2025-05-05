// src/components/TaskModal/TaskModal.styles.ts
import styled from 'styled-components';
import BaseForm from '../Form/Form';

// Modal overlay
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0; // Equivalent to top: 0, left: 0, width: 100vw, height: 100vh
  background: ${props => props.theme.palette.background.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; // High z-index for modals
  padding: ${props => props.theme.spacing(2)}px;
`;

// Modal form
export const TaskForm = styled(BaseForm)`
  background: ${props => props.theme.palette.background.paper};
  border-radius: ${props => props.theme.shape.borderRadius};
  padding: ${props => props.theme.spacing(3)}px;
  box-shadow: ${props => props.theme.shadows[2]};
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(2)}px;
`;

// Modal title
export const ModalTitle = styled.h2`
  margin: 0;
  margin-bottom: ${props => props.theme.spacing(1)}px;
  font-size: ${props => props.theme.typography.h5.fontSize};
  font-weight: ${props => props.theme.typography.h5.fontWeight};
  color: ${props => props.theme.palette.text.primary};
  text-align: center;
`;

// Action buttons container
export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing(1)}px;
  margin-top: ${props => props.theme.spacing(1)}px;
`;

// Select container for swimlanes dropdown
export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(0.5)}px;
  
  label {
    font-size: ${props => props.theme.typography.body2.fontSize};
    color: ${props => props.theme.palette.text.secondary};
  }
  
  select {
    padding: ${props => props.theme.spacing(1)}px;
    border-radius: ${props => props.theme.shape.borderRadius};
    border: 1px solid ${props => props.theme.palette.border.main};
    background-color: ${props => props.theme.palette.background.paper};
    font-size: ${props => props.theme.typography.body1.fontSize};
    color: ${props => props.theme.palette.text.primary};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.palette.primary.main};
      box-shadow: 0 0 0 2px ${props => props.theme.palette.primary.main}25;
    }
  }
`;

