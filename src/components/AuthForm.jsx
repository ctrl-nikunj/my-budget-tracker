import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, registerUser } from "@/lib/auth";
import { toast } from "sonner"; // Make sure you have a toast hook
import { Separator } from "./ui/seperator";
import { useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import "@/App.css";
import PasswordStrengthBar from "@/components/password";

export default function AuthForm({ mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password };
      if (mode === "register") payload.name = name;

      const data =
        mode === "login"
          ? await loginUser(payload)
          : await registerUser(payload);

      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Success!", {
        description: "You have logged in.",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error(`${mode === "login" ? "Login" : "Rgisteration"} failed`, {
        description: "Invalid credentials.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (mode === "register" && nameRef.current) {
      nameRef.current.focus();
    } else if (mode === "login" && emailRef.current) {
      emailRef.current.focus();
    }
  }, [mode]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-liquid-flow-galaxy px-4 py-8">
      <Card className="w-full max-w-md border shadow-slate-600 bg-transparent backdrop-blur-2xl filter border-none ">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-xl md:text-2xl text-slate-200">
            {mode === "login" ? "Welcome Back!" : "Create an Account"}
          </CardTitle>

          <CardDescription className="mt-1 text-sm md:text-base text-slate-400">
            {mode === "login"
              ? "Sign in to access your account"
              : "Join us and start managing your finances"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-4 pb-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {mode === "register" && (
              <div>
                <Label
                  htmlFor="name"
                  className="text-slate-200"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 caret-slate-200 text-gray-200 border-transparent"
                  ref={nameRef}
                />
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-slate-200"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="user@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 caret-slate-200 text-gray-200 border-transparent"
                ref={emailRef}
              />
            </div>

            <div>
              <div className="grid gap-2">
                <div className="flex items-center text-slate-200 mb-1">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 text-slate-400 hover:underline mt-1"
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 caret-slate-200 text-gray-200 border-transparent"
              />
              <PasswordStrengthBar password={password} />
            </div>
            <Button
              type="submit"
              className="
                  w-full 
                  bg-transparent
                  hover:bg-violet-700
                  "
            >
              {mode === "login" ? "Login" : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 justify-center items-center">
          <Separator className="mb-4 bg-slate-600" />
          <Button
            className="w-full bg-transparent text-slate-200 hover:bg-violet-700 hover:text-slate-200  border-none"
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={20} />
            <span className="text-sm">Sign in with Google</span>
          </Button>

          <CardAction className="mt-6 text-stone-300 text-xs align-items-center">
            {mode === "login"
              ? "Not registered yet?"
              : "Have an existing account?"}
            <Link to={mode === "login" ? "/register" : "/login"}>
              <Button
                variant="link"
                className="text-slate-400 text-xs"
              >
                {mode === "login" ? "Register" : "Login"}
              </Button>
            </Link>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
