"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="nav-bar">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-heading">
            MediBook<span className="text-teal-600 dark:text-teal-400"> Clinic</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "PATIENT" && (
                <Link
                  href="/patient/dashboard"
                  className="text-sm font-medium text-body hover:text-teal-600 dark:hover:text-teal-400"
                >
                  Dashboard
                </Link>
              )}
              {user.role === "DOCTOR" && (
                <Link
                  href="/doctor/dashboard"
                  className="text-sm font-medium text-body hover:text-teal-600 dark:hover:text-teal-400"
                >
                  Dashboard
                </Link>
              )}
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-body hover:text-teal-600 dark:hover:text-teal-400"
              >
                Login
              </Link>
              <Link href="/register/patient" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
