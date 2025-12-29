import { createTheme } from '@mui/material/styles';
import type { Theme as MuiTheme } from '@mui/material/styles';

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {}
}

declare module '@mui/material/styles' {
  interface Theme {
    app: { headerHeight: number; contentMaxWidth: number };
    tokens: {
      spacing: (n: number) => number;
      radius: { sm: number; md: number; lg: number };
      shadow: { sm: string; md: string; lg: string };
    };
  }
  interface ThemeOptions {
    app?: { headerHeight?: number; contentMaxWidth?: number };
    tokens?: {
      spacing?: (n: number) => number;
      radius?: { sm?: number; md?: number; lg?: number };
      shadow?: { sm?: string; md?: string; lg?: string };
    };
  }
}

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#8ab4f8' : '#1976d2' },
      secondary: { main: mode === 'dark' ? '#fbc02d' : '#9c27b0' },
      background: {
        default: mode === 'dark' ? '#181818ff' : '#f7f7f9',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#eaeef2' : '#1a1a1b',
        secondary: mode === 'dark' ? '#cbd5e1' : '#5a5a5f',
      },
    },
    typography: {
      fontSize: 14,
      fontFamily:
        "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Apple SD Gothic Neo','Malgun Gothic','Spoqa Han Sans Neo',sans-serif",
    },
    shape: { borderRadius: 8 },
    app: {
      headerHeight: 70,
      contentMaxWidth: 1400,
    },
    tokens: {
      spacing: (n: number) => n * 8,
      radius: { sm: 6, md: 8, lg: 12 },
      shadow: {
        sm: '0 1px 3px rgba(0,0,0,.12)',
        md: '0 4px 12px rgba(0,0,0,.12)',
        lg: '0 12px 28px rgba(0,0,0,.18)',
      },
    },
  });

export const lightTheme = getTheme('light');
export const darkTheme = getTheme('dark');

// 색상만 추출하는 헬퍼 함수
export const getThemeColors = (mode: 'light' | 'dark') => {
  const theme = getTheme(mode);
  return {
    // 배경
    bgDefault: theme.palette.background.default,
    bgPaper: theme.palette.background.paper,
    
    // 텍스트
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    
    // Primary 색상
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
  };
};