"use client";

import { FolderKanbanIcon, HomeIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const Sidebar = () => {
    const { clearUser } = useUserStore();
    const router = useRouter();
    const handleLogout = async () => {
        const res = await fetch('/api/user/logout', {
            method: 'POST',
        });

        if (!res.ok) {
            toast.error('Error al cerrar sesión');
            return;
        }
        clearUser();
        router.push('/login');
    }

    return (
        <div className="flex h-screen w-max p-4">
            <Card className="w-max p-6 bg-[color:var(--custom-dark)] text-white h-full">
                <aside className="w-full h-full">
                    <nav className="flex flex-col gap-4 h-full">
                        <div className="flex flex-col justify-between items-center h-full">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-row gap-2 items-center">
                                    <Link href="/dashboard" className="text-white font-bold hover:text-[color:var(--c-violet)] transition-colors">Dashboard</Link>
                                    <HomeIcon size={20} />
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Link href="/projects" className="text-white font-bold hover:text-[color:var(--c-violet)] transition-colors">Projects</Link>
                                    <FolderKanbanIcon size={20} />
                                </div>
                            </div>
                            <div>
                                <LogOutIcon
                                    size={20}
                                    onClick={handleLogout}
                                    className="hover:cursor-pointer hover:text-[color:var(--c-violet)] transition-colors"
                                />
                            </div>
                        </div>
                    </nav>
                </aside>
            </Card>
        </div>
    )
};
