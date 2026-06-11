"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { availabilityApi, DAYS_OF_WEEK } from "@/lib/api";

export default function DoctorAvailabilityPage() {
  const { profile } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "17:00",
    is_available: true,
  });

  const loadSlots = async () => {
    try {
      const data = await availabilityApi.list();
      setSlots(data.filter((s) => s.doctor === profile?.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) loadSlots();
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await availabilityApi.create({
        doctor: profile.id,
        ...form,
      });
      setSuccess("Availability slot added!");
      setForm({
        day_of_week: "Monday",
        start_time: "09:00",
        end_time: "17:00",
        is_available: true,
      });
      loadSlots();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (slot) => {
    try {
      await availabilityApi.update(slot.id, {
        ...slot,
        is_available: !slot.is_available,
      });
      loadSlots();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteSlot = async (id) => {
    try {
      await availabilityApi.delete(id);
      setSuccess("Slot removed.");
      loadSlots();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-heading">
        Manage Schedule
      </h1>

      <Alert message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <form onSubmit={handleSubmit} className="card mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-heading">
          Add Availability
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">
              Day of Week
            </label>
            <select
              className="input-field"
              value={form.day_of_week}
              onChange={(e) =>
                setForm({ ...form, day_of_week: e.target.value })
              }
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">
              Start Time
            </label>
            <input
              type="time"
              required
              className="input-field"
              value={form.start_time}
              onChange={(e) =>
                setForm({ ...form, start_time: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label-text">
              End Time
            </label>
            <input
              type="time"
              required
              className="input-field"
              value={form.end_time}
              onChange={(e) =>
                setForm({ ...form, end_time: e.target.value })
              }
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Adding..." : "Add Slot"}
        </button>
      </form>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-heading">
          Current Schedule
        </h2>

        {slots.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No availability slots configured.
          </p>
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="list-row flex-wrap gap-3 p-4"
              >
                <div>
                  <p className="font-medium text-heading">
                    {slot.day_of_week}
                  </p>
                  <p className="text-sm text-muted">
                    {slot.start_time.slice(0, 5)} –{" "}
                    {slot.end_time.slice(0, 5)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailability(slot)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      slot.is_available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-surface-muted text-muted"
                    }`}
                  >
                    {slot.is_available ? "Available" : "Unavailable"}
                  </button>
                  <button
                    onClick={() => deleteSlot(slot.id)}
                    className="btn-danger text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
