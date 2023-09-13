import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleLogin  = (token, userId) => {
        setToken(token);
        setUserId(userId);
    }

    const logout = () => {
        setToken(null);
        setUserId(null);
    }

    return (
        <AuthContext.Provider value={{
            handleLogin,
            logout,
            token,
            userId
        }}>
            {children}
        </AuthContext.Provider>
    )
}