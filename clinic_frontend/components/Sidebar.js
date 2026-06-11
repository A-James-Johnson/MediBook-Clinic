"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import ThemeToggle from "@/components/ThemeToggle";

const patientLinks = [
  { href: "/patient/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/patient/book", label: "Book Appointment", icon: "📅" },
  { href: "/patient/appointments", label: "My Appointments", icon: "🗓️" },
  { href: "/patient/notifications", label: "Notifications", icon: "🔔", badge: true },
  { href: "/patient/profile", label: "Profile", icon: "👤" },
];

const doctorLinks = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/doctor/appointments", label: "Appointments", icon: "🗓️" },
  { href: "/doctor/availability", label: "Schedule", icon: "📅" },
  { href: "/doctor/notifications", label: "Notifications", icon: "🔔", badge: true },
  { href: "/doctor/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const links = role === "DOCTOR" ? doctorLinks : patientLinks;

  return (
    <aside className="sidebar flex w-64 shrink-0 flex-col">
      <div className="border-b border-app p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-faint">
          {role === "DOCTOR" ? "Doctor Portal" : "Patient Portal"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "sidebar-link-active" : "sidebar-link"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>{link.icon}</span>
                {link.label}
              </span>
              {link.badge && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-app p-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted">Theme</span>
          <ThemeToggle />
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
