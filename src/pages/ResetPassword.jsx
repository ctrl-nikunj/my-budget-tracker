// ResetPassword.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Reset() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      navigate("/login");
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-liquid-flow-galaxy px-4 py-8">
      <Card className="w-full max-w-md border shadow-slate-600 bg-transparent backdrop-blur-2xl filter border-none ">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-xl md:text-2xl text-slate-200">
            Reset Password
          </CardTitle>
          <CardDescription className="mt-1 text-sm md:text-base text-slate-400">
            Enter your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-4"
          >
            <Label
              htmlFor="password"
              className="text-xl text-white"
            >
              Reset Password
            </Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="
                  w-full 
                  bg-transparent
                  hover:bg-violet-700
                  "
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
