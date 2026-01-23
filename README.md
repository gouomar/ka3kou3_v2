# Ba3bou3

> 🌐 **Live:** [https://www.ba3bou3.me/login](https://www.ba3bou3.me/login)

A learning platform for 42 students to visualize their curriculum progress and project architectures.

---

## What It Does

- **OAuth Login** with 42 Intra API
- **Student Dashboard** showing profile, level, and project stats
- **Interactive Roadmaps** with Mermaid diagrams for each project
- **Architecture Visualizer** with clickable nodes and learning resources

---

## Auth Flow

```
    ┌──────────────────────────────────────────────────────────────────┐
    │                        OAUTH 2.0 FLOW                            │
    └──────────────────────────────────────────────────────────────────┘

    ┌─────────┐          ┌─────────────┐          ┌─────────────────┐
    │ Browser │          │  Ba3bou3    │          │   42 Intra API  │
    │  User   │          │  Server     │          │   OAuth Server  │
    └────┬────┘          └──────┬──────┘          └────────┬────────┘
         │                      │                          │
         │  1. Click Login      │                          │
         │ ────────────────────>│                          │
         │                      │                          │
         │  2. Redirect         │                          │
         │ <────────────────────│                          │
         │                      │                          │
         │  3. Login at 42 ─────────────────────────────> │
         │                      │                          │
         │  4. Auth Code  <─────────────────────────────── │
         │                      │                          │
         │  5. Callback + Code  │                          │
         │ ────────────────────>│                          │
         │                      │  6. Exchange Code        │
         │                      │ ────────────────────────>│
         │                      │                          │
         │                      │  7. Access Token         │
         │                      │ <────────────────────────│
         │                      │                          │
         │                      │  8. GET /v2/me           │
         │                      │ ────────────────────────>│
         │                      │                          │
         │                      │  9. User Profile         │
         │                      │ <────────────────────────│
         │                      │                          │
         │ 10. Set Cookies      │                          │
         │     + Redirect /     │                          │
         │ <────────────────────│                          │
         │                      │                          │
    ┌────┴────┐          ┌──────┴──────┐          ┌────────┴────────┐
    │   ✓     │          │      ✓      │          │        ✓        │
    │ Logged  │          │  Session    │          │   Authorized    │
    │   In    │          │  Created    │          │                 │
    └─────────┘          └─────────────┘          └─────────────────┘
```

**Steps:**
1. User clicks "Login with 42"
2. Server redirects to 42 authorization URL
3. User authenticates on 42 Intra
4. 42 redirects back with authorization code
5. Browser hits `/api/auth/callback?code=xxx`
6. Server exchanges code for access token
7. 42 returns access token
8. Server fetches user profile
9. 42 returns user data (login, level, campus, etc.)
10. Server sets secure cookies and redirects to dashboard

---

## API Routes

| Route                  | Method | Description              |
|------------------------|--------|--------------------------|
| `/api/auth/login`      | GET    | Redirect to 42 OAuth     |
| `/api/auth/callback`   | GET    | Handle OAuth callback    |
| `/api/auth/logout`     | GET    | Clear session cookies    |
| `/api/auth/session`    | GET    | Get current user session |
| `/api/user/projects`   | GET    | Fetch user's projects    |

---

## Tech Stack

- **Next.js 16** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Radix UI** — Component primitives
- **Mermaid** — Diagram rendering
- **42 OAuth** — Authentication

---

## Project Structure

```
app/
├── api/auth/       → OAuth endpoints
├── login/          → Login page
├── project/[id]/   → Project architecture view
└── page.tsx        → Dashboard

components/
├── dashboard-page.tsx
├── architecture-visualizer.tsx
├── roadmap-visualizer.tsx
└── ui/             → Reusable components

lib/
├── auth.ts         → OAuth helpers
├── roadmaps.ts     → Curriculum data
└── project-architectures.ts → Project diagrams
```

---

## Run Locally

```bash
pnpm install
pnpm dev
```

Set environment variables:
```
FORTY_TWO_CLIENT_ID=
FORTY_TWO_CLIENT_SECRET=
FORTY_TWO_REDIRECT_URI=
```

---

## Team

Built by students for 1337 struggles. Keep coding greatness awaits.