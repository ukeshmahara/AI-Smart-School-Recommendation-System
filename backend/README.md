# Backend — School Recommendation System

Express + TypeScript + MongoDB API, layered architecture (route → middleware → controller →
service → repository → model).

## Setup

```bash
npm install
npm run dev
```

Server runs at `http://localhost:8089`.

## Endpoints (Sprint 2)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | none | Create a new user (fullName, email, phone, password) |
| POST | `/api/v1/auth/login` | none | Log in, returns `{ user, token }` |
| GET | `/api/v1/auth/whoami` | Bearer token | Get the logged-in user's details |

## Example requests (for Postman/Thunder Client)

**Register** — `POST http://localhost:8089/api/v1/auth/register`
```json
{
  "fullName": "Ukesh Maharjan",
  "email": "ukesh@example.com",
  "phone": "9800000000",
  "password": "password123"
}
```

**Login** — `POST http://localhost:8089/api/v1/auth/login`
```json
{
  "email": "ukesh@example.com",
  "password": "password123"
}
```
