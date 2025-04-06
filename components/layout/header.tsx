"use client";

import { useEffect, useState } from "react";
import {
  Car,
  MessageSquare,
  CircleUserRound,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const [user, setUser] = useState<{
    displayName: string | null;
    email: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      }
      setIsLoading(false);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Render auth buttons or user profile based on auth state
  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="w-[120px]"></div>; // Empty space with same width as buttons to prevent layout shift
    }

    if (!user) {
      return (
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-teal-600"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-teal-600 hover:bg-teal-700">Sign Up</Button>
          </Link>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarFallback className="bg-teal-100 text-teal-600">
                {user.displayName ? (
                  getInitials(user.displayName)
                ) : (
                  <CircleUserRound className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.displayName && (
                <p className="font-medium">{user.displayName}</p>
              )}
              {user.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="cursor-pointer flex w-full items-center"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-5 w-5 text-teal-500" />
          <Link href="/">Carlink</Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/vehicles"
            className="text-sm font-medium hover:text-teal-500 transition-colors"
          >
            Browse Auctions
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-teal-500 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/sell"
            className="text-sm font-medium hover:text-teal-500 transition-colors"
          >
            Sell Vehicle
          </Link>
          <Link
            href="/assistant"
            className="text-sm font-medium hover:text-teal-500 transition-colors flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </Link>
        </nav>
        {renderAuthSection()}
      </div>
    </header>
  );
}
