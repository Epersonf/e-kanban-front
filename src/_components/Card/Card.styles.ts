import { styled } from "styled-components";

export const CardWrapper = styled.div`
  background: ${props => props.theme.palette.background.paper}; /* '#fff' */
  border-radius: ${props => props.theme.shape.borderRadius}; /* 4px */
  /* Usando uma sombra do tema, ajuste o índice [1] se necessário */
  box-shadow: ${props => props.theme.shadows[1]}; /* '0 1px 2px #0001' - Pode precisar ajustar a sombra no tema */
  padding: ${props => props.theme.spacing(1.5)}px; /* 12px */
  margin-bottom: ${props => props.theme.spacing(1)}px; /* 8px */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${props => props.theme.typography.fontFamily}; /* 'Segoe UI, Arial, sans-serif' */
  font-size: 15px; /* Ou use uma variante do tema: props.theme.typography.body2.fontSize */
  font-weight: 500; /* Ou use uma variante do tema */
  letter-spacing: 0.1px; /* Adicionado 'px' - ajuste se a intenção for outra unidade */
  line-height: 1.5; /* Geralmente unitless está ok para line-height */

  /* Adicionando um estado de hover simples como exemplo */
  &:hover {
    box-shadow: ${props => props.theme.shadows[2]}; /* Sombra um pouco mais forte no hover */
  }
`;

export const CardContent = styled.div`
  flex: 1;
  /* Adicionado um pequeno espaço à direita para não colar no botão */
  margin-right: ${props => props.theme.spacing(1)}px; /* 8px */
`;

export const CardTitle = styled.div`
  font-weight: 600;
  font-size: 16px; /* Ou use ${props => props.theme.typography.body1.fontSize} */
  color: ${props => props.theme.palette.text.primary};
  margin-bottom: ${props => props.theme.spacing(0.5)}px; /* 4px - Espaço leve abaixo do título */
`;

export const CardDescription = styled.div`
  font-size: 13px; /* Ou use ${props => props.theme.typography.caption.fontSize} */
  color: ${props => props.theme.palette.text.secondary}; /* '#555' */
  font-weight: 400;
  /* Permite quebra de linha se a descrição for longa */
  white-space: pre-wrap;
  word-break: break-word;
`;

export const OwnersContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(0.5)}px; /* 4px */
  margin-top: ${props => props.theme.spacing(0.75)}px; /* 6px */
`;

export const OwnerAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.palette.border.main}; /* '#eee' */
  object-fit: cover;
  /* Adiciona uma borda interna para melhor visualização em fundos claros */
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
`;

export const DeleteButton = styled.button`
  /* Estilos baseados no tema */
  color: ${props => props.theme.palette.error.main}; /* '#d32f2f' */
  background: ${props => props.theme.palette.background.paper}; /* '#fff' */
  border: 1px solid ${props => props.theme.palette.error.main};
  border-radius: ${props => props.theme.shape.borderRadius}; /* 4px */
  margin-left: ${props => props.theme.spacing(1)}px; /* 8px */

  /* Estilos fixos/comportamento */
  cursor: pointer;
  font-weight: bold;
  font-size: 16px; /* Mantido fixo, ajuste se necessário */
  padding: ${props => props.theme.spacing(0.5)}px ${props => props.theme.spacing(1)}px; /* 4px 8px */
  line-height: 1; /* Para alinhar melhor o ícone */
  display: flex; /* Para centralizar o ícone se necessário */
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  /* Efeito Hover */
  &:hover {
    background-color: ${props => props.theme.palette.error.main};
    color: ${props => props.theme.palette.error.contrastText};
  }

  /* Remove o outline padrão do navegador ao focar */
  &:focus {
    outline: none;
    /* Adiciona um anel de foco customizado (acessibilidade) */
    box-shadow: 0 0 0 2px ${props => props.theme.palette.primary.main}40; /* Cor primária com alpha */
  }
`;