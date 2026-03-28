// ─────────────────────────────────────────────────────────────────────────────
// The main board. Wraps all columns in a DndContext so tasks can be dragged
// between columns. Uses an overlay for the dragging card ghost.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { Box, Stack } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";
import { useUpdateTask, COLUMNS } from "../hooks/useTasks";
import useKanbanStore from "../store/useKanbanStore";

export default function KanbanBoard() {
  const { searchQuery } = useKanbanStore();
  const updateTask = useUpdateTask();
  const [activeTask, setActiveTask] = useState(null);

  // Only activate drag after moving 8px – prevents accidental drags on click
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = ({ active }) => {
    setActiveTask(active.data.current?.task ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const draggedTask = active.data.current?.task;
    if (!draggedTask) return;

    // The drop target id is either a column id or another task id (over its column)
    const targetColumnId = COLUMNS.find((c) => c.id === over.id)
      ? over.id
      : over.data?.current?.task?.column;

    if (!targetColumnId || draggedTask.column === targetColumnId) return;

    // Move task to the new column via optimistic update
    updateTask.mutate({
      id: draggedTask.id,
      changes: { column: targetColumnId },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* ── Board grid ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          // Custom scrollbar
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(148,163,184,0.2)",
            borderRadius: 3,
          },
        }}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            searchQuery={searchQuery}
          />
        ))}
      </Box>

      {/* ── Drag overlay (the ghost card while dragging) ──────────────────── */}
      <DragOverlay>
        {activeTask && (
          <Box sx={{ transform: "rotate(2deg)", opacity: 0.95 }}>
            <TaskCard task={activeTask} />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}
