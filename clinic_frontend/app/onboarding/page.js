"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Alert from "@/components/Alert";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { patientsApi, doctorsApi, meApi } from "@/lib/api";

function OnboardingContent() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(user?.role || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const me = await meApi.get();
        if (!cancelled) {
          setNeedsPhone(!me.phone_number);
          setPhoneNumber(me.phone_number || "");
        }
      } catch {
        if (!cancelled) {
          setNeedsPhone(false);
        }
      } finally {
        if (!cancelled) {
          setPhoneLoading(false);
        }
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  const [patientForm, setPatientForm] = useState({
    date_of_birth: "",
    gender: "",
    address: "",
    blood_group: "",
    allergies: "",
  });

  const [doctorForm, setDoctorForm] = useState({
    employee_id: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
  });

  const savePhoneIfNeeded = async () => {
    if (needsPhone && phoneNumber.trim()) {
      await meApi.update({ phone_number: phoneNumber.trim() });
      setNeedsPhone(false);
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await savePhoneIfNeeded();
      await patientsApi.create({
        user: user.id,
        ...patientForm,
      });
      await refreshProfile();
      router.push("/patient/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await savePhoneIfNeeded();
      await doctorsApi.create({
        user: user.id,
        ...doctorForm,
        experience_years: parseInt(doctorForm.experience_years, 10),
        consultation_fee: doctorForm.consultation_fee,
      });
      await refreshProfile();
      router.push("/doctor/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="card">
          <h1 className="text-2xl font-bold text-heading">
            Complete Your Profile
          </h1>
          <p className="mt-1 text-sm text-muted">
            Tell us a bit more to finish setting up your account
          </p>

          <Alert message={error} onClose={() => setError("")} />

          {phoneLoading ? null : needsPhone ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-body">
                Add your phone number to finish setting up your account.
              </p>
              <div>
                <label className="label-text">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {!role ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setRole("PATIENT")}
                className="selection-card"
              >
                <span className="text-3xl">🧑‍⚕️</span>
                <h3 className="mt-3 font-semibold text-heading">
                  I&apos;m a Patient
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Book appointments and manage health records
                </p>
              </button>

              <button
                onClick={() => setRole("DOCTOR")}
                className="selection-card"
              >
                <span className="text-3xl">👨‍⚕️</span>
                <h3 className="mt-3 font-semibold text-heading">
                  I&apos;m a Doctor
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Manage schedule and patient appointments
                </p>
              </button>
            </div>
          ) : role === "PATIENT" ? (
            <form onSubmit={handlePatientSubmit} className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => setRole("")}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                ← Back
              </button>

              {[
                { name: "date_of_birth", label: "Date of Birth", type: "date" },
                { name: "gender", label: "Gender", type: "text" },
                { name: "address", label: "Address", type: "text" },
                { name: "blood_group", label: "Blood Group", type: "text" },
                { name: "allergies", label: "Allergies", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="label-text">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required={field.name !== "allergies"}
                    className="input-field"
                    value={patientForm[field.name]}
                    onChange={(e) =>
                      setPatientForm({
                        ...patientForm,
                        [field.name]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading || (needsPhone && !phoneNumber.trim())}
                className="btn-primary w-full"
              >
                {loading ? "Saving..." : "Complete Profile"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleDoctorSubmit} className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => setRole("")}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                ← Back
              </button>

              {[
                { name: "employee_id", label: "Employee ID", type: "text" },
                { name: "qualification", label: "Qualification", type: "text" },
                {
                  name: "specialization",
                  label: "Specialization",
                  type: "text",
                },
                {
                  name: "experience_years",
                  label: "Years of Experience",
                  type: "number",
                },
                {
                  name: "consultation_fee",
                  label: "Consultation Fee ($)",
                  type: "number",
                  step: "0.01",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="label-text">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    step={field.step}
                    required
                    className="input-field"
                    value={doctorForm[field.name]}
                    onChange={(e) =>
                      setDoctorForm({
                        ...doctorForm,
                        [field.name]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}

              <div>
                <label className="label-text">
                  Bio
                </label>
                <textarea
                  required
                  rows={4}
                  className="input-field"
                  value={doctorForm.bio}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, bio: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading || (needsPhone && !phoneNumber.trim())}
                className="btn-primary w-full"
              >
                {loading ? "Saving..." : "Complete Profile"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
