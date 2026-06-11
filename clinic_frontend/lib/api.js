const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

export function setTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_id");
  localStorage.removeItem("profile_id");
}

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

export async function apiFetch(endpoint, options = {}) {
  const { access } = getTokens();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (access) {
    headers.Authorization = `Bearer ${access}`;
  }

  let res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401 && access) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.Authorization = `Bearer ${newAccess}`;
      res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    }
  }

  return res;
}

export async function apiJson(endpoint, options = {}) {
  const res = await apiFetch(endpoint, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data === "object"
        ? data.error ||
          data.detail ||
          Object.values(data).flat().join(", ") ||
          res.statusText
        : res.statusText;
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  login: (username, password) =>
    apiJson("/api/token/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  registerPatient: (data) =>
    apiJson("/api/accounts/register/patient/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  registerDoctor: (data) =>
    apiJson("/api/accounts/register/doctor/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  googleAuth: (idToken, action, role = null) =>
    apiJson("/api/accounts/auth/google/", {
      method: "POST",
      body: JSON.stringify({
        id_token: idToken,
        action,
        ...(role ? { role } : {}),
      }),
    }),
};

export const patientsApi = {
  list: () => apiJson("/api/patients/"),
  get: (id) => apiJson(`/api/patients/${id}/`),
  create: (data) =>
    apiJson("/api/patients/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiJson(`/api/patients/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const doctorsApi = {
  list: () => apiJson("/api/doctors/"),
  get: (id) => apiJson(`/api/doctors/${id}/`),
  create: (data) =>
    apiJson("/api/doctors/", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiJson(`/api/doctors/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const availabilityApi = {
  list: () => apiJson("/api/doctors/availability/"),
  create: (data) =>
    apiJson("/api/doctors/availability/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiJson(`/api/doctors/availability/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiJson(`/api/doctors/availability/${id}/`, { method: "DELETE" }),
};

export const appointmentsApi = {
  list: () => apiJson("/api/appointments/"),
  create: (data) =>
    apiJson("/api/appointments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiJson(`/api/appointments/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiJson(`/api/appointments/${id}/`, { method: "DELETE" }),
};

export const reviewsApi = {
  list: () => apiJson("/api/reviews/"),
  create: (data) =>
    apiJson("/api/reviews/", { method: "POST", body: JSON.stringify(data) }),
};

export const notificationsApi = {
  list: () => apiJson("/api/notifications/"),
  markAllRead: () =>
    apiJson("/api/notifications/mark-all-read/", { method: "POST" }),
  update: (id, data) =>
    apiJson(`/api/notifications/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiJson(`/api/notifications/${id}/`, { method: "DELETE" }),
};

export const meApi = {
  get: () => apiJson("/api/accounts/me/"),
  update: (data) =>
    apiJson("/api/accounts/me/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export async function resolveUserProfile(userId) {
  const me = await meApi.get();
  const role = me.role;
  let profile = null;

  if (role === "PATIENT") {
    const patients = await patientsApi.list();
    profile = patients.find((p) => p.user === userId) || null;
  } else if (role === "DOCTOR") {
    const doctors = await doctorsApi.list();
    profile = doctors.find((d) => d.user === userId) || null;
  }

  return { role, profile };
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(h, 10), parseInt(m, 10));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];
