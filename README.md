# MediBook Clinic

This repository contains a clinic appointment booking system with:

- `clinic_backend/` — Django REST API backend
- `clinic_frontend/` — Next.js frontend

## Local development

### Backend

1. Create a virtual environment and activate it.
2. Install dependencies:
   ```bash
   cd clinic_backend
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

The backend will run at `http://127.0.0.1:8000`.

### Frontend

1. Install dependencies:
   ```bash
   cd clinic_frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:3000`.

## Deployment

### Backend on Render

Use the `clinic_backend/` folder as the Render service root.

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn clinic_system.wsgi:application --bind 0.0.0.0:$PORT`

Render environment variables:

- `SECRET_KEY` = secure random string
- `DEBUG` = `False`
- `ALLOWED_HOSTS` = `your-backend-service.onrender.com`
- `DATABASE_URL` = `postgres://<user>:<password>@<host>:<port>/<dbname>`
- `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
- `CSRF_TRUSTED_ORIGINS` = `https://your-frontend.vercel.app`
- `GOOGLE_CLIENT_ID` = `your-google-client-id.apps.googleusercontent.com`

Optional email settings:

- `EMAIL_BACKEND` = `django.core.mail.backends.smtp.EmailBackend`
- `EMAIL_HOST` = `smtp.gmail.com`
- `EMAIL_PORT` = `587`
- `EMAIL_USE_TLS` = `True`
- `EMAIL_HOST_USER` = `<smtp-user>`
- `EMAIL_HOST_PASSWORD` = `<smtp-password>`
- `DEFAULT_FROM_EMAIL` = `noreply@yourdomain.com`
- `EMAIL_FROM_NAME` = `MediBook Clinic`

### Frontend on Vercel

Use the `clinic_frontend/` folder as the Vercel project root.

- Build command: `npm install && npm run build`
- Output: default Next.js settings

Vercel environment variables:

- `NEXT_PUBLIC_API_URL` = `https://your-backend-service.onrender.com`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = `your-google-client-id.apps.googleusercontent.com`

## Notes

- The backend supports `DATABASE_URL` through `dj-database-url`.
- The backend reads `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` from environment variables for production.
- Make sure the frontend `NEXT_PUBLIC_API_URL` points to the Render backend URL.
