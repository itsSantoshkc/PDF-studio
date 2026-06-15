import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Lock, Zap, Check, AlertCircle } from "lucide-react";

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwords.new_password !== passwords.confirm_password) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      await authApi.changePassword(passwords.old_password, passwords.new_password);
      setMessage({ type: "success", text: "Password updated successfully" });
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch {
      setMessage({ type: "error", text: "Failed to update password" });
    }
  };

  return (
    <div className="min-h-screen bg-neo-purple neo-grid">
      <header className="flex items-center gap-4 px-6 py-4 border-b-4 border-black bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <Zap className="h-5 w-5 text-neo-purple" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl space-y-8">
        <Card className="neo-card-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neo-yellow border-2 border-black flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <CardTitle>Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-black p-3 bg-gray-50">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-bold">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div className="border-2 border-black p-3 bg-gray-50">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-mono text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="border-2 border-black p-3 bg-neo-yellow">
              <Label className="text-xs">Storage Used</Label>
              <p className="font-bold">
                {user?.storage_used_mb} MB / {user?.storage_limit_mb} MB
              </p>
              <div className="mt-2 h-3 border-2 border-black bg-white">
                <div
                  className="h-full bg-black transition-all"
                  style={{ width: `${user?.storage_percentage ?? 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="neo-card-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neo-blue border-2 border-black flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <CardTitle>Change Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {message.text && (
                <div
                  className={cn(
                    "flex items-center gap-2 p-4 border-3 border-black font-mono text-sm uppercase tracking-wider",
                    message.type === "error"
                      ? "bg-neo-pink text-white"
                      : "bg-neo-green"
                  )}
                >
                  {message.type === "error" ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="old_password">Current Password</Label>
                <Input
                  id="old_password"
                  type="password"
                  value={passwords.old_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, old_password: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, new_password: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwords.confirm_password}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, confirm_password: e.target.value }))
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/settings")({
  component: Settings,
});
