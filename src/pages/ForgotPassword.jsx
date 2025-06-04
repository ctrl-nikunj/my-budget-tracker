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
import { useState } from "react";
import { toast } from "sonner";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (res.ok) toast.success(data.message);
      else toast.error(data.error || "Something went wrong.");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-liquid-flow-galaxy px-4 py-8">
      <Card className="w-full max-w-md border shadow-slate-600 bg-transparent backdrop-blur-2xl filter border-none ">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-xl md:text-2xl text-slate-200">
            Forgot Password?
          </CardTitle>
          <CardDescription className="mt-1 text-sm md:text-base text-slate-400">
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
              className="text-slate-200"
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
                  bg-transparent
                  hover:bg-violet-700
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
