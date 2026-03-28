// ─────────────────────────────────────────────────────────────────────────────
// A single Kanban column. Renders tasks from React Query, supports pagination,
// and acts as a drop target for @dnd-kit drag-and-drop.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Pagination,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard, { TaskCardSkeleton } from "./TaskCard";
import useKanbanStore from "../store/useKanbanStore";
import { useColumnTasks } from "../hooks/useTasks";

// Column icon map
const COL_ICONS = {
  backlog: "🗂️",
  in_progress: "⚡",
  review: "🔍",
  done: "✅",
};

export default function KanbanColumn({ column, searchQuery }) {
  const [page, setPage] = useState(1);
  const { openCreateDialog } = useKanbanStore();

  // Reset to page 1 when search changes (parent triggers rerender via key)
  const { data, isLoading, isError, isFetching } = useColumnTasks(
    column.id,
    page,
    searchQuery
  );

  // dnd-kit: make this column a valid drop zone
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const tasks = data?.tasks ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.total ?? 0;

  const handlePageChange = (_, value) => setPage(value);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 280,
        maxWidth: 320,
        flex: "1 1 280px",
        borderRadius: 3,
        background: isOver
          ? "rgba(99,102,241,0.08)"
          : "rgba(15,23,42,0.6)",
        border: "1px solid",
        borderColor: isOver
          ? "rgba(99,102,241,0.4)"
          : "rgba(148,163,184,0.1)",
        backdropFilter: "blur(12px)",
        transition: "all 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* ── Column Header ───────────────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid rgba(148,163,184,0.08)",
          background: `linear-gradient(90deg, ${column.color}18 0%, transparent 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <span style={{ fontSize: "1rem" }}>{COL_ICONS[column.id]}</span>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: column.color,
            }}
          >
            {column.label}
          </Typography>
          <Chip
            label={isFetching ? "…" : totalCount}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.65rem",
              fontWeight: 700,
              backgroundColor: `${column.color}22`,
              color: column.color,
            }}
          />
        </Stack>

        {/* Add task button */}
        <Tooltip title={`Add task to ${column.label}`}>
          <IconButton
            size="small"
            onClick={() => openCreateDialog(column.id)}
            sx={{
              color: "#475569",
              "&:hover": { color: column.color, background: `${column.color}18` },
              transition: "all 0.2s",
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* ── Task list (droppable area) ────────────────────────────────────── */}
      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.5,
          pt: 1.5,
          pb: 0.5,
          minHeight: 120,
          // Custom scrollbar
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(148,163,184,0.2)",
            borderRadius: 2,
          },
        }}
      >
        {isError && (
          <Alert severity="error" sx={{ mb: 1, borderRadius: 2, fontSize: "0.75rem" }}>
            Failed to load tasks
          </Alert>
        )}

        {isLoading ? (
          // Skeleton placeholders while loading
          Array.from({ length: 3 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))
        ) : tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              px: 2,
              color: "#334155",
            }}
          >
            <Typography sx={{ fontSize: "2rem", mb: 0.5 }}>🌙</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#475569" }}>
              {searchQuery ? "No matching tasks" : "No tasks yet"}
            </Typography>
          </Box>
        ) : (
          // Sortable context needed for within-column reordering
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        )}
      </Box>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <>
          <Divider sx={{ borderColor: "rgba(148,163,184,0.08)" }} />
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              size="small"
              siblingCount={0}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#64748b",
                  fontSize: "0.7rem",
                  minWidth: 24,
                  height: 24,
                },
                "& .Mui-selected": {
                  background: `${column.color}33 !important`,
                  color: `${column.color} !important`,
                  fontWeight: 700,
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
