"use client";

import useAuth from "@/hooks/use-auth";
import React, { createContext, useContext } from "react";

type UserType = {
    name: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    userPreferences: {
        enable2FA: boolean;
    };
};

type AuthContextType = {
    user?: UserType;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
};

type SessionType = {
    userId: UserType
}

type UserDataType = {
    message: string
    session: SessionType
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}: {children: React.ReactNode}) => {
    const { data, error, isLoading, isFetching, refetch } = useAuth()
    const resData: UserDataType = data?.data as UserDataType
    const user: UserType = resData?.session?.userId as unknown as UserType || ({} as UserType)

    return (
        <AuthContext.Provider value={{ user, error, isLoading, isFetching, refetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};