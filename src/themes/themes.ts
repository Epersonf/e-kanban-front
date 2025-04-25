// src/theme/theme.ts
import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  palette: {
    primary: {
      main: '#1976d2', // Azul Material UI
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e', // Rosa Material UI (exemplo)
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f', // Vermelho Material UI
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // Fundo cinza claro
      paper: '#ffffff', // Fundo de "papel" (cards, forms)
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // Texto principal escuro
      secondary: 'rgba(0, 0, 0, 0.6)', // Texto secundário
      disabled: 'rgba(0, 0, 0, 0.38)', // Texto desabilitado
    },
    divider: 'rgba(0, 0, 0, 0.12)', // Cor do divisor
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem', // 40px
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.5rem', // 24px
      fontWeight: 500,
      lineHeight: 1.33,
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'uppercase', // Botões Material UI são geralmente uppercase
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.66,
    },
  },
  spacing: (factor: number) => 8 * factor, // Return number instead of string
  shape: {
    borderRadius: '4px', // Raio de borda padrão
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)', // Elevation 1 (exemplo)
    '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)', // Elevation 2
    // ... adicione mais níveis de elevação conforme necessário
  ],
  components: {
    // Configurações específicas de componentes podem ir aqui
    MuiInput: {
      // Apenas como exemplo de estrutura, não aplicável diretamente aqui
      border: '1px solid rgba(0, 0, 0, 0.23)',
      hoverBorder: '1px solid rgba(0, 0, 0, 0.87)',
      focusBorder: `2px solid #1976d2`, // Cor primária
    },
    MuiButton: {
      containedPrimary: {
        backgroundColor: '#1976d2',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#1565c0', // Um pouco mais escuro
        },
      },
      outlinedPrimary: {
        color: '#1976d2',
        borderColor: 'rgba(25, 118, 210, 0.5)', // Cor primária com alpha
        '&:hover': {
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.04)', // Fundo leve ao passar o mouse
        },
      },
    },
  },
};

// É uma boa prática também definir a interface do tema para type safety
declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      primary: { main: string; contrastText: string };
      secondary: { main: string; contrastText: string };
      error: { main: string; contrastText: string };
      background: { default: string; paper: string };
      text: { primary: string; secondary: string; disabled: string };
      divider: string;
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
    spacing: (factor: number) => number; // Update return type to number
    shape: {
      borderRadius: string;
    };
    shadows: string[];
    components?: any; // Adicione tipos mais específicos se necessário
  }
}

export default theme;
