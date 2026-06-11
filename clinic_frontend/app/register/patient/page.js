"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Alert from "@/components/Alert";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/context/AuthContext";

const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export default function RegisterPatientPage() {
  const { register, registerWithGoogle } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      username: String(formData.get("username") || form.username).trim(),
      email: String(formData.get("email") || form.email).trim(),
      password: String(formData.get("password") || form.password),
      phone_number: String(formData.get("phone_number") || form.phone_number).trim(),
    };

    try {
      await register("patient", payload);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (idToken) => {
    setError("");
    setGoogleLoading(true);

    try {
      await registerWithGoogle(idToken, "patient");
    } catch (err) {
      setError(err.message || "Google registration failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <div className="mx-auto max-w-md px-4 py-16">
        <div className="card">
          <h1 className="text-2xl font-bold text-heading">
            Patient Registration
          </h1>
          <p className="mt-1 text-sm text-muted">
            Create your account to book appointments
          </p>

          <Alert message={error} onClose={() => setError("")} />

          <div className="mt-6">
            <GoogleSignInButton
              disabled={isBusy}
              onSuccess={handleGoogleRegister}
              onError={setError}
            />
          </div>

          {googleEnabled ? (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-app" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="divider-label px-3">
                  or register with email
                </span>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "username", label: "Username", type: "text", autoComplete: "username" },
              { name: "email", label: "Email", type: "email", autoComplete: "email" },
              { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
              { name: "phone_number", label: "Phone Number", type: "tel", autoComplete: "tel" },
            ].map((field) => (
              <div key={field.name}>
                <label className="label-text">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  required
                  className="input-field"
                  value={form[field.name]}
                  onChange={(e) =>
                    setForm({ ...form, [field.name]: e.target.value })
                  }
                />
              </div>
            ))}

            <button type="submit" disabled={isBusy} className="btn-primary w-full">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="link-teal"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
