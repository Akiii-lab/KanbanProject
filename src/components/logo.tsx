import Image from "next/image";
import { Label } from "./ui/label";

export const LogoIcon = () => {
    return (
        <div className="flex flex-row justify-center items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <div className="hidden md:flex flex-row gap-1">
                <Label className="font-extrabold text-3xl text-[color:var(--c-violet)]">TASK</Label>
                <Label className="font-bold text-3xl text-[color:var(--c-purple)]">FLOW</Label>
            </div>
        </div>
    );
}