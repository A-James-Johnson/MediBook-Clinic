import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Health,{" "}
              <span className="text-teal-200">One Click Away</span>
            </h1>
            <p className="mt-6 text-lg text-teal-100">
              Book appointments with trusted doctors, manage your schedule, and
              stay informed with real-time notifications — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register/patient"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-lg transition hover:bg-teal-50"
              >
                Book as Patient
              </Link>
              <Link
                href="/register/doctor"
                className="rounded-lg border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-heading">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-body">
          Simple steps to manage your healthcare appointments
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: "1",
              title: "Create Account",
              desc: "Register as a patient or doctor and complete your profile.",
              icon: "👤",
            },
            {
              step: "2",
              title: "Schedule",
              desc: "Patients book slots; doctors set availability on their dashboard.",
              icon: "📅",
            },
            {
              step: "3",
              title: "Stay Updated",
              desc: "Receive notifications for confirmations, changes, and reminders.",
              icon: "🔔",
            },
          ].map((item) => (
            <div key={item.step} className="card text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-heading">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-heading">
                For Patients
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Browse doctors by specialization",
                  "Book appointments online",
                  "Track appointment status",
                  "Leave reviews for doctors",
                  "Receive appointment notifications",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-body"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs text-teal-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register/patient" className="btn-primary mt-8">
                Register as Patient
              </Link>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-heading">
                For Doctors
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Manage weekly availability",
                  "View and confirm appointments",
                  "Update appointment status",
                  "Professional profile dashboard",
                  "Stay notified of new bookings",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-body"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register/doctor" className="btn-primary mt-8">
                Register as Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-app">
        <p>© 2026 MediBook Clinic. Clinic Appointment Booking System.</p>
      </footer>
    </div>
  );
}
