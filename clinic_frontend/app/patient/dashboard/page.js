"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { appointmentsApi, formatDate, formatTime } from "@/lib/api";

export default function PatientDashboard() {
  const { profile } = useAuth();
  const { notifications, unreadCount } = useNotificationContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const unreadNotifications = notifications.filter((n) => !n.is_read).slice(0, 3);

  useEffect(() => {
    async function load() {
      try {
        const appts = await appointmentsApi.list();
        setAppointments(
          appts.filter((a) => a.patient === profile?.id).slice(0, 5)
        );
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    if (profile?.id) load();
  }, [profile]);

  if (loading) return <LoadingSpinner />;

  const upcoming = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
        <p className="text-muted">Welcome back! Here&apos;s your overview.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Upcoming Appointments"
          value={upcoming.length}
          icon="📅"
          color="teal"
        />
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon="🗓️"
          color="blue"
        />
        <StatCard
          title="Unread Notifications"
          value={unreadCount}
          icon="🔔"
          color="amber"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">
              Recent Appointments
            </h2>
            <Link
              href="/patient/appointments"
              className="text-sm link-teal"
            >
              View all
            </Link>
          </div>

          {appointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No appointments yet.{" "}
              <Link href="/patient/book" className="link-teal">
                Book one now
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="list-row"
                >
                  <div>
                    <p className="text-sm font-medium text-heading">
                      {formatDate(appt.appointment_date)}
                    </p>
                    <p className="text-xs text-muted">
                      {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/patient/book"
              className="flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4 transition hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-900/30 dark:hover:bg-teal-900/50"
            >
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-medium text-teal-900 dark:text-teal-200">Book Appointment</p>
                <p className="text-sm text-teal-700 dark:text-teal-300">
                  Find a doctor and schedule a visit
                </p>
              </div>
            </Link>
            <Link
              href="/patient/notifications"
              className="action-tile"
            >
              <span className="text-2xl">🔔</span>
              <div>
                <p className="font-medium text-heading">Notifications</p>
                <p className="text-sm text-muted">
                  {unreadCount} unread messages
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
