import React, { createContext, useContext, ReactNode } from 'react';
import { useBalanceSheet } from '../_hooks/useBalanceSheet';

type GameContextType = ReturnType<typeof useBalanceSheet>;

const GameContext = createContext<GameContextType | undefined>(undefined);

interface IGameProviderProps {
  children: ReactNode;
  balanceSheetInstance: ReturnType<typeof useBalanceSheet>;
}

export const BalanceSheetContextProvider: React.FC<IGameProviderProps> = ({ children, balanceSheetInstance }) => {
  return (
    <GameContext.Provider value={balanceSheetInstance}>
      {children}
    </GameContext.Provider>
  );
};

export const useBalanceSheetContext = (): GameContextType => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }

  return context;
};