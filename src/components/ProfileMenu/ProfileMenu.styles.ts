import styled from 'styled-components';

// Container principal do menu
export const MenuWrapper = styled.div`
  position: relative;
  margin-left: auto; /* Empurra o menu para a direita em um flex container */
`;

// Botão que aciona o menu (mostra avatar e nome)
export const ProfileButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  /* Cor do texto deve contrastar com o fundo onde ele fica (ex: header) */
  color: ${props => props.theme.palette.primary.contrastText ?? '#fff'};
  font-weight: bold;
  font-size: 16px; // Ou ${props => props.theme.typography.body1.fontSize}
  display: flex; // Para alinhar avatar e nome verticalmente
  align-items: center;
  padding: ${props => props.theme.spacing(0.5)}px; // Pequeno padding
  border-radius: ${props => props.theme.shape.borderRadius}; // Borda arredondada sutil

  /* Feedback visual no hover/focus */
  &:hover, &:focus {
    /* Leve cor de fundo do tema, ajuste se necessário */
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:focus {
     outline: none;
     box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* Anel de foco claro */
  }
`;

// Círculo com a inicial do usuário (Avatar)
export const Avatar = styled.span`
  margin-right: ${props => props.theme.spacing(1)}px; /* 8px */
  background: ${props => props.theme.palette.background.paper}; /* '#fff' */
  /* Cor da letra usa a cor primária principal */
  color: ${props => props.theme.palette.primary.main};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold; // Garante que a letra seja forte
  font-size: 14px; // Tamanho da letra inicial
  /* Para evitar seleção da letra */
  user-select: none;
`;

// O container do menu dropdown que aparece/desaparece
export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + ${props => props.theme.spacing(0.5)}px); /* Posiciona abaixo do botão + 4px de espaço */
  background: ${props => props.theme.palette.background.paper}; /* '#fff' */
  border-radius: ${props => props.theme.shape.borderRadius}; /* 8px ou valor do tema */
  box-shadow: ${props => props.theme.shadows[2] ?? '0 2px 8px rgba(0,0,0,0.15)'}; /* Sombra mais proeminente */
  min-width: 180px; /* Largura mínima */
  z-index: 100;
  overflow: hidden; /* Garante que o conteúdo respeite o border-radius */
  padding-top: ${props => props.theme.spacing(0.5)}px; /* Espaço interno acima do header */
  padding-bottom: ${props => props.theme.spacing(0.5)}px; /* Espaço interno abaixo do botão sair */
`;

// Cabeçalho/saudação dentro do dropdown
export const DropdownHeader = styled.div`
  padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(2)}px; /* 8px 16px */
  /* Linha divisória antes do botão de sair */
  border-bottom: 1px solid ${props => props.theme.palette.border.main}; /* '#eee' */
  color: ${props => props.theme.palette.text.secondary}; /* Cor de texto secundária */
  font-size: 14px; // Ou ${props => props.theme.typography.body2.fontSize}

  b { // Estilo para o nome em negrito
    color: ${props => props.theme.palette.text.primary};
    font-weight: 600; // Um pouco mais forte que o bold padrão
  }
`;

// Botão de Logout dentro do dropdown
export const LogoutButton = styled.button`
  background: transparent;
  border: none;
  /* Cor de erro do tema */
  color: ${props => props.theme.palette.error.main};
  padding: ${props => props.theme.spacing(1.5)}px ${props => props.theme.spacing(2)}px; /* 12px 16px */
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 14px; // Ou ${props => props.theme.typography.body2.fontSize}
  font-weight: 500; // Peso médio
  /* Remove border-radius superior herdado do DropdownMenu se necessário */
  /* border-radius: 0; */
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;

  &:hover {
    /* Fundo levemente avermelhado ou cinza */
    background-color: ${props => props.theme.palette.error.main}15; /* Cor de erro com alpha */
    /* Ou use theme.palette.action.hover */
    /* background-color: ${props => props.theme.palette.action?.hover ?? 'rgba(0,0,0,0.04)'}; */
    /* Pode escurecer o texto no hover também se o fundo ficar claro */
    /* color: ${props => props.theme.palette.error.dark ?? props.theme.palette.error.main}; */
  }

  &:focus {
     outline: none;
     background-color: ${props => props.theme.palette.error.main}20; /* Fundo um pouco mais forte no foco */
  }
`;