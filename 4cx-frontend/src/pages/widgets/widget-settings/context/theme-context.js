import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export function WebUIThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    color: "#000000",
    font: "Arial",
  });

  const changeColor = (newColor) => {
    setTheme((prev) => ({ ...prev, color: newColor }));
  };

  const changeFont = (newFont) => {
    setTheme((prev) => ({ ...prev, font: newFont }));
  };

  return (
    <ThemeContext.Provider value={{ theme, changeColor, changeFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useDesignTheme = () => useContext(ThemeContext);
