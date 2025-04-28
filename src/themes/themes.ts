// src/theme/theme.ts
import { DefaultTheme } from 'styled-components';

// --- Cores inspiradas no Trello ---
const trelloPalette = {
  blue: {
    main: '#0079bf', // Azul principal Trello
    dark: '#026aa7',  // Azul escuro (usado em headers, hovers)
    light: '#e0f2f7', // Azul bem claro (usado em backgrounds de drag-over)
  },
  text: {
    primary: '#172b4d',   // Quase preto / azul ardósia escuro
    secondary: '#5e6c84', // Cinza azulado médio
    subtle: '#6b778c',    // Cinza azulado mais claro (placeholders, etc)
    contrast: '#ffffff',  // Branco
  },
  background: {
    default: '#f4f5f7', // Cinza muito claro (fundo de listas/áreas Trello) - ou #ebecf0
    paper: '#ffffff',   // Fundo de cards, modais, etc.
    overlay: 'rgba(9, 30, 66, 0.7)', // Overlay de modal
  },
  action: { // Cores para interação (baseadas no azul ardósia escuro)
    hover: 'rgba(9, 30, 66, 0.04)',
    selected: 'rgba(9, 30, 66, 0.08)',
    disabledBackground: 'rgba(9, 30, 66, 0.08)', // Similar ao selected ou um pouco mais claro
    disabled: 'rgba(9, 30, 66, 0.4)', // Cor do texto/ícone desabilitado
  },
  border: {
    main: '#dfe1e6', // Cinza claro para bordas de input/divisores
  },
  error: { // Mantendo o vermelho Material, ajuste se necessário
    main: '#d32f2f',
    contrastText: '#ffffff',
    dark: '#c62828',
  },
  // Você pode adicionar outras cores semânticas se precisar (success, warning, etc.)
  // success: { main: '#61bd4f', contrastText: '#ffffff' },
  // warning: { main: '#ffab00', contrastText: '#172b4d' },
};

// --- Definição do Tema Trello Style ---
const theme: DefaultTheme = {
  palette: {
    primary: {
      main: trelloPalette.blue.main,
      dark: trelloPalette.blue.dark,
      contrastText: trelloPalette.text.contrast,
      // 'light' pode ser adicionado se útil
    },
    secondary: { // Mantido rosa como exemplo, ajuste ou remova se não usar
      main: '#dc004e',
      contrastText: '#ffffff',
    },
    error: {
      main: trelloPalette.error.main,
      dark: trelloPalette.error.dark,
      contrastText: trelloPalette.error.contrastText,
    },
    background: {
      default: trelloPalette.background.default,
      paper: trelloPalette.background.paper,
      // Adicionando overlay para fácil acesso
      overlay: trelloPalette.background.overlay,
    },
    text: {
      primary: trelloPalette.text.primary,
      secondary: trelloPalette.text.secondary,
      disabled: trelloPalette.action.disabled, // Usando cor de ação desabilitada
      // Adicionando cores extras de texto
      subtle: trelloPalette.text.subtle,
      contrast: trelloPalette.text.contrast, // Branco
    },
    // Renomeado 'divider' para 'border' para maior clareza
    border: {
       main: trelloPalette.border.main,
    },
    action: trelloPalette.action,
    // Adicionando a cor azul clara para referências
    blue: {
        light: trelloPalette.blue.light,
    }
    // Adicione outras paletas (success, warning) aqui se definidas acima
  },
  typography: {
    // Fonte mais próxima do Trello (preferência por fontes do sistema)
    fontFamily: '"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    // Ajuste tamanhos/pesos se necessário para combinar com Trello
    h1: { fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.2 }, // Ex: Títulos grandes mais pesados
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.33 }, // Ex: Títulos de modal/lista (20px)
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 }, // Ex: Texto principal (14px)
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 }, // Texto secundário (14px)
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,      // Peso médio
      lineHeight: 1.5,     // Ajuste conforme necessário
      textTransform: 'none', // Trello geralmente não usa uppercase
    },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66 }, // 12px
  },
  // Espaçamento pode ser mantido, Trello usa múltiplos de 4 e 8
  spacing: (factor: number) => 8 * factor,
  shape: {
    // Raio de borda padrão do Trello
    borderRadius: '3px',
  },
  shadows: [ // Sombras mais sutis, inspiradas no Trello/Atlassian Design System
    'none',
    // Sombra sutil para cards/elementos elevados (equivalente a elevation 1 talvez)
    '0 1px 1px rgba(9,30,66,.25), 0 0 1px rgba(9,30,66,.31)',
    // Sombra um pouco mais forte para modais/menus dropdown (equivalente a elevation 2-4)
    '0 4px 8px -2px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08)',
    // Sombra mais pronunciada (equivalente a elevation 8)
    '0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08)',
    // Adicione mais se necessário
  ],
  // Seção 'components' removida pois era específica de Material UI
};

// --- Atualização da Interface DefaultTheme ---
// Garanta que a interface reflita EXATAMENTE a estrutura do objeto 'theme' acima
declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primary: { main: string; dark: string; contrastText: string; };
      secondary: { main: string; contrastText: string; }; // Mantenha se usar
      error: { main: string; dark: string; contrastText: string; };
      background: { default: string; paper: string; overlay: string; }; // Adicionado overlay
      text: { primary: string; secondary: string; disabled: string; subtle: string; contrast: string; }; // Adicionado subtle, contrast
      border: { main: string; }; // Renomeado de divider
      action: {
        hover: string;
        selected: string;
        disabledBackground: string;
        disabled: string;
      };
      blue?: { // Adicionando azul claro opcional
          light?: string;
      }
      // Adicione outras paletas (success, warning) aqui se definidas no tema
    };
    typography: {
      fontFamily: string;
      h1: { fontSize: string; fontWeight: number; lineHeight: number };
      h5: { fontSize: string; fontWeight: number; lineHeight: number };
      body1: { fontSize: string; fontWeight: number; lineHeight: number };
      body2: { fontSize: string; fontWeight: number; lineHeight: number };
      button: { fontSize: string; fontWeight: number; lineHeight: number; textTransform: string };
      caption: { fontSize: string; fontWeight: number; lineHeight: number };
    };
    spacing: (factor: number) => number;
    shape: {
      borderRadius: string;
    };
    shadows: string[];
    // components?: any; // Removido ou comente
  }
}

export default theme;