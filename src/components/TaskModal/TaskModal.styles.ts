import styled from 'styled-components';
import BaseForm from '../Form/Form';

// Modal overlay
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0; // Equivalent to top: 0, left: 0, width: 100vw, height: 100vh
  background: #121212; /* Dark gray */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* High z-index for modals */
  padding: ${props => props.theme.spacing(2)}px;
`;

// Modal form
export const TaskForm = styled(BaseForm)`
  background: #1e1e1e; /* Darker background for form */
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
  color: #ffffff; /* Light text for dark mode */
  text-align: center;
`;

// Action buttons container
export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing(1)}px;
  margin-top: ${props => props.theme.spacing(1)}px;
  color: #ffffff; /* Light text for dark mode */
`;

// Select container for swimlanes dropdown
export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(0.5)}px;
  
  label {
    font-size: ${props => props.theme.typography.body2.fontSize};
    color: #ffffff; /* Light text for dark mode */
  }
  
  select {
    padding: ${props => props.theme.spacing(1)}px;
    border-radius: ${props => props.theme.shape.borderRadius};
    border: 1px solid #616161; /* Darker border for dark mode */
    background-color: #1e1e1e; /* Darker background for select */
    color: #ffffff; /* Light text for select */
    font-size: ${props => props.theme.typography.body1.fontSize};
    
    &:focus {
      outline: none;
      border-color: #007bff; /* Dark blue focus outline */
      box-shadow: 0 0 0 2px #007bff25;
    }
  }
`;
