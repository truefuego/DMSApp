import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: {
        user_name: string | null;
        user_id: string | null;
    };
    login: (token: string, user_name: string, user_id: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{ user_name: string | null; user_id: string | null }>({ user_name: null, user_id: null });
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            if (storedToken) {
                setToken(storedToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (authToken: string, user_name: string, user_id: string) => {
        try {
            await AsyncStorage.setItem('authToken', authToken);
            setToken(authToken);
            setUser({user_name, user_id});
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error storing auth token:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            setToken(null);
            setUser({ user_name: null, user_id: null });
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error removing auth token:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            user,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};