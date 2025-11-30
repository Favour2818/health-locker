import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [data, setData] = useState(null);

  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  );
}