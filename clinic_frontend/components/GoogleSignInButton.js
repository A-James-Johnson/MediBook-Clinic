"use client";

import { useEffect, useRef } from "react";
import { useGoogleAuth } from "@/components/GoogleOAuthProvider";

export default function GoogleSignInButton({
  label = "Continue with Google",
  disabled = false,
  onSuccess,
  onError,
}) {
  const buttonRef = useRef(null);
  const renderedRef = useRef(false);
  const googleAuth = useGoogleAuth();

  useEffect(() => {
    if (!googleAuth?.registerCallback) return undefined;

    return googleAuth.registerCallback((response) => {
      if (response?.credential) {
        onSuccess?.(response.credential);
        return;
      }
      onError?.("Google sign-in did not return a credential.");
    });
  }, [googleAuth, onSuccess, onError]);

  useEffect(() => {
    if (
      !googleAuth?.initialized ||
      !buttonRef.current ||
      !window.google?.accounts?.id ||
      renderedRef.current
    ) {
      return;
    }

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: label === "Continue with Google" ? "continue_with" : "signin_with",
      width: 360,
    });
    renderedRef.current = true;

    const currentButton = buttonRef.current;
    return () => {
      renderedRef.current = false;
      if (currentButton) {
        currentButton.innerHTML = "";
      }
    };
  }, [googleAuth?.initialized, label]);

  if (!googleAuth?.clientId) {
    return null;
  }

  return (
    <div
      ref={buttonRef}
      className={`flex justify-center ${disabled ? "pointer-events-none opacity-50" : ""}`}
    />
  );
}
