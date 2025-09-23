"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card, CardHeader } from "../ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "../ui/label";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export const LoginComponent = () => {

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
            console.log(data.data);
            setUser(data.data)
            toast.success('Inicio de sesión exitoso');
            router.push('/'); // Redirige a la página principal después del login
        }
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
            <CardHeader className="text-center font-bold">Login</CardHeader>
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
                                            <Input
                                                className="main-input"
                                                placeholder="Enter your password"
                                                type="password"
                                                {...field}
                                            />
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
                            <Label>Don't have an account? </Label>
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