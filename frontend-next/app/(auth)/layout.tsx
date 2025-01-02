import React from "react";

export default function AuthLayout({children}: { children: React.ReactNode}){
    return (
        <div className="w-full h-auto px-2">
            <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-[450] mx-auto h-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}