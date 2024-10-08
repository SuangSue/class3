import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DebugContextType {
  isDebugMode: boolean;
  setDebugMode: (value: boolean) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  return (
    <DebugContext.Provider value={{ isDebugMode, setDebugMode: setIsDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};