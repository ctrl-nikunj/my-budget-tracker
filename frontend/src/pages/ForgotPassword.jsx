import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { handleForgotPassword } from "@/lib/auth/forgot";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email };
      const { res, data } = await handleForgotPassword(payload);
      if (res.ok) toast.success(data.message);
      else toast.error(data.error || "Something went wrong.");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Failed to send reset link. Please try again.");
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
            Forgot Password?
          </CardTitle>
          <CardDescription className="mt-1 text-sm md:text-base text-zinc-400">
            Enter your e-mail address for password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Label
              htmlFor="email"
              className="text-zinc-500"
            >
              E-mail
            </Label>
            <Input
              type="email"
              value={email}
              placeholder="user@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 caret-slate-200 text-gray-200 border-transparent"
            />
            <Button
              type="submit"
              className="
                  w-full 
                  text-zinc-900
                  bg-slate-200/20
                  hover:bg-slate-800
                  hover:text-slate-200
                  "
            >
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
