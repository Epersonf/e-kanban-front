import styled from "styled-components";

export const Container = styled.div<{ $isInsertingCard?: boolean }>`
  display: flex;
  width: 250px;
  max-height: 430px;
  height: fit-content;
  background-color: #101204;
  border-radius: 10px;
  padding: 9px;
  flex-direction: column;
  gap: 8px;
  border: 2px solid transparent;

  &:hover {
    border: 2px solid ${props => props.$isInsertingCard ? "#85B8FF" : "transparent"};
  }
`;

export const PlaceholderCard = styled.div<{ $height: number }>`
  background-color: rgba(0, 0, 0, 0.1); // Cinza claro semi-transparente
  border: 1px dashed #888;
  border-radius: 3px;
  margin-bottom: 8px; // Igual à margem do Card normal
  height: ${props => props.$height}px; // Altura dinâmica
  width: 100%; // Ocupa a largura do container
  box-sizing: border-box;
  flex-shrink: 0; // Evita que encolha em flex container
`;

export const Header = styled.div`
  display: flex;
  /* gap: 2px; */
`;

export const StaticTitle = styled.div`
  flex: 1;
  padding: 4px;
  padding-left: 12px;
  border-radius: 2px;
  color: #eee;
  font-weight: 600;
  border: 2px solid transparent;

  &:hover {
    cursor: pointer;
  }
`;

export const EditableTitle = styled.input.attrs({ contentEditable: true })`
  flex: 1;
  display: flex;
  border: 2px solid #85B8FF;
  background-color: #22272B;
  color: #eee;
  font-weight: 600;
  padding: 8px;
  padding-left: 12px;
  border-radius: 3px;
  align-items: center;
  outline: none;

  &::placeholder {
    color: #8C9BAB;
  }
`;

export const Button = styled.button`
  background-color: transparent;
  border: none;
  color: #eee;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    background-color: #282F27;
    cursor: pointer;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  /* Consider enabling vertical scroll if cards exceed List max-height */
  overflow-y: auto; 
  overflow-x: hidden; /* Prevent horizontal scrollbars here if needed */
  gap: 8px;
  /* Ensure CardContainer itself doesn't overflow List horizontally */
  min-width: 0; 
`;

export const Card = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  align-items: start;
  padding: 8px;
  background-color: #22272B;
  color: #ccc;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: border 0.3s ease;
  font-size: 14px;
  z-index: ${props => props.$isDragging ? "2" : "auto"};
  
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
  
  &:hover {
    cursor: ${props => props.$isDragging ? "grabbing" : "pointer"};
    border: ${props => props.$isDragging ? "2px solid transparent" : "2px solid #fff"};
  }
`;

export const EditableCard = styled.textarea`
  flex: 1; /* If its container is flex and you want it to grow */
  border: 2px solid transparent;
  background-color: #22272B;
  color: #eee;
  padding: 4px 4px 4px 12px; /* top right bottom left - text starts 4px from top, 12px from left */
  border-radius: 8px;
  outline: none;
  min-height: 80px; /* Minimum height */
  box-sizing: border-box;
  line-height: 1.4; /* Or 'normal', or adjust based on font-size for readability */
  font-family: inherit; /* Ensures it uses the same font as the rest of the page */
  font-size: inherit; /* Ensures it uses the same font size */
  resize: none; /* Optional: Prevents user from resizing the textarea */

  &::placeholder {
    color: #8C9BAB;
  }

  /* Optional: Add focus styles */
  &:focus {
    border-color: #58A6FF;
  }

  &:hover {
    border-color: transparent;
  }
`;