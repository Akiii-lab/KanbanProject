"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader } from "../ui/card";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { Loader } from "../Loader/loader";

export default function OnboardingComponent() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/firstlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include", 
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.data); 
        toast.success("User saved successfully.");
        window.location.href = "/";
      } else {
        toast.error(data?.error || "Error saving user"); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="flex flex-col items-center justify-center p-5 w-full max-w-sm mx-auto bg-black border border-[color:var(--c-purple)]">
      <CardHeader className="text-center text-xl font-bold w-full">
        Welcome to Onboarding!
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <span className="mb-2 text-muted-foreground text-center">
          How would you like us to call you?
        </span>
        <Input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <Button
          type="submit"
          className="w-full"
        >
          Save
        </Button>
      </form>
    </Card>
  );
}
