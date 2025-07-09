// ResetPassword.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4 py-8">
      <Card
        className={`w-full max-w-md border shadow-slate-600 bg-white/10 backdrop-blur-2xl filter border-white/20 transform transition-all duration-700 rounded-2xl shadow-2xl ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-xl md:text-2xl text-zinc-600">
            Reset Password
          </CardTitle>
          <CardDescription className="mt-1 text-sm md:text-base text-zinc-400">
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
              className="text-zinc-500"
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
                  text-zinc-900
                  bg-zinc-200/30
                  hover:bg-slate-800
                  hover:text-slate-200
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
