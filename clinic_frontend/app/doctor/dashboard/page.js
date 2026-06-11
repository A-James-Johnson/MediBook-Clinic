"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import {
  appointmentsApi,
  availabilityApi,
  formatDate,
  formatTime,
} from "@/lib/api";

export default function DoctorDashboard() {
  const { profile } = useAuth();
  const { unreadCount } = useNotificationContext();
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [appts, avail] = await Promise.all([
          appointmentsApi.list(),
          availabilityApi.list(),
        ]);
        const myAppts = appts.filter((a) => a.doctor === profile?.id);
        setAppointments(myAppts.slice(0, 5));
        setAvailability(
          avail.filter((a) => a.doctor === profile?.id && a.is_available)
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

  const pending = appointments.filter((a) => a.status === "PENDING");
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(
    (a) => a.appointment_date === today
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading">
          Doctor Dashboard
        </h1>
        <p className="text-muted">
          {profile?.specialization} · {profile?.qualification}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Requests"
          value={pending.length}
          icon="⏳"
          color="amber"
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppts.length}
          icon="📅"
          color="teal"
        />
        <StatCard
          title="Available Slots"
          value={availability.length}
          icon="🕐"
          color="blue"
        />
        <StatCard
          title="Notifications"
          value={unreadCount}
          icon="🔔"
          color="emerald"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-heading">
              Recent Appointments
            </h2>
            <Link
              href="/doctor/appointments"
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              View all
            </Link>
          </div>

          {appointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No appointments yet.
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
                      Patient #{appt.patient}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDate(appt.appointment_date)} ·{" "}
                      {formatTime(appt.start_time)}
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
              Weekly Schedule
            </h2>
            <Link
              href="/doctor/availability"
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              Manage
            </Link>
          </div>

          {availability.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No availability set.{" "}
              <Link href="/doctor/availability" className="text-teal-600">
                Add slots
              </Link>
            </p>
          ) : (
            <div className="space-y-2">
              {availability.slice(0, 5).map((slot) => (
                <div
                  key={slot.id}
                  className="list-row-muted"
                >
                  <span className="font-medium text-body">
                    {slot.day_of_week}
                  </span>
                  <span className="text-muted">
                    {slot.start_time.slice(0, 5)} –{" "}
                    {slot.end_time.slice(0, 5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
