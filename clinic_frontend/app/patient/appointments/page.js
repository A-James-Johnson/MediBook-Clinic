"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Alert from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import {
  appointmentsApi,
  doctorsApi,
  formatDate,
  formatTime,
} from "@/lib/api";

export default function PatientAppointmentsPage() {
  const { profile } = useAuth();
  const { loadNotifications } = useNotificationContext();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [appts, docs] = await Promise.all([
        appointmentsApi.list(),
        doctorsApi.list(),
      ]);
      setAppointments(appts.filter((a) => a.patient === profile?.id));
      setDoctors(docs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) loadData();
  }, [profile]);

  const getDoctorName = (doctorId) => {
    const doc = doctors.find((d) => d.id === doctorId);
    return doc ? doc.specialization : `Doctor #${doctorId}`;
  };

  const handleCancel = async (appt) => {
    try {
      await appointmentsApi.update(appt.id, { ...appt, status: "CANCELLED" });
      setSuccess("Appointment cancelled. The doctor has been notified.");
      await loadNotifications(true);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-heading">
        My Appointments
      </h1>

      <Alert message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {appointments.length === 0 ? (
        <div className="card py-12 text-center text-muted">
          No appointments found.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-heading">
                      {getDoctorName(appt.doctor)}
                    </h3>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p className="mt-2 text-sm text-body">
                    {formatDate(appt.appointment_date)} ·{" "}
                    {formatTime(appt.start_time)} –{" "}
                    {formatTime(appt.end_time)}
                  </p>
                  {appt.reason && (
                    <p className="mt-1 text-sm text-muted">
                      Reason: {appt.reason}
                    </p>
                  )}
                </div>

                {(appt.status === "PENDING" || appt.status === "CONFIRMED") && (
                  <button
                    onClick={() => handleCancel(appt)}
                    className="btn-danger text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
