// src/components/KanbanBoard.jsx
// ─────────────────────────────────────────────────────────────
// Root board component.
// Wraps all columns in a DragDropContext and wires up the
// onDragEnd handler to call the moveTask mutation.
// ─────────────────────────────────────────────────────────────

import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Box, Alert } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
import { useMoveTask } from "../hooks/useTasksQuery";
import { COLUMNS } from "../utils/columns";

const KanbanBoard = () => {
  const moveTask = useMoveTask();

  /**
   * Called by @hello-pangea/dnd after a drag ends.
   * We only care about cross-column drops (destination column ≠ source column).
   * Same-column reordering is not persisted (stateless pagination).
   */
  const onDragEnd = (result) => {
    const { draggableId, source, destination } = result;
    if (!destination) return; // dropped outside
    if (destination.droppableId === source.droppableId) return; // same column

    // Optimistic update: fire mutation, React Query invalidates all columns
    moveTask.mutate({ id: draggableId, column: destination.droppableId });
  };

  return (
    <Box>
      {/* Move error banner */}
      {moveTask.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to move task – please try again.
        </Alert>
      )}

      {/* Scrollable columns row */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            // Nice scrollbar styling
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-track": { borderRadius: 3, bgcolor: "grey.100" },
            "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "grey.400" },
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn key={col.id} column={col} />
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
