"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";

export default function DoctorLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <NotificationProvider>
        <div className="flex min-h-screen bg-app">
          <Sidebar role="DOCTOR" />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </NotificationProvider>
    </ProtectedRoute>
  );
}
