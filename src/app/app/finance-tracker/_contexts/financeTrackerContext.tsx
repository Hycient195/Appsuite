import React, { createContext, useContext, ReactNode } from 'react';
import { useFinanceTracker } from '../_hooks/useFinanceTracker';

type FinanceTrackerContextType = ReturnType<typeof useFinanceTracker>;

const FinanceTrackerContext = createContext<FinanceTrackerContextType | undefined>(undefined);

interface IFinanceTrackerProviderProps {
  children: ReactNode;
  financeTrackerInstance: ReturnType<typeof useFinanceTracker>;
}

export const BalanceSheetContextProvider: React.FC<IFinanceTrackerProviderProps> = ({ children, financeTrackerInstance }) => {
  return (
    <FinanceTrackerContext.Provider value={financeTrackerInstance}>
      {children}
    </FinanceTrackerContext.Provider>
  );
};

export const useFinanceTrackerContext = (): FinanceTrackerContextType => {
  const context = useContext(FinanceTrackerContext);

  if (!context) {
    throw new Error('useFinanceTrackerContext must be used within a finance tracker context');
  }

  return context;
};