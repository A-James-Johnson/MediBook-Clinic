"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Alert from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import {
  appointmentsApi,
  patientsApi,
  APPOINTMENT_STATUSES,
  formatDate,
  formatTime,
} from "@/lib/api";

export default function DoctorAppointmentsPage() {
  const { profile } = useAuth();
  const { loadNotifications } = useNotificationContext();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [appts, pts] = await Promise.all([
        appointmentsApi.list(),
        patientsApi.list(),
      ]);
      setAppointments(
        appts
          .filter((a) => a.doctor === profile?.id)
          .sort(
            (a, b) =>
              new Date(b.appointment_date) - new Date(a.appointment_date)
          )
      );
      setPatients(pts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) loadData();
  }, [profile]);

  const getPatientInfo = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient
      ? `${patient.gender}, ${patient.blood_group}`
      : `Patient #${patientId}`;
  };

  const updateStatus = async (id, status) => {
    try {
      const appt = appointments.find((a) => a.id === id);
      await appointmentsApi.update(id, { ...appt, status });
      setSuccess(`Appointment marked as ${status.toLowerCase()}. The patient has been notified.`);
      await loadNotifications(true);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-heading">Appointments</h1>

      <Alert message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      {appointments.length === 0 ? (
        <div className="card py-12 text-center text-muted">
          No appointments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-heading">
                      {getPatientInfo(appt.patient)}
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

                <div className="flex flex-wrap gap-2">
                  {APPOINTMENT_STATUSES.filter(
                    (s) => s !== appt.status
                  ).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(appt.id, status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : status === "CANCELLED"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
