import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(formData);
      navigate({ to: "/" });
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neo-green neo-grid flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="border-4 border-black bg-white p-8 shadow-neo-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Zap className="h-7 w-7 text-neo-green" />
              </div>
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-tighter">PDF Studio</h1>
                <p className="font-mono text-xs text-muted-foreground">Create your account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="border-3 border-black bg-neo-pink p-4 text-white font-mono text-sm uppercase tracking-wider">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm">Confirm Password</Label>
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="inline-block w-5 h-5 border-3 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="font-mono text-sm text-muted-foreground hover:text-black hover:underline uppercase tracking-wider"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center border-l-4 border-black bg-white neo-stripe">
        <div className="max-w-md p-12">
          <div className="border-4 border-black bg-neo-yellow p-8 shadow-neo-lg">
            <h2 className="text-4xl font-bold uppercase mb-4">
              Join the future
            </h2>
            <p className="font-mono text-sm">
              Start processing PDFs with AI-powered tools today.
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="border-4 border-black bg-neo-pink p-4 shadow-neo flex-1">
              <p className="font-bold text-white text-2xl">100+</p>
              <p className="font-mono text-xs text-white/80 uppercase">Features</p>
            </div>
            <div className="border-4 border-black bg-neo-blue p-4 shadow-neo flex-1">
              <p className="font-bold text-white text-2xl">24/7</p>
              <p className="font-mono text-xs text-white/80 uppercase">Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/register")({
  component: Register,
});
