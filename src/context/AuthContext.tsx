import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, MeResponse } from '../types';
import { apiRequest, TOKEN_KEY } from '../api/api';

interface AuthContextValue {
  currentUser: User | null;
  isChecking: boolean;
  isManager: boolean;
  saveLogin: (token: string, user: User) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // פעם אחת כשהאתר נטען: יש token? של מי הוא?
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsChecking(false);
      return;
    }

    apiRequest<MeResponse>('/auth/me')
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  // אחרי כניסה או הרשמה מוצלחת
  function saveLogin(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    setCurrentUser(user);
  }

  // יציאה
  function logOut() {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isChecking,
        isManager: currentUser?.role === 'MANAGER',
        saveLogin,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// כל קומפוננטה קוראת לזה כדי לדעת מי מחוברת
export function useAuth() {
  const data = useContext(AuthContext);
  if (!data) {
    throw new Error('useAuth חייב להיות בתוך AuthProvider');
  }
  return data;
}