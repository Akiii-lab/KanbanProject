import { FolderKanbanIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";

export const Sidebar = () => (
    <div className="flex h-screen w-max p-4">
        <Card className="w-max p-6 bg-[color:var(--custom-dark)] text-white">
            <aside className="w-full">
                <nav className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                        <Link href="/dashboard" className="text-white font-bold hover:text-[color:var(--c-violet)] transition-colors">Dashboard</Link>
                        <HomeIcon size={20} />
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                        <Link href="/projects" className="text-white font-bold hover:text-[color:var(--c-violet)] transition-colors">Projects</Link>
                        <FolderKanbanIcon size={20} />
                    </div>
                </nav>
            </aside>
        </Card>
    </div>


);
