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
import { RegisterFormData, registerSchema } from "@/schemas";
import { Card, CardHeader } from "../ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "../ui/label";
import { LogoIcon } from "../logo";
import { useState } from "react";
import { Loader } from "../Loader/loader";

export const SingUpComponent = () => {
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState<string | null>(null);
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    // prueba
    async function onSubmit(values: RegisterFormData) {
        setLoading(true);
        setLoadingText('Signing up...');
        const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword
            }),
        });

        const data = await res.json();
        if (!data.ok) {
            toast.error(data.error || 'Error al registrar el usuario');
        } else {
            toast.success('Registro de usuario exitoso');
        }
        setLoading(false);
    }

    if(loading){
        return (
            <div className="flex items-center justify-center h-screen">
                {loadingText ? <Loader text={loadingText} /> : <Loader />}
            </div>
        )
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
                REGISTER
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
                        <div className="container-1">
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="group">
                                        <FormLabel style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="main-input"
                                                placeholder="Confirm your password"
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
                            Sing Up
                        </Button>
                        <div className="text-center flex flex-row gap-1">
                            <Label>Do have an account? </Label>
                            <Link href="/login" className="text-sm font-bold [color:var(--c-violet)] hover:underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </Card>
    );
};