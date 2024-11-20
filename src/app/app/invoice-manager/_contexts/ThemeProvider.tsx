"use client"

import { useState } from "react";
import { ITemplateThemeColor } from "../_types/types";
import { ThemeContext, useThemeContext } from "./themeContext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<Record<
    string,
    { themes: ITemplateThemeColor[]; selectedTheme: ITemplateThemeColor }
  >>({});

  const getThemes = (templateId: string) => templates[templateId]?.themes;

  const setTheme = (templateId: string, theme: ITemplateThemeColor, callback?: any) => {
    setTemplates((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        selectedTheme: theme,
      },
    }));
    if (callback) callback()
  };

  const registerTemplate = (templateId: string, themes: ITemplateThemeColor[]) => {
    if (!templates[templateId]) {
      setTemplates((prev) => ({
        ...prev,
        [templateId]: { themes, selectedTheme: themes[0] }, // Default to the first theme
      }));
    }
  };

  const getSelectedTheme = (templateId: string) => templates[templateId]?.selectedTheme;


  return (
    <ThemeContext.Provider value={{ getThemes, setTheme, registerTemplate, getSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [templates, setTemplates] = useState<Record<
//     string,
//     { themes: Theme[]; selectedTheme: Theme }
//   >>({});

//   const getThemes = (templateId: string) => templates[templateId]?.themes;

//   const setTheme = (templateId: string, theme: Theme) => {
//     setTemplates((prev) => ({
//       ...prev,
//       [templateId]: {
//         ...prev[templateId],
//         selectedTheme: theme,
//       },
//     }));
//   };

//   const registerTemplate = (templateId: string, themes: Theme[]) => {
//     if (!templates[templateId]) {
//       setTemplates((prev) => ({
//         ...prev,
//         [templateId]: { themes, selectedTheme: themes[0] }, // Default to the first theme
//       }));
//     }
//   };

//   const getSelectedTheme = (templateId: string) => templates[templateId]?.selectedTheme;

//   return (
//     <ThemeContext.Provider
//       value={{ getThemes, setTheme, registerTemplate, getSelectedTheme }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// };