import styled from "styled-components";

// 1. Esconde o checkbox nativo, mas mantém acessível
export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

// Ícone de checkmark (pode ser um SVG, caractere unicode, etc.)
export const Icon = styled.svg`
  fill: none;
  stroke: #22272B; // Cor do checkmark
  stroke-width: 3px;
`;

// 2. Cria o elemento visual que substitui o checkbox
export const StyledCheckbox = styled.div<{ checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 16px; // Tamanho da caixa
  height: 16px; // Tamanho da caixa
  background: ${props => props.checked ? '#29AC77' : 'transparent'}; // Cor quando checado / não checado
  border: 1px solid ${props => props.checked ? 'transparent' : '#adb5bd'}; // Cor da borda
  border-radius: 50%; // Bordas arredondadas
  transition: all 150ms;
  margin-right: 8px;

  ${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'} // Mostra/Esconde o ícone
  }
`;

// 4. Container que envolve tudo (usa <label> para acessibilidade)
export const CheckboxContainer = styled.label`
  display: inline-flex; // Usa flex para alinhar itens verticalmente
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  /* width: 400px; */
  user-select: none; // Impede seleção de texto ao clicar rápido
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  
  transition:
    opacity 0.3s ease-out,
    max-width 1.5s ease-in-out;

  /* Adiciona estilo de foco para acessibilidade */
  ${HiddenCheckbox}:focus + ${StyledCheckbox} {
    /* box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); // Efeito de foco */
  }

  /* Desabilitado */
  ${HiddenCheckbox}:disabled + ${StyledCheckbox} {
    background-color: #e9ecef;
    border-color: #ced4da;
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${HiddenCheckbox}:disabled ~ span { /* Estiliza o texto do label quando desabilitado */
      cursor: not-allowed;
      opacity: 0.6;
  }
`;