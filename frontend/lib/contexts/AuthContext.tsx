"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies, getTokenCookie, getUserData } from "../cookies";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        const token = await getTokenCookie();
        const u = await getUserData();
        setUser(u);
        setIsAuthenticated(!!token);
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        await clearAuthCookies();
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
