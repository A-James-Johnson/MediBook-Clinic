"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";

export default function PatientLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="PATIENT">
      <NotificationProvider>
        <div className="flex min-h-screen bg-app">
          <Sidebar role="PATIENT" />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
