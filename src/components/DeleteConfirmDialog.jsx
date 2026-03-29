// src/components/DeleteConfirmDialog.jsx
// Simple confirmation dialog before deleting a task.

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useKanbanStore from "../store/useKanbanStore";
import { useDeleteTask } from "../hooks/useTasksQuery";

const DeleteConfirmDialog = () => {
  const deleteTarget = useKanbanStore((s) => s.deleteTarget);
  const closeDeleteConfirm = useKanbanStore((s) => s.closeDeleteConfirm);
  const deleteTask = useDeleteTask();

  const handleDelete = async () => {
    await deleteTask.mutateAsync(deleteTarget);
    closeDeleteConfirm();
  };

  return (
    <Dialog
      open={Boolean(deleteTarget)}
      onClose={closeDeleteConfirm}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
        <WarningAmberIcon color="error" />
        Delete Task
      </DialogTitle>
      <DialogContent>
        <DialogContentText fontSize="0.875rem">
          Are you sure you want to delete this task? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={closeDeleteConfirm} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={deleteTask.isPending}
          size="small"
          startIcon={deleteTask.isPending && <CircularProgress size={14} color="inherit" />}
        >
          {deleteTask.isPending ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
