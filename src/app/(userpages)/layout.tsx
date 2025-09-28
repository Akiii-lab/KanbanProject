"use client";

import { Loader } from "@/components/Loader/loader";
import { Sidebar } from "@/components/Sidebar";
import { useGlobalStore } from "@/store/globalStore";

export default function UserPagesLayout({ children }: { children: React.ReactNode }) {
    const { globalLoading, globalText } = useGlobalStore();

    if (globalLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                {globalText ? <Loader text={globalText} /> : <Loader />}    
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
