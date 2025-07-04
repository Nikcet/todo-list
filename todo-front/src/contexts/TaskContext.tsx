import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface TaskContextType {
  refreshTasks: () => void;
  refreshKey: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask должен использоваться внутри TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTasks = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const value = {
    refreshTasks,
    refreshKey
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 