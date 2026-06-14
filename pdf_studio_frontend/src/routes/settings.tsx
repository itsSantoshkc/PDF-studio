import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

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
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-4 py-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Storage Used</Label>
              <p className="font-medium">
                {user?.storage_used_mb} MB / {user?.storage_limit_mb} MB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {message.text && (
                <div
                  className={`p-3 text-sm rounded-md ${
                    message.type === "error"
                      ? "text-destructive bg-destructive/10"
                      : "text-green-600 bg-green-50"
                  }`}
                >
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

              <Button type="submit">Update Password</Button>
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
