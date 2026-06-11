"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import {
  appointmentsApi,
  doctorsApi,
  availabilityApi,
  reviewsApi,
  DAYS_OF_WEEK,
} from "@/lib/api";

export default function BookAppointmentPage() {
  const { profile } = useAuth();
  const { loadNotifications } = useNotificationContext();
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [lastDoctorId, setLastDoctorId] = useState(null);

  const [form, setForm] = useState({
    doctor: "",
    appointment_date: "",
    start_time: "",
    end_time: "",
    reason: "",
  });

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    async function load() {
      try {
        const [docs, avail] = await Promise.all([
          doctorsApi.list(),
          availabilityApi.list(),
        ]);
        setDoctors(docs);
        setAvailability(avail);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedDoctor = doctors.find(
    (d) => d.id === parseInt(form.doctor, 10)
  );
  const doctorAvailability = availability.filter(
    (a) => a.doctor === parseInt(form.doctor, 10) && a.is_available
  );

  const selectedDate = form.appointment_date
    ? DAYS_OF_WEEK[
        new Date(form.appointment_date + "T00:00:00").getDay() === 0
          ? 6
          : new Date(form.appointment_date + "T00:00:00").getDay() - 1
      ]
    : null;

  const matchingSlots = doctorAvailability.filter(
    (a) => a.day_of_week === selectedDate
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await appointmentsApi.create({
        patient: profile.id,
        doctor: parseInt(form.doctor, 10),
        appointment_date: form.appointment_date,
        start_time: form.start_time,
        end_time: form.end_time,
        reason: form.reason,
        status: "PENDING",
      });
      await loadNotifications(true);
      setSuccess("Appointment booked! The doctor has been notified.");
      setLastDoctorId(parseInt(form.doctor, 10));
      setShowReview(true);
      setForm({
        doctor: "",
        appointment_date: "",
        start_time: "",
        end_time: "",
        reason: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewsApi.create({
        patient: profile.id,
        doctor: lastDoctorId,
        rating: parseInt(reviewForm.rating, 10),
        comment: reviewForm.comment,
      });
      setSuccess("Appointment booked and review submitted!");
      setShowReview(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-heading">
        Book Appointment
      </h1>

      <Alert message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label-text">
            Select Doctor
          </label>
          <select
            required
            className="input-field"
            value={form.doctor}
            onChange={(e) =>
              setForm({ ...form, doctor: e.target.value, start_time: "", end_time: "" })
            }
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.specialization} — ${doc.consultation_fee} (
                {doc.experience_years} yrs exp.)
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="rounded-lg bg-surface-muted p-4 text-sm text-body">
            <p>
              <strong>Qualification:</strong> {selectedDoctor.qualification}
            </p>
            <p className="mt-1">
              <strong>Bio:</strong> {selectedDoctor.bio}
            </p>
          </div>
        )}

        <div>
          <label className="label-text">
            Appointment Date
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="input-field"
            value={form.appointment_date}
            onChange={(e) =>
              setForm({
                ...form,
                appointment_date: e.target.value,
                start_time: "",
                end_time: "",
              })
            }
          />
        </div>

        {matchingSlots.length > 0 && (
          <div>
            <label className="label-text">
              Available Time Slots ({selectedDate})
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {matchingSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      start_time: slot.start_time,
                      end_time: slot.end_time,
                    })
                  }
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    form.start_time === slot.start_time
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-app hover:border-teal-300"
                  }`}
                >
                  {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>
        )}

        {form.doctor && form.appointment_date && matchingSlots.length === 0 && (
          <p className="text-sm text-amber-600">
            No availability on this day. Please choose another date.
          </p>
        )}

        <div>
          <label className="label-text">
            Reason for Visit
          </label>
          <textarea
            required
            rows={3}
            className="input-field"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Describe your symptoms or reason for the visit..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !form.start_time}
          className="btn-primary w-full"
        >
          {submitting ? "Booking..." : "Book Appointment"}
        </button>
      </form>

      {showReview && (
        <form onSubmit={handleReviewSubmit} className="card mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-heading">
            Leave a Review (Optional)
          </h2>
          <div>
            <label className="label-text">
              Rating
            </label>
            <select
              className="input-field"
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, rating: e.target.value })
              }
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">
              Comment
            </label>
            <textarea
              rows={3}
              className="input-field"
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="btn-secondary"
            >
              Skip
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
