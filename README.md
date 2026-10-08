# Chatz

![CI](https://github.com/madhanravi734/Chatz/actions/workflows/ci.yml/badge.svg)

A real-time chat app with authentication, chat rooms, and persistent message history.

**Live demo:** https://chatz-fawn.vercel.app

(The backend runs on Render's free tier, so the first request after a period of inactivity can take up to a minute.)

## Features
- Sign up and log in with JWT authentication (passwords hashed with bcrypt)
- Create and browse chat rooms
- Real-time messaging with Socket.io, with JWT verified during the socket handshake
- Message history stored in MongoDB and loaded when you open a room
- Automated tests on every push with GitHub Actions

## Tech stack
- **Frontend:** React, Vite, React Router, Axios, socket.io-client (deployed on Vercel)
- **Backend:** Node.js, Express, Socket.io, Mongoose (deployed on Render)
- **Database:** MongoDB Atlas
- **Testing and CI:** Jest, Supertest, GitHub Actions

## Run locally
Backend (needs a `.env` with `MONGO_URL` and `JWT_SECRET`):
```
cd backend
npm install
npm start
```

Frontend (needs a `.env` with `VITE_API_URL` and `VITE_SOCKET_URL`):
```
cd frontend/project
npm install
npm run dev
```

## Tests
```
cd backend
npm test
```
The 12 tests cover the auth, room and message-history REST routes. They run against a separate `*_test` database, and the suite refuses to run against any other database name.