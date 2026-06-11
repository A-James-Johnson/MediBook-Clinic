"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Alert from "@/components/Alert";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/context/AuthContext";

const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || form.username).trim();
    const password = String(formData.get("password") || form.password);

    if (!username || !password) {
      setError("Please enter your username/email and password.");
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken) => {
    setError("");
    setGoogleLoading(true);

    try {
      await loginWithGoogle(idToken);
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="card">
          <h1 className="text-2xl font-bold text-heading">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to your MediBook account
          </p>

          <Alert message={error} onClose={() => setError("")} />

          {googleEnabled ? (
            <>
              <div className="mt-6">
                <GoogleSignInButton
                  disabled={isBusy}
                  onSuccess={handleGoogleLogin}
                  onError={setError}
                />
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-app" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="divider-label px-3">or sign in with email</span>
                </div>
              </div>
            </>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Username or Email</label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                required
                className="input-field"
                placeholder="Enter your username or email"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="input-field"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button type="submit" disabled={isBusy} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register/patient" className="link-teal">
              Register as Patient
            </Link>{" "}
            or{" "}
            <Link href="/register/doctor" className="link-teal">
              Doctor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
