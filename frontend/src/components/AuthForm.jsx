import { useState, useRef, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
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
import { loginUser } from "@/lib/auth/login";
import { registerUser } from "@/lib/auth/register";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { DollarSign, Eye, EyeClosed, LoaderIcon } from "lucide-react";
import "@/App.css";
import PasswordStrengthBar from "@/components/password";
import useTypingPlaceholder from "@/hooks/useTypingPlaceholder";
import successSound from "@/assets/success-83493.mp3";
import errorSound from "@/assets/error-08-206492.mp3";

async function authAction(
  prevState,
  formData,
  mode,
  navigate,
  playSound,
  successAudioRef,
  errorAudioRef
) {
  const payload = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  if (mode === "register") payload.name = formData.get("name");

  try {
    const data =
      mode === "login" ? await loginUser(payload) : await registerUser(payload);

    toast.success("Success!", {
      description: "Logged in successfully.",
      duration: 3000,
    });
    playSound(successAudioRef);
    navigate("/dashboard");
    return { success: true };
  } catch (err) {
    console.error(err);
    toast.error(`${mode === "login" ? "Login" : "Registration"} failed`, {
      description: "Invalid credentials.",
      duration: 3000,
    });
    playSound(errorAudioRef);
    return { success: false, error: err.message };
  }
}

export default function AuthForm({ mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const successAudioRef = useRef(null);
  const errorAudioRef = useRef(null);

  useEffect(() => {
    successAudioRef.current = new Audio(successSound);
    errorAudioRef.current = new Audio(errorSound);
    successAudioRef.current.volume = 0.7;
    errorAudioRef.current.volume = 0.7;
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const [eye, setEye] = useState(false);

  const [formState, formAction] = useActionState(
    (prev, formData) =>
      authAction(
        prev,
        formData,
        mode,
        navigate,
        playSound,
        successAudioRef,
        errorAudioRef
      ),
    { success: null, error: null }
  );

  useTypingPlaceholder(nameRef, "John Doe", 100);
  useTypingPlaceholder(emailRef, "user@example.com", 100);
  useTypingPlaceholder(passwordRef, "••••••••••••", 100);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (mode === "register" && nameRef.current) {
      nameRef.current.focus();
    } else if (mode === "login" && emailRef.current) {
      emailRef.current.focus();
    }
  }, [mode]);

  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => {
        console.error("Error playing sound:", e);
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4 py-8">
      <Card
        className={`w-full max-w-md border shadow-slate-600 bg-white/10 backdrop-blur-2xl filter border-white/20 transform transition-all duration-700 rounded-2xl shadow-2xl ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <CardHeader className="px-6 pt-6 bg-zinc-100">
          <header>
            <div className="max-w-6xl pb-2">
              <div className="flex items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <img src="./Logo.png"></img>
                </div>
                <span className="text-2xl font-semibold text-zinc-700">
                  Paylert
                </span>
              </div>
            </div>
          </header>
          <CardTitle className="text-xl md:text-2xl text-zinc-600">
            {mode === "login" ? "Welcome Back!" : "Create an Account"}
          </CardTitle>

          <CardDescription className="mt-1 text-sm md:text-base text-zinc-400">
            {mode === "login"
              ? "Sign in to access your account"
              : "Join us and start managing your finances"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-4 pb-2">
          <form
            action={formAction}
            className="space-y-4"
          >
            {mode === "register" && (
              <div>
                <Label
                  htmlFor="name"
                  className="text-zinc-500"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 caret-slate-200 text-zinc-700 border-transparent"
                  ref={nameRef}
                />
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-zinc-500"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 caret-slate-200 text-zinc-700 border-transparent"
                ref={emailRef}
              />
            </div>

            <div>
              <div className="grid gap-2">
                <div className="flex items-center text-zinc-500 mb-1">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 text-zinc-400 hover:underline mt-1"
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
              </div>
              <div className="mb-4 flex gap-2">
                <Input
                  id="password"
                  name="password"
                  type={eye ? "text" : "password"}
                  value={password}
                  ref={passwordRef}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 caret-slate-200 text-zinc-700 border-transparent placeholder-slate-300"
                />
                <span
                  className="px-1 py-1 rounded-md flex justify-around items-center hover:bg-zinc-300"
                  onClick={() => setEye(!eye)}
                >
                  {eye ? <Eye /> : <EyeClosed />}
                </span>
              </div>
              {mode === "register" && (
                <PasswordStrengthBar password={password} />
              )}
            </div>

            <SubmitButton mode={mode} />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 justify-center items-center">
          <Separator className="my-4 bg-zinc-200/80" />
          <Button
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-slate-800 hover:text-slate-200  border-none"
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={20} />
            <span className="text-sm">Sign in with Google</span>
          </Button>

          <CardAction className="mt-6 text-muted-foreground text-xs flex items-center justify-center">
            {mode === "login"
              ? "Not registered yet?"
              : "Have an existing account?"}
            <Link to={mode === "login" ? "/register" : "/login"}>
              <Button
                variant="link"
                className="text-zinc-500 text-xs"
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

function SubmitButton({ mode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-zinc-100 text-zinc-900 bg-slate-200/20 hover:bg-slate-800 hover:text-slate-200"
      disabled={pending}
    >
      {pending ? (
        <>
          {mode === "login" ? "Logging in..." : "Registering..."}
          <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />
        </>
      ) : mode === "login" ? (
        "Login"
      ) : (
        "Register"
      )}
    </Button>
  );
}
