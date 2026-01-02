export type ThemeType = 'apples' | 'trains' | 'dinos';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  item: string; // The emoji/icon for the draggable item
  container: string; // The container (basket, station, etc)
  bg: string; // Tailwind background color class
  primary: string; // Primary color for buttons
  accent: string; // Accent color
}

export interface Problem {
  num1: number;
  num2: number;
  operation: '+' | '-';
  result: number;
}
