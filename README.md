# 📋 KanbanFlow — Professional Kanban Task Dashboard

A production-ready, drag-and-drop Kanban board built with React, Zustand, React Query, Material UI, and @dnd-kit.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Zustand](https://img.shields.io/badge/Zustand-4-orange) ![React Query](https://img.shields.io/badge/React%20Query-5-red) ![MUI](https://img.shields.io/badge/MUI-5-blue)

---

## ✨ Features

| Feature | Details |
|---|---|
| **4 Kanban columns** | Backlog → In Progress → Review → Done |
| **Drag & Drop** | Move tasks across columns with @dnd-kit |
| **CRUD** | Create, edit, and delete tasks via modal dialog |
| **Pagination** | 5 tasks per column, page controls per column |
| **Search** | Debounced global search filters all columns |
| **Caching** | React Query caches data; optimistic updates on drag |
| **Persistence** | localStorage keeps data across page refreshes |
| **Dark theme** | Deep navy + indigo accent, noise grain, MUI CssBaseline |
| **Responsive** | Horizontal scroll on small screens |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### 1 — Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/kanban-todo-dashboard.git
cd kanban-todo-dashboard
npm install
```

### 2 — Run the app (localStorage mock API)

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). Tasks are seeded automatically and persist in your browser's `localStorage`.

---

## 🔌 Optional: Switch to json-server (Real REST API)

### Step 1 — Install json-server globally
```bash
npm install -g json-server
```

### Step 2 — Start the mock server
```bash
json-server --watch db.json --port 4000
```

The API is now live at `http://localhost:4000/tasks`.

### Step 3 — Update the API layer

Open `src/api/tasksApi.js` and replace the mock functions with real HTTP calls:

```js
import axios from "axios";

const BASE = "http://localhost:4000";

export const fetchTasks = async ({ column, page, limit, search }) => {
  const params = { _page: page, _limit: limit };
  if (column) params.column = column;
  if (search) params.q = search;   // json-server full-text search

  const res = await axios.get(`${BASE}/tasks`, { params });
  const total = Number(res.headers["x-total-count"] ?? 0);
  return {
    tasks: res.data,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const createTask = (data) =>
  axios.post(`${BASE}/tasks`, data).then((r) => r.data);

export const updateTask = (id, changes) =>
  axios.patch(`${BASE}/tasks/${id}`, changes).then((r) => r.data);

export const deleteTask = (id) =>
  axios.delete(`${BASE}/tasks/${id}`);
```

---

## 🗂️ Project Structure

```
kanban-todo-dashboard/
├── public/
│   └── index.html            # HTML shell with Google Fonts
├── src/
│   ├── api/
│   │   └── tasksApi.js       # Mock API (localStorage) — swap for real calls
│   ├── components/
│   │   ├── KanbanBoard.jsx   # DndContext root, column grid
│   │   ├── KanbanColumn.jsx  # Column with droppable zone + pagination
│   │   ├── TaskCard.jsx      # Draggable card with edit/delete
│   │   ├── TaskDialog.jsx    # Create / Edit modal
│   │   └── SearchBar.jsx     # Debounced global search
│   ├── hooks/
│   │   └── useTasks.js       # React Query hooks (fetch, create, update, delete)
│   ├── store/
│   │   └── useKanbanStore.js # Zustand: search query + dialog state
│   ├── App.jsx               # Theme, QueryClient provider, shell
│   └── index.js              # React DOM entry point
├── db.json                   # Seed data for json-server
├── package.json
└── README.md
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  App.jsx  (QueryClientProvider + MUI ThemeProvider)
│  ┌───────────────────────────────────────────┐  │
│  │  AppShell                                 │  │
│  │  ┌──────────┐  ┌────────────────────────┐ │  │
│  │  │ SearchBar│  │  "+ New Task" Button    │ │  │
│  │  └──────────┘  └────────────────────────┘ │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  KanbanBoard (DndContext)           │  │  │
│  │  │  ┌──────┐ ┌───────────┐ ┌──────┐   │  │  │
│  │  │  │Backlog│ │In Progress│ │Review│ …│  │  │
│  │  │  │Column│ │  Column   │ │Column│   │  │  │
│  │  │  └──────┘ └───────────┘ └──────┘   │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  TaskDialog (create / edit)         │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

State layers:
  • React Query  →  server/cache state (task lists)
  • Zustand      →  UI state (search, dialog open/mode)
  • localStorage →  persistence layer (mock API)
```

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Zustand | 4 | Lightweight global UI state |
| @tanstack/react-query | 5 | Data fetching, caching, mutations |
| @dnd-kit/core + sortable | 6/8 | Drag and drop |
| Material UI (MUI) | 5 | Component library + theming |
| uuid | 9 | ID generation for mock tasks |

---

## 📜 Scripts

```bash
npm start        # Dev server → http://localhost:3000
npm run build    # Production build → /build
npm test         # Run tests
```

---

## 🔑 Key Design Decisions

1. **Optimistic drag-and-drop** — the task moves immediately in the UI before the API call resolves, making it feel instant.
2. **Per-column pagination** — each column independently pages through its tasks so one column with 50 tasks doesn't block others.
3. **Debounced search** — waits 350 ms after the last keystroke before querying, avoiding excessive calls.
4. **React Query cache invalidation** — after every mutation, the affected column queries are invalidated and silently refetched in the background.
5. **Swappable API layer** — the entire `src/api/tasksApi.js` file is the only thing that needs to change to switch from mock to json-server or any real backend.

---

## 📄 License

MIT — free to use, modify, and distribute.
# kanban-todo-dashboard
