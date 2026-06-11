"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Script from "next/script";

const GoogleAuthContext = createContext(null);

let gsiInitialized = false;

export function useGoogleAuth() {
  return useContext(GoogleAuthContext);
}

export default function AppGoogleOAuthProvider({ children }) {
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();
  const callbackRef = useRef(() => {});
  const [scriptReady, setScriptReady] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const registerCallback = useCallback((handler) => {
    callbackRef.current = handler;
    return () => {
      callbackRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    if (!clientId || !scriptReady || gsiInitialized) {
      if (gsiInitialized && !initialized) {
        setInitialized(true);
      }
      return;
    }
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        callbackRef.current?.(response);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    gsiInitialized = true;
    setInitialized(true);
  }, [clientId, scriptReady, initialized]);

  if (!clientId) {
    return children;
  }

  return (
    <GoogleAuthContext.Provider
      value={{ registerCallback, scriptReady, clientId, initialized }}
    >
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      {children}
    </GoogleAuthContext.Provider>
  );
}
