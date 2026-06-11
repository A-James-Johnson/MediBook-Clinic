"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (requiredRole && user.role !== requiredRole) {
        router.push(
          user.role === "DOCTOR"
            ? "/doctor/dashboard"
            : user.role === "PATIENT"
              ? "/patient/dashboard"
              : "/onboarding"
        );
      } else if (!user.role) {
        router.push("/onboarding");
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) return <LoadingSpinner />;
  if (!user || (requiredRole && user.role !== requiredRole)) return null;

  return children;
}
