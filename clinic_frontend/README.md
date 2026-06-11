# MediBook Clinic — Frontend

Next.js frontend for the Clinic Appointment Booking system.

## Prerequisites

- Node.js 18+
- Django backend running at `http://127.0.0.1:8000`

## Setup

```bash
cd clinic_frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend Requirements

Install CORS support in the Django backend:

```bash
pip install django-cors-headers
```

Then run the backend:

```bash
cd clinic_backend
python manage.py runserver
```

## Features

### Patients
- Register and complete profile
- Browse doctors and book appointments
- View and cancel appointments
- Manage notifications
- Leave doctor reviews

### Doctors
- Register and complete profile
- Manage weekly availability schedule
- View and update appointment statuses
- Dashboard with stats
- Manage notifications

## API Proxy

API requests are proxied to the Django backend via Next.js rewrites (`/api/*` → `http://127.0.0.1:8000/api/*`), so no CORS issues during development.

## Project Structure

```
clinic_frontend/
├── app/                  # Next.js App Router pages
│   ├── patient/          # Patient portal
│   ├── doctor/           # Doctor portal
│   ├── login/            # Authentication
│   └── register/         # Registration
├── components/           # Reusable UI components
├── context/              # Auth context provider
└── lib/                  # API client & utilities
```
