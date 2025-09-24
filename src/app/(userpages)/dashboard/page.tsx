"use client";
import { Loader } from "@/components/Loader/loader";
import { useState } from "react";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
            
        )
    }
    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
        </div>
    );
}