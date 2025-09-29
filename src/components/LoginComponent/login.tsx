"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/schemas";
import { useUserStore } from "@/store/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { LogoIcon } from "../logo";
import { useState } from "react";
import { Loader } from "../Loader/loader";
import { LoggedUser } from "@/types/user";
import { Eye, EyeClosed } from "lucide-react";


export const LoginComponent = () => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const [stateEye, setStateEye] = useState(false);
    const router = useRouter();
    const { setUser } = useUserStore();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormData) => {
        try {
            setLoading(true);
            setLoadingText("Sign in...");
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });
            const data = await res.json();
            if (!data.ok) {
                toast.error('Error al iniciar sesión');
            } else {
                const Logeduser: LoggedUser = data.data;
                setUser(Logeduser);
                toast.success('Inicio de sesión exitoso');
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                {loadingText ? <Loader text={loadingText} /> : <Loader />}
            </div>
        );
    }

    return (
        <Card
            className="w-md p-6 shadow-lg"
            style={{
                background: '#000',
                border: '2px solid #773ac1',
                boxShadow: '0 0 16px 2px #773ac1',
                borderRadius: 'var(--radius, 0.625rem)',
            }}
        >
            <CardHeader className="text-center font-bold">
                <LogoIcon />
                LOGIN
            </CardHeader>
            <div className="form">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="group">
                                    <FormLabel style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="main-input"
                                            placeholder="Enter your email"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="container-1">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="group">
                                        <FormLabel style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative w-full">
                                                <Input
                                                    className="main-input"
                                                    placeholder="Enter your password"
                                                    type={stateEye ? 'text' : 'password'}
                                                    {...field}
                                                />
                                                <Button type="button" variant={"ghost"} className="hover:bg-transparent absolute right-3 hover:cursor-pointer   top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setStateEye(!stateEye)}>
                                                    {stateEye ? <Eye size={20} /> : <EyeClosed size={20} />}
                                                </Button>
                                            </div>

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="submit w-full hover:cursor-pointer"
                            style={{
                                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                                background: "black",
                                border: "2px solid #773ac1",
                                color: "#fff",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#773ac1';
                                e.currentTarget.style.color = 'foreground';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'black';
                                e.currentTarget.style.color = '#fff';
                            }}
                        >
                            Sign In
                        </Button>
                        <div className="text-center flex flex-row gap-1">
                            <Label>Don&apos;t have an account? </Label>
                            <Link href="/register" className="text-sm font-bold [color:var(--c-violet)] hover:underline">
                                Register
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </Card>
    );
};