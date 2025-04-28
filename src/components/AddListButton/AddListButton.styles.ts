import styled from 'styled-components';

export const StyledAddButton = styled.button`
  /* Estilos base e reset */
  border: none;
  cursor: pointer;
  text-align: left; // Alinha texto à esquerda
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease;
  display: flex; // Para alinhar ícone + texto se adicionar um ícone depois
  align-items: center;

  /* Estilos do tema Trello */
  /* Usando um estilo similar ao botão secundário */
  background-color: ${props => props.theme.palette.action.hover}cc; // Fundo cinza claro com leve transparência (cc = 80%)
  /* Ou use uma cor sólida: props.theme.palette.action.hover */
  color: ${props => props.theme.palette.text.primary}; // Texto principal
  border-radius: ${props => props.theme.shape.borderRadius}; // 3px
  /* Padding: 10px 16px */
  padding: ${props => props.theme.spacing(1.25)}px ${props => props.theme.spacing(2)}px;
  font-weight: 600; // Usando 600 em vez de 'bold'(700) para um negrito menos forte
  font-size: ${props => props.theme.typography.body1.fontSize}; // 14px
  font-family: ${props => props.theme.typography.fontFamily};
  /* Margem superior: 12px */
  /* A margem pode ser aplicada aqui ou onde o botão é usado, dependendo do layout */
  /* margin-top: ${props => props.theme.spacing(1.5)}px; */

  /* Opcional: Definir largura e flex-shrink se ele fica ao lado das listas */
  width: 280px; // Mesma largura das listas (ListWrapper)
  flex-shrink: 0; // Impede que encolha em um container flex

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.palette.action.selected}cc; // Cinza um pouco mais escuro com transparência
     /* Ou use uma cor sólida: props.theme.palette.action.selected */
  }

  &:focus {
    outline: none;
    /* Anel de foco sutil */
    box-shadow: 0 0 0 3px ${props => props.theme.palette.primary.main}60;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;