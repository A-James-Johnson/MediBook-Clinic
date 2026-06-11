"use client";

import { useState } from "react";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { patientsApi } from "@/lib/api";

const FIELDS = [
  { name: "date_of_birth", label: "Date of Birth", type: "date" },
  { name: "gender", label: "Gender", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "blood_group", label: "Blood Group", type: "text" },
  { name: "allergies", label: "Allergies", type: "text" },
];

function buildForm(profile) {
  return {
    date_of_birth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    address: profile?.address || "",
    blood_group: profile?.blood_group || "",
    allergies: profile?.allergies || "",
  };
}

export default function PatientProfilePage() {
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
      await patientsApi.update(profile.id, {
        user: profile.user,
        ...form,
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
              className="input-field"
              value={form[field.name]}
              disabled={!isEditing}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
            />
          </div>
        ))}

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
