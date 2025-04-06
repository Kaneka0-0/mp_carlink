"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { User, CircleUserRound, LogOut, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileComponent() {
  const [user, setUser] = useState<{
    displayName: string | null;
    email: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
        });
      } else {
        setUser(null);
        // Redirect to auth page if not logged in
        router.push("/auth");
      }
      setIsLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20 bg-teal-100">
            <AvatarFallback className="text-teal-600 text-2xl">
              {user?.displayName ? (
                getInitials(user.displayName)
              ) : (
                <CircleUserRound className="h-10 w-10" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold">
              {user?.displayName || "User"}
            </h2>
            <p className="text-gray-500 flex items-center justify-center gap-1">
              <User className="h-4 w-4" />
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Email</span>
              <span className="text-gray-500">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Display Name</span>
              <span className="text-gray-500">
                {user?.displayName || "Not set"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing Out
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
