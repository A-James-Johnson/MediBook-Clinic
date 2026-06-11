"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  clearTokens,
  decodeToken,
  getTokens,
  resolveUserProfile,
  setTokens,
} from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const { access } = getTokens();
    if (!access) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken(access);
    if (!decoded?.user_id) {
      clearTokens();
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { role, profile: userProfile } = await resolveUserProfile(
        decoded.user_id
      );
      setUser({ id: decoded.user_id, role });
      setProfile(userProfile);
      localStorage.setItem("user_id", String(decoded.user_id));
      localStorage.setItem("user_role", role || "");
      if (userProfile) {
        localStorage.setItem("profile_id", String(userProfile.id));
      }
    } catch {
      setUser({ id: decoded.user_id, role: localStorage.getItem("user_role") });
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const completeAuth = async (tokens, knownRole = null) => {
    setTokens(tokens.access, tokens.refresh);

    const decoded = decodeToken(tokens.access);
    const { role, profile: userProfile } = await resolveUserProfile(
      decoded.user_id
    );
    const resolvedRole = role || knownRole;

    setUser({ id: decoded.user_id, role: resolvedRole });
    setProfile(userProfile);
    localStorage.setItem("user_id", String(decoded.user_id));
    localStorage.setItem("user_role", resolvedRole || "");
    if (userProfile) {
      localStorage.setItem("profile_id", String(userProfile.id));
    }

    if (!userProfile) {
      router.push("/onboarding");
    } else if (resolvedRole === "DOCTOR") {
      router.push("/doctor/dashboard");
    } else if (resolvedRole === "PATIENT") {
      router.push("/patient/dashboard");
    } else {
      router.push("/onboarding");
    }
  };

  const login = async (username, password) => {
    const tokens = await authApi.login(username, password);
    await completeAuth(tokens);
  };

  const register = async (type, data) => {
    const result =
      type === "doctor"
        ? await authApi.registerDoctor(data)
        : await authApi.registerPatient(data);

    await completeAuth(
      { access: result.access, refresh: result.refresh },
      result.role
    );
  };

  const loginWithGoogle = async (idToken) => {
    const result = await authApi.googleAuth(idToken, "login");
    await completeAuth(
      { access: result.access, refresh: result.refresh },
      result.role
    );
  };

  const registerWithGoogle = async (idToken, type) => {
    const role = type === "doctor" ? "DOCTOR" : "PATIENT";
    const result = await authApi.googleAuth(idToken, "register", role);
    await completeAuth(
      { access: result.access, refresh: result.refresh },
      result.role
    );
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  const refreshProfile = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    const { role, profile: userProfile } = await resolveUserProfile(
      parseInt(userId, 10)
    );
    setUser({ id: parseInt(userId, 10), role });
    setProfile(userProfile);
    if (userProfile) {
      localStorage.setItem("profile_id", String(userProfile.id));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        loginWithGoogle,
        registerWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
