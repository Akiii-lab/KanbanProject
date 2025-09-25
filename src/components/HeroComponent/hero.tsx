"use client";

import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/logo";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle, Users, FileText, Clock, BarChart3 } from "lucide-react";
import Footer from "@/components/Footer/footer"; // 👈 Importa el Footer

export const HeroComponent = () => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const fullText =
        "An application for managing student and group projects, from task assignment to final submission.";

    useEffect(() => {
        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + fullText[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, fullText]);

    const features = [
        {
            icon: <BarChart3 className="w-5 h-5" />,
            text: "Create and organize projects by course or subject",
        },
        {
            icon: <Users className="w-5 h-5" />,
            text: "Assign tasks to team members",
        },
        {
            icon: <FileText className="w-5 h-5" />,
            text: "Attach documents and resources related to tasks",
        },
        {
            icon: <Clock className="w-5 h-5" />,
            text: "Set deadlines and receive reminders",
        },
        {
            icon: <CheckCircle className="w-5 h-5" />,
            text: "Track project progress with a Kanban board",
        },
    ];

    return (
        <>
            <style jsx>{`
                @keyframes blinkCursor {
                    0%,
                    50% {
                        opacity: 1;
                    }
                    51%,
                    100% {
                        opacity: 0;
                    }
                }
                .cursor-blink {
                    animation: blinkCursor 1s infinite;
                }
            `}</style>

            <div className="min-h-screen bg-black text-white relative overflow-hidden">
                {/* Fondo principal con degradados */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent" />

                    {/* Orbes decorativos */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500" />
                </div>

                {/* Navegación */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-sm">
                    <div className="flex items-center">
                        <LogoIcon />
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className="text-white hover:text-gray-300 hover:bg-white/10 transition-all duration-300 hover:cursor-pointer"
                            >
                                Log in
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-[color:var(--c-purple)] hover:bg-[color:var(--c-violet)] text-white px-6 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent leading-tight">
                            TaskFlow
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-violet-500 mx-auto rounded-full" />
                    </div>

                    {/* Subtitle */}
                    <div className="text-gray-300 text-lg md:text-xl max-w-3xl mb-12 leading-relaxed min-h-[4rem] flex items-center justify-center">
                        <p className="font-light">
                            {displayedText}
                            <span className="text-purple-400 inline-block cursor-blink">
                                |
                            </span>
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mb-16">
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-400/30"
                            >
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="mb-16 max-w-6xl w-full">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-200">
                            Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {features.map(
                                (feature, index) =>
                                    index < 3 && (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:bg-white/10"
                                        >
                                            <div className="text-purple-400">
                                                {feature.icon}
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                                                {feature.text}
                                            </p>
                                        </div>
                                    )
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
                            {features.map(
                                (feature, index) =>
                                    index >= 3 && (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:bg-white/10"
                                        >
                                            <div className="text-purple-400">
                                                {feature.icon}
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                                                {feature.text}
                                            </p>
                                        </div>
                                    )
                            )}
                        </div>
                    </div>
                </div>

                {/* Detalles decorativos */}
                <div className="absolute top-1/2 left-10 w-3 h-3 bg-purple-500 rounded-full opacity-60 animate-pulse" />
                <div className="absolute top-1/3 right-20 w-2 h-2 bg-violet-400 rounded-full opacity-40 animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-pulse" />
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-violet-300 rounded-full opacity-60 animate-pulse" />
                <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-40 animate-pulse" />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(119, 58, 193, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(119, 58, 193, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>

                <div className="relative z-10 mt-5">
                    <Footer />
                </div>
            </div>
        </>
    );
};
