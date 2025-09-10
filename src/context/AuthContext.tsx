import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type User = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  cell_phone?: string;
  address?: any;
};

type AuthContextData = {
  signIn: (cpf: string, password: string) => Promise<void>;
  signOut: () => void;
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextData | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Falha ao carregar dados de autenticação.", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === 'tabs';

    if (!token && inTabsGroup) {
      router.replace('/cadlog/login');
    } else if (token && !inTabsGroup) {
      router.replace('/tabs/home');
    }
  }, [token, segments, isLoading, router]);

  const signIn = async (cpf: string, password: string) => {
    const formData = new FormData();
    formData.append('cpf', cpf.replace(/\D/g, ''));
    formData.append('password', password);
    formData.append('origin_app', 'true');

    try {
      const response = await fetch('https://www.resolvevereador.com.br/api/authenticate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json', // 🔑 importante para Laravel
        },
        body: formData,
      });

      const data = await response.json();
      console.log("🔐 Resposta do login:", data);

      if (response.ok && data.code === 202) {
        // 🚨 Confirme aqui: pode ser data.token, data.access_token ou data.api_token
        const receivedToken = data.token || data.access_token || data.api_token;

        if (!receivedToken) {
          throw new Error("Token não encontrado na resposta da API.");
        }

        setToken(receivedToken);
        setUser(data.data);

        await AsyncStorage.setItem('user_token', receivedToken);
        await AsyncStorage.setItem('user_data', JSON.stringify(data.data));

      } else {
        throw new Error(data.message || 'CPF ou senha inválidos.');
      }
    } catch (error) {
      console.error("Erro no signIn:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (token) {
        await fetch('https://www.resolvevereador.com.br/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
      }
    } catch (e) {
      console.error("Erro ao chamar API de logout (ignorado, o logout no app prosseguirá):", e);
    } finally {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
    }
  };

  const value = {
    signIn,
    signOut,
    user,
    token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
