// import React, { createContext, useContext, useState } from 'react';

// // Define the shape of a theme
// export interface ITemplateThemeColor {
//   primary: string;
//   secondary: string;
//   accent: string;
// }

// // Context for sharing themes
// const ThemeContext = createContext<{
//   getThemes: (templateId: string) => ITemplateThemeColor[] | undefined;
//   setTheme: (templateId: string, theme: ITemplateThemeColor) => void;
// }>({
//   getThemes: () => undefined,
//   setTheme: () => {},
// });

// export const useThemeContext = () => useContext(ThemeContext);

import React, { createContext, useContext, useState } from 'react';
import { ITemplateThemeColor } from '../_types/types';

// Define the shape of the context
// interface ITemplateThemeColor {
//   primary: string;
//   secondary: string;
//   accent: string;
// }

interface ThemeContextType {
  getThemes: (templateId: string) => ITemplateThemeColor[] | undefined;
  setTheme: (templateId: string, theme: ITemplateThemeColor, callback?: any) => void;
  registerTemplate: (templateId: string, themes: ITemplateThemeColor[]) => void;
  getSelectedTheme: (templateId: string) => ITemplateThemeColor | undefined;
}

// Create the Context with a default value of `undefined`
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the ThemeContext
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};