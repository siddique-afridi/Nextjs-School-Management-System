# Full-Stack Integration Progress

This document tracks implementation progress for connecting the Next.js frontend to the Express/MongoDB backend.

**Last updated:** Phase 2 & Phase 3 complete

---

## Overview

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Backend foundation fixes | ✅ Complete |
| 1 | Unified auth (Context API) | ✅ Complete |
| 2 | Types & API service layer | ✅ Complete |
| 3 | Admin portal integration | ✅ Complete |
| 4 | Teacher portal integration | ⏳ Pending |
| 5 | Student portal integration | ⏳ Pending |
| 6 | Polish & production readiness | ⏳ Pending |

**State management decision:** Context API (`UserProvider` / `useAuth`) for auth. Redux Toolkit reserved for future global state if needed (not used yet).

---

## Phase 0 — Backend Foundation ✅

### What was done

1. **Fixed `authorizeRoles` middleware** (`backend/routes/routes.js`)
   - Changed all protected routes from `authorizeRoles` to `authorizeRoles("Admin")`
   - Previously the factory was passed without invoking it, breaking protected routes

2. **`meController` import** — already fixed (Admin model import present)

3. **Rate limiter** (`backend/middleware/rateLimiter.js`)
   - Development: 200 requests / 5 min (was 2 — unusable for dev)
   - Production: 50 requests / 5 min

4. **CORS** (`backend/server.js`)
   - Added `http://localhost:3000` for Next.js dev server

5. **Cleanup** (`backend/controllers/adminController.js`)
   - Removed debug `console.log`

6. **Environment templates**
   - `backend/.env.example` — MongoDB, JWT, PORT, NODE_ENV
   - `frontend/.env.example` — `NEXT_PUBLIC_API_URL`

### How to run backend

```bash
cd backend
cp .env.example .env   # fill in real values
npm install
npm run dev
```

---

## Phase 1 — Unified Auth (Context API) ✅

### What was done

1. **Expanded `UserProvider`** (`frontend/app/context/userContext.tsx`)
   - `user`, `isLoading`, `isAuthenticated`
   - `login(credentials)` — role-based API calls
   - `logout()` — calls `POST /Logout` for admin, clears all local state
   - `hydrate()` on mount — `GET /Me` for admin cookie sessions, `sessionStorage` for teacher/student
   - Exported `useAuth()` hook (replaces missing `useAuthStore`)

2. **Auth service** (`frontend/app/services/auth.service.ts`)
   - `POST /AdminLogin` → admin user + token
   - `POST /TeacherLogin` → teacher user
   - `POST /StudentLogin` → student user (rollNum + studentName + password)
   - `GET /Me` → session restore for admin
   - `POST /Logout` → clear admin cookie

3. **Session storage strategy**
   - **Admin:** httpOnly cookie (primary) + optional localStorage token mirror
   - **Teacher/Student:** `sessionStorage` (backend does not issue JWT for these roles yet)

4. **Login page** (`frontend/app/login/page.tsx`)
   - Role-specific forms (student uses roll number + name, not email)
   - Role-based redirect after login (`/admin`, `/teacher`, `/student`)
   - Uses `useAuth().login()` instead of manual `setUser`

5. **Route protection**
   - **Layouts:** admin/teacher/student layouts use `useAuth` with loading state
   - **Middleware:** `/admin/*` requires `accessToken` cookie; redirects to `/login`
   - **401 interceptor** (`frontend/lib/client.ts`) — clears auth on unauthorized responses

6. **Replaced broken imports**
   - All `useAuthStore` from `@/lib/auth-context` → `useAuth` from context
   - Files updated: layouts, navbar, teacher/student pages, admin notices

7. **Bug fixes**
   - `adminRegister` — fixed `useRouter` import (`next/navigation` instead of `next/router`)

8. **Types** (`frontend/lib/constants.ts`)
   - Added `AuthUser`, `LoginCredentials` interfaces
   - Made `email` optional on `User` (students may not have email)

### Auth flow (current)

```
Admin login  → POST /AdminLogin → cookie + setUser → GET /Me on refresh
Teacher login → POST /TeacherLogin → sessionStorage + setUser
Student login → POST /StudentLogin → sessionStorage + setUser
Logout (admin) → POST /Logout → clear cookie + local state
```

### Files created/modified (Phase 1)

| File | Change |
|------|--------|
| `frontend/app/context/userContext.tsx` | Full auth provider |
| `frontend/app/services/auth.service.ts` | Role-based login, me, logout |
| `frontend/lib/auth.ts` | Session helpers, dashboard paths |
| `frontend/lib/client.ts` | 401 interceptor |
| `frontend/lib/constants.ts` | AuthUser types |
| `frontend/app/schemas/loginSchema.ts` | Student field validation |
| `frontend/app/login/page.tsx` | Role forms + redirects |
| `frontend/middleware.ts` | Admin route cookie guard |
| `frontend/components/layout/AppNavbar.tsx` | useAuth logout |
| `frontend/app/admin/layout.tsx` | useAuth guard |
| `frontend/app/teacher/layout.tsx` | useAuth guard |
| `frontend/app/student/layout.tsx` | useAuth guard |
| `frontend/app/adminRegister/page.tsx` | Router fix |

### Known limitations (to address in later phases)

- Teacher/student API data endpoints still require **admin** JWT — portals use mock data until Phase 4/5
- Backend should eventually issue JWT for teacher/student roles (Option A from original plan)
- Admin complaint "resolve" UI has no backend endpoint
- Mock data (`lib/data.ts`) still powers teacher/student portals (Phase 4/5)

---

## Phase 2 — Types & Service Layer ✅

### What was done

1. **`lib/api-helpers.ts`** — handles backend returning array OR `{ message }`
2. **`lib/mappers.ts`** — converts MongoDB fields → UI fields
3. **`hooks/useSchoolId.ts`** — returns admin `_id` for API URLs
4. **Services:** `class`, `subject`, `student`, `teacher`, `notice`, `complaint`

See `NEXTJS_LEARNING_NOTES.md` for beginner explanations.

---

## Phase 3 — Admin Portal ✅

### Pages wired to backend

| Page | Features |
|------|----------|
| `/admin` | Live stats, notices, complaints |
| `/admin/classes` | Add, list, delete |
| `/admin/subjects` | Add, list, delete (needs class) |
| `/admin/students` | Add, list, delete (needs class) |
| `/admin/teachers` | Add, list, delete (needs class + subject) |
| `/admin/notices` | Create, list, delete |
| `/admin/complaints` | List (view only) |

### Create data in this order
`Classes → Subjects → Students` and `Classes + Subjects → Teachers`

---

## Quick test checklist

### Auth (Phase 1)
- [ ] Admin register → login → dashboard
- [ ] Refresh keeps admin session
- [ ] Logout works

### Admin CRUD (Phase 3)
- [ ] Create class "Class 10-A"
- [ ] Create subject "Math" for that class
- [ ] Create student with roll number + password
- [ ] Create teacher assigned to class + subject
- [ ] Create notice → shows on dashboard
- [ ] Delete items works

---

## Environment variables

### Backend (`backend/.env`)

```
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
