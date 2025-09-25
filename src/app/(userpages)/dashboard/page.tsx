"use client";
import { Loader } from "@/components/Loader/loader";
import { useState } from "react";

export default function DashboardPage() {
    const [loading] = useState(true);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
            
        )
    }
    
    return (
        <>
        </>
    );
}