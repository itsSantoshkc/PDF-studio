import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate({ to: "/" });
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-neo-yellow neo-grid flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="border-4 border-black bg-white p-8 shadow-neo-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Zap className="h-7 w-7 text-neo-yellow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-tighter">PDF Studio</h1>
                <p className="font-mono text-xs text-muted-foreground">Welcome back</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="border-3 border-black bg-neo-pink p-4 text-white font-mono text-sm uppercase tracking-wider">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="inline-block w-5 h-5 border-3 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/register"
                  className="font-mono text-sm text-muted-foreground hover:text-black hover:underline uppercase tracking-wider"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center border-l-4 border-black bg-white neo-dots">
        <div className="max-w-md p-12">
          <div className="border-4 border-black bg-neo-blue p-8 shadow-neo-lg">
            <h2 className="text-4xl font-bold uppercase text-white mb-4">
              Process PDFs like a pro
            </h2>
            <p className="font-mono text-white/80">
              Upload, edit, merge, and enhance your documents with powerful AI-driven tools.
            </p>
          </div>
          <div className="mt-6 border-4 border-black bg-neo-pink p-6 shadow-neo">
            <p className="font-mono text-white text-sm uppercase tracking-wider">
              // TODO: add more features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  component: Login,
});
