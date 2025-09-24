"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingComponent() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // <-- Aquí va fetch
      const res = await fetch("/api/user/firstlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include", // enviar cookies de sesión
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard"); // redirige si todo salió bien
      } else {
        setMessage(data?.error || "Error al guardar."); // mostrar error
      }
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-white">¡Bienvenido!</h1>
      <p className="mb-4 text-muted-foreground">
        ¿Cómo quieres que te llamemos?
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-xs">
        <input
          type="text"
          placeholder="Tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
    </div>
  );
}
