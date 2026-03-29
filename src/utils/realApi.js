// src/utils/realApi.js
// ─────────────────────────────────────────────────────────────
// Real API calls to json-server running on http://localhost:4000
// To use: run → json-server --watch db.json --port 4000
// Then in src/hooks/useTasksQuery.js change:
//   import { ... } from "../utils/mockApi"
//   to:
//   import { ... } from "../utils/realApi"
// ─────────────────────────────────────────────────────────────

const BASE = "http://localhost:4000";

// ── Fetch paginated tasks ──────────────────────────────────────
export async function fetchTasks({ column, page = 1, limit = 5, search = "" }) {
  const params = new URLSearchParams();
  params.append("_page", page);
  params.append("_limit", limit);
  if (column) params.append("column", column);
  if (search.trim()) params.append("q", search.trim()); // json-server full-text search

  const res = await fetch(`${BASE}/tasks?${params}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");

  const tasks = await res.json();
  // json-server returns total count in X-Total-Count header
  const total = Number(res.headers.get("X-Total-Count") ?? tasks.length);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { tasks, total, page, totalPages };
}

// ── Create a new task ──────────────────────────────────────────
export async function createTask({ title, description, column }) {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, column, createdAt: Date.now() }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// ── Update an existing task ────────────────────────────────────
export async function updateTask(id, patch) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

// ── Delete a task ──────────────────────────────────────────────
export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
  return { id };
}

// ── Move task to another column (drag & drop) ──────────────────
export async function moveTask(id, column) {
  return updateTask(id, { column });
}
