import React, { createContext, useContext, ReactNode } from 'react';
import { useGradesTracker } from '../_hooks/useGradesTracker';

type FinanceTrackerContextType = ReturnType<typeof useGradesTracker>;

const GradesTrackerContext = createContext<FinanceTrackerContextType | undefined>(undefined);

interface IFinanceTrackerProviderProps {
  children: ReactNode;
  gradesTrackerInstance: ReturnType<typeof useGradesTracker>;
}

export const GradesTrackerContextProvider: React.FC<IFinanceTrackerProviderProps> = ({ children, gradesTrackerInstance }) => {
  return (
    <GradesTrackerContext.Provider value={gradesTrackerInstance}>
      {children}
    </GradesTrackerContext.Provider>
  );
};

export const useGradesTrackerContext = (): FinanceTrackerContextType => {
  const context = useContext(GradesTrackerContext);

  if (!context) {
    throw new Error('useGradesTrackerContext must be used within a Grades tracker context');
  }

  return context;
};