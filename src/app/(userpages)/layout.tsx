import { Sidebar } from "@/components/Sidebar";

export default function UserPagesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
