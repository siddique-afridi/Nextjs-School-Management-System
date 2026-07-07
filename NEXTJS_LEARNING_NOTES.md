# Next.js Notes (for React developers)

Short notes added as we build each phase. Read this alongside `FULLSTACK_PROGRESS.md`.

---

## React vs Next.js — what changes?

| React (CRA/Vite) | Next.js (this project) |
|------------------|------------------------|
| `src/pages/Home.jsx` | `app/page.tsx` — file path = URL |
| `react-router` for routes | **Folders in `app/` are routes automatically** |
| One `index.html` | Each page can be a Server or Client Component |
| `useEffect` + `fetch` anywhere | Same pattern, but pages default to Server Components unless you add `"use client"` |

---

## Phase 1 — Auth

### `"use client"` at top of file
Admin pages use buttons, `useState`, `useEffect` → they must be **Client Components**.
Add `"use client"` as the **first line** of the file.

### Context API (`UserProvider`)
Same as React Context:
- `UserProvider` wraps the app in `app/layout.tsx`
- Any child calls `useAuth()` to read user / login / logout

### `middleware.ts` (Next.js only)
Runs **on the server before the page loads**.
We use it to block `/admin/*` if no login cookie exists.

---

## Phase 2 — Services

### Why `app/services/*.service.ts`?
Keeps API calls in one place. Pages stay UI-only:
```
page.tsx  →  class.service.ts  →  lib/client.ts (axios)  →  backend
```

### `useSchoolId()` hook
Backend list URLs use the admin's MongoDB `_id` as school id:
`GET /Students/:schoolId`
The hook reads `user._id` from auth context.

### `lib/mappers.ts`
Backend uses `_id`, `sclassName`, `subName`.
UI was built with `id`, `name`, `code`.
Mappers convert API → UI shape so we don't rewrite every component.

### `lib/api-helpers.ts`
Backend returns either an **array** or `{ message: "No students found" }`.
`asList()` always gives you an array (empty if none).

---

## Phase 3 — Admin pages pattern

Every admin list page follows this:

```tsx
"use client";

const schoolId = useSchoolId();
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchItems(schoolId).then(setItems).finally(() => setLoading(false));
}, [schoolId]);
```

1. Get school id from logged-in admin
2. `useEffect` loads data when page opens
3. Form submit calls `createX()` service → refresh list
4. Delete calls `deleteX()` service → remove from state

### Order to create school data
1. **Classes** first
2. **Subjects** (needs a class)
3. **Students** (needs a class)
4. **Teachers** (needs class + subject)

---

## Useful commands

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open http://localhost:3000
