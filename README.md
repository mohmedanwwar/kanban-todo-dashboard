# KanbanFlow – Kanban ToDo Dashboard

A production-ready Kanban board built with **React 18**, **Zustand**, **React Query v5**, **Material UI v5**, and **@hello-pangea/dnd**.

## ✨ Features

| Feature         | Details                                                  |
| --------------- | -------------------------------------------------------- |
| **4 columns**   | Backlog → In Progress → Review → Done                    |
| **CRUD tasks**  | Create, edit, delete with form validation                |
| **Drag & drop** | Move tasks between columns via @hello-pangea/dnd         |
| **Pagination**  | 5 tasks per column with MUI Pagination                   |
| **Search**      | Debounced global search filtering title & description    |
| **Caching**     | React Query with 30 s stale time, automatic invalidation |
| **State**       | Zustand for UI state; React Query for server/cache state |
| **Persistence** | localStorage mock API (swap to json-server in 1 line)    |

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── KanbanBoard.jsx       # DragDropContext wrapper
│   ├── KanbanColumn.jsx      # Droppable column with pagination
│   ├── TaskCard.jsx          # Draggable task card
│   ├── TaskModal.jsx         # Create / Edit dialog
│   ├── DeleteConfirmDialog.jsx
│   └── SearchBar.jsx
├── hooks/
│   └── useTasksQuery.js      # React Query hooks (fetch/create/update/delete/move)
├── store/
│   └── useKanbanStore.js     # Zustand store (search, modals)
└── utils/
    ├── mockApi.js            # Local mock API (localStorage)
    └── columns.js            # Column config (id, label, colour, icon)
```

---

## 🚀 Quick Start

### Option A – Local mock API (default, zero config)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start
```

Tasks persist in **localStorage** automatically. Open http://localhost:3000.

---

### Option B – json-server (real HTTP API)

```bash
# 1. Install json-server globally
npm install -g json-server

# 2. Start the mock server (in a separate terminal)
json-server --watch db.json --port 4000

# 3. In src/hooks/useTasksQuery.js, change the import:
#    from: import { fetchTasks, ... } from "../utils/mockApi";
#    to:   import { fetchTasks, ... } from "../utils/realApi";
#    (see src/utils/realApi.js below for a fetch-based implementation)

# 4. Start the React app
npm start
```

---

## 🔧 Swapping to json-server

Replace `src/utils/mockApi.js` with the following fetch-based implementation:

```js
// src/utils/realApi.js  ← rename mockApi import to this
const BASE = "http://localhost:4000";

export async function fetchTasks({ column, page = 1, limit = 5, search = "" }) {
  const params = new URLSearchParams({ _page: page, _limit: limit, column });
  if (search) params.append("q", search);
  const res = await fetch(`${BASE}/tasks?${params}`);
  const tasks = await res.json();
  const total = Number(res.headers.get("X-Total-Count") ?? tasks.length);
  return { tasks, total, page, totalPages: Math.ceil(total / limit) };
}

export const createTask = (data) =>
  fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateTask = (id, patch) =>
  fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then((r) => r.json());

export const deleteTask = (id) =>
  fetch(`${BASE}/tasks/${id}`, { method: "DELETE" }).then(() => ({ id }));

export const moveTask = (id, column) => updateTask(id, { column });
```

---

## 🏗 Tech Stack

- **React 18** – UI
- **Zustand** – lightweight UI state (search query, modal visibility)
- **@tanstack/react-query v5** – server state, caching, mutations
- **Material UI v5** – component library & theming
- **@hello-pangea/dnd** – drag-and-drop (maintained fork of react-beautiful-dnd)
- **uuid** – unique task IDs

---

## 📸 Architecture Decisions

### Why Zustand + React Query?

- **React Query** owns all async/server state. It handles caching, refetching, loading/error states, and optimistic updates automatically.
- **Zustand** manages synchronous UI state (which modal is open, current search string). This avoids prop-drilling without the boilerplate of Redux.

### Pagination strategy

Each column maintains its own `page` state. When the search query changes, all columns reset to page 1. React Query caches each `[column, page, search]` combination independently.

### Drag & drop

`onDragEnd` fires a `moveTask` mutation which calls `updateTask(id, { column })` and then invalidates all task queries so every column refreshes.

---

## 🌐 Deployment

```bash
npm run build
# Deploy the /build folder to Vercel, Netlify, or any static host.
```

For Vercel:

```bash
npx vercel --prod
```

---

## 📋 Requirements Checklist

- [x] 4 Kanban columns (Backlog, In Progress, Review, Done)
- [x] Task fields: title, description, column
- [x] Create, update, delete tasks
- [x] Drag-and-drop between columns
- [x] Pagination per column (5 tasks / page)
- [x] Search bar (title + description filter, debounced)
- [x] Material UI layout & components
- [x] React Query caching
- [x] Zustand state management
- [x] Local mock API (localStorage) + json-server option
- [x] README with setup instructions
- [x] Commented, clearly structured code
