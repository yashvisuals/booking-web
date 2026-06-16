# booking-web

React frontend for the [booking-api](https://github.com/yashvisuals/booking-api)
appointment booking service. Providers set their availability; customers browse
free slots (shown in their own timezone) and book them.

## Stack

- React + TypeScript (Vite)
- Axios for the REST API, JWT stored in localStorage

## Running it

The backend must be running first (default http://localhost:8123), and this app
must run on **port 5173** (the backend's CORS allows that origin).

```bash
cp .env.example .env   # point VITE_API_URL at your backend if it differs
npm install
npm run dev
```

Open http://localhost:5173.

## Flow

- Register/login as a **provider** → add weekly availability rules.
- Register/login as a **customer** → pick a provider and date → book a free slot.
- Slot times are returned by the API as UTC and rendered in your local timezone.
