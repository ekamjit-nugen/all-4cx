import { createContext, useContext } from "react";

// Create a context without typing for JavaScript
const Context = createContext(null);

export const MarkdownProvider = ({ onCitationClick, children }) => {
  return (
    <Context.Provider
      value={{
        onCitationClick,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useMarkdownContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Markdown Context is null");
  }

  return context;
};
