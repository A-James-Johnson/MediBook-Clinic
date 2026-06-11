"use client";

import { useState } from "react";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { doctorsApi } from "@/lib/api";

const FIELDS = [
  { name: "employee_id", label: "Employee ID", type: "text" },
  { name: "qualification", label: "Qualification", type: "text" },
  { name: "specialization", label: "Specialization", type: "text" },
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
];

function buildForm(profile) {
  return {
    employee_id: profile?.employee_id || "",
    qualification: profile?.qualification || "",
    specialization: profile?.specialization || "",
    experience_years: profile?.experience_years || "",
    consultation_fee: profile?.consultation_fee || "",
    bio: profile?.bio || "",
  };
}

export default function DoctorProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(buildForm(profile));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setForm(buildForm(profile));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(buildForm(profile));
    setIsEditing(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await doctorsApi.update(profile.id, {
        user: profile.user,
        ...form,
        experience_years: parseInt(form.experience_years, 10),
      });
      await refreshProfile();
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-heading">My Profile</h1>
        {!isEditing && (
          <button type="button" onClick={handleEdit} className="btn-secondary">
            Edit
          </button>
        )}
      </div>

      <Alert message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label className="label-text">
              {field.label}
            </label>
            <input
              type={field.type}
              step={field.step}
              className="input-field"
              value={form[field.name]}
              disabled={!isEditing}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
            />
          </div>
        ))}

        <div>
          <label className="label-text">
            Bio
          </label>
          <textarea
            rows={4}
            className="input-field"
            value={form.bio}
            disabled={!isEditing}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
