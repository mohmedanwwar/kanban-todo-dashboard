// src/utils/mockApi.js
// ─────────────────────────────────────────────────────────────
// Local mock API that simulates json-server behaviour.
// Data is persisted in localStorage so tasks survive page refreshes.
// To swap to a real json-server just replace the functions below
// with fetch() calls to http://localhost:4000/tasks
// ─────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "kanban_tasks";

// ── Seed data ─────────────────────────────────────────────────
const SEED_TASKS = [
  { id: uuidv4(), title: "Design system tokens", description: "Define colour, spacing and typography scales for the design system", column: "backlog", createdAt: Date.now() - 8 * 86400000 },
  { id: uuidv4(), title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment to Vercel", column: "backlog", createdAt: Date.now() - 7 * 86400000 },
  { id: uuidv4(), title: "Write API documentation", description: "Document all REST endpoints using OpenAPI 3.0 spec", column: "backlog", createdAt: Date.now() - 6 * 86400000 },
  { id: uuidv4(), title: "Implement auth middleware", description: "JWT-based auth with refresh token rotation", column: "in_progress", createdAt: Date.now() - 5 * 86400000 },
  { id: uuidv4(), title: "Build dashboard layout", description: "Responsive Kanban board with drag-and-drop support", column: "in_progress", createdAt: Date.now() - 4 * 86400000 },
  { id: uuidv4(), title: "Optimise database queries", description: "Add indexes and rewrite N+1 queries identified in profiling", column: "in_progress", createdAt: Date.now() - 3 * 86400000 },
  { id: uuidv4(), title: "Code review – payments module", description: "Review Stripe integration PR and check edge-case handling", column: "review", createdAt: Date.now() - 2 * 86400000 },
  { id: uuidv4(), title: "Accessibility audit", description: "Run axe-core and manual screen-reader checks on all pages", column: "review", createdAt: Date.now() - 1 * 86400000 },
  { id: uuidv4(), title: "Launch landing page", description: "Go-live checklist complete, DNS propagated", column: "done", createdAt: Date.now() - 86400000 },
  { id: uuidv4(), title: "User interviews – round 1", description: "5 interviews completed, synthesis written up", column: "done", createdAt: Date.now() },
];

// ── Helpers ────────────────────────────────────────────────────
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // First visit → seed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS));
  return SEED_TASKS;
};

const save = (tasks) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ── Public API ─────────────────────────────────────────────────

/**
 * Fetch paginated tasks with optional search.
 * @param {Object} params
 * @param {string}  params.column    – column filter
 * @param {number}  params.page      – 1-based page number
 * @param {number}  params.limit     – tasks per page
 * @param {string}  params.search    – search query (title | description)
 * @returns {{ tasks: Task[], total: number, page: number, totalPages: number }}
 */
export async function fetchTasks({ column, page = 1, limit = 5, search = "" }) {
  await delay(150);
  let all = load();

  // Filter by column
  if (column) all = all.filter((t) => t.column === column);

  // Search filter
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    all = all.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  all = [...all].sort((a, b) => b.createdAt - a.createdAt);

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const tasks = all.slice((safePage - 1) * limit, safePage * limit);

  return { tasks, total, page: safePage, totalPages };
}

/**
 * Create a new task.
 */
export async function createTask({ title, description, column }) {
  await delay(200);
  const task = { id: uuidv4(), title, description, column, createdAt: Date.now() };
  const all = load();
  save([task, ...all]);
  return task;
}

/**
 * Update an existing task.
 */
export async function updateTask(id, patch) {
  await delay(200);
  const all = load().map((t) => (t.id === id ? { ...t, ...patch } : t));
  save(all);
  return all.find((t) => t.id === id);
}

/**
 * Delete a task by id.
 */
export async function deleteTask(id) {
  await delay(150);
  const all = load().filter((t) => t.id !== id);
  save(all);
  return { id };
}

/**
 * Move a task to a different column (used by drag-and-drop).
 */
export async function moveTask(id, column) {
  return updateTask(id, { column });
}
