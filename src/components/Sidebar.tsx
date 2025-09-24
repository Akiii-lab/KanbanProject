"use client";

import { FolderKanbanIcon, HomeIcon, LogOutIcon, PanelLeftCloseIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Label } from "./ui/label";

export const Sidebar = () => {
    const { user, clearUser } = useUserStore();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        const res = await fetch('/api/user/logout', {
            method: 'POST',
        });

        if (!res.ok) {
            toast.error('Error al cerrar sesión');
            return;
        }
        clearUser();
        window.location.reload();
    };

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <div className={`flex h-screen ${collapsed ? 'w-20' : 'w-max'} p-4 transition-all duration-300`}>
            <Card className={`p-6 bg-[color:var(--custom-dark)] text-white h-full ${collapsed ? 'w-16' : 'w-max'} transition-all duration-300`}>
                <aside className="w-full h-full">
                    <nav className="flex flex-col gap-4 h-full">
                        <div className="flex flex-col justify-between items-center h-full">
                            <div className="flex flex-col gap-6">
                                <div className="group flex flex-row gap-2 items-center hover:text-[color:var(--c-violet)] hover:cursor-pointer transition-colors">
                                    <Link
                                        href="/dashboard"
                                        className={`font-bold transition-colors hover:text-[color:var(--c-violet)] ${collapsed ? 'hidden' : ''} ${isActive('/dashboard') ? 'text-[color:var(--c-purple)]' : 'text-white'} hover:text-[color:var(--c-violet)]`}
                                    >
                                        Dashboard
                                    </Link>
                                    <HomeIcon size={25} className={`${isActive('/dashboard') ? 'text-[color:var(--c-purple)]' : ''} group-hover:text-[color:var(--c-violet)] transition-colors`} />
                                </div>
                                <div className="group flex flex-row gap-2 items-center hover:text-[color:var(--c-purple)] hover:cursor-pointer transition-colors">
                                    <Link
                                        href="/projects"
                                        className={`font-bold transition-colors hover:text-[color:var(--c-violet)] ${collapsed ? 'hidden' : ''} ${isActive('/projects') ? 'text-[color:var(--c-purple)]' : 'text-white'} hover:text-[color:var(--c-violet)]`}
                                    >
                                        Projects
                                    </Link>
                                    <FolderKanbanIcon size={25} className={`group-hover:text-[color:var(--c-violet)] transition-colors ${isActive('/projects') ? 'text-[color:var(--c-purple)]' : ''}`} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 items-center border-t pt-4 w-full">
                                <div className="flex flex-row gap-2 items-center hover:cursor-pointer hover:text-[color:var(--c-violet)] transition-colors" onClick={() => setCollapsed(!collapsed)}>
                                    <PanelLeftCloseIcon size={25} className={collapsed ? 'rotate-180 transition-transform' : 'transition-transform'} />
                                </div>
                                <div className="flex flex-col gap-2 items-center hover:cursor-pointer hover:text-[color:var(--c-violet)] transition-colors">
                                    <UserIcon size={25} className="size-8" />
                                    {!collapsed && <Label className="text-foreground">{user?.username}</Label>}
                                </div>
                                <LogOutIcon
                                    size={25}
                                    onClick={handleLogout}
                                    className="hover:cursor-pointer hover:text-[color:var(--c-violet)] transition-colors"
                                />
                            </div>
                        </div>
                    </nav>
                </aside>
            </Card>
        </div>
    );
};
