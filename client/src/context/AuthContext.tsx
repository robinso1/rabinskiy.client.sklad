// Auth context
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'worker';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Здесь будет реальный запрос к API
      console.log('Logging in with:', { username, password });
      
      // Имитация успешной авторизации
      if (username === 'admin' && password === 'password') {
        setUser({
          id: '1',
          username: 'admin',
          fullName: 'Администратор',
          role: 'admin'
        });
        return true;
      } else if (username === 'worker' && password === 'password') {
        setUser({
          id: '2',
          username: 'worker',
          fullName: 'Работник',
          role: 'worker'
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
