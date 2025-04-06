"use client";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  ArrowLeft,
  Car,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (activeTab === "signup") {
        const name = formData.get("name") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        // Form validation
        if (!name || !email || !password || !confirmPassword) {
          throw new Error("All fields are required");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        // Firebase user creation
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Optional: Add user data to Firestore
        // await addUserToFirestore(userCredential.user.uid, { name, email })
      } else {
        // Sign in existing user
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        await signInWithEmailAndPassword(auth, email, password);
      }

      // Only redirect if authentication was successful
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Email already in use. Please sign in instead.";
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return error.message || "Authentication failed. Please try again.";
    }
  };

  return (
    <div className="container max-w-md py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-4">
          <Car className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to Carlink
        </h1>
        <p className="text-gray-500">
          Sign in or create an account to get started
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1 p-6">
          <Tabs
            defaultValue="signin"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" disabled={isLoading}>
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" disabled={isLoading}>
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {activeTab === "signup" && (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password *</Label>
                    {activeTab === "signin" && (
                      <Link
                        href="/auth/reset-password"
                        className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                {activeTab === "signup" && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>
                )}
                {activeTab === "signup" && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link
                        href="#"
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        className="text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                )}
                <Button
                  className="mt-2 bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {activeTab === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col p-6 pt-0">
          <div className="mt-4 text-center text-sm">
            {activeTab === "signin" ? (
              <div>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <div>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("signin")}
                  className="text-teal-600 hover:text-teal-700 transition-colors font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
