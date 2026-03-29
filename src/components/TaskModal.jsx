// src/components/TaskModal.jsx
// ─────────────────────────────────────────────────────────────
// MUI Dialog used for both creating and editing tasks.
// Controlled via Zustand taskModal state.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useKanbanStore from "../store/useKanbanStore";
import { useCreateTask, useUpdateTask } from "../hooks/useTasksQuery";
import { COLUMNS, COLUMN_MAP } from "../utils/columns";

const EMPTY_FORM = { title: "", description: "", column: "backlog" };

const TaskModal = () => {
  const taskModal = useKanbanStore((s) => s.taskModal);
  const closeModal = useKanbanStore((s) => s.closeModal);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const isOpen = Boolean(taskModal);
  const isEdit = taskModal?.mode === "edit";

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when modal opens
  useEffect(() => {
    if (!taskModal) return;
    if (isEdit) {
      const { title, description, column } = taskModal.task;
      setForm({ title, description, column });
    } else {
      setForm({ ...EMPTY_FORM, column: taskModal.column ?? "backlog" });
    }
    setErrors({});
  }, [taskModal]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.trim().length > 80) errs.title = "Max 80 characters";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (isEdit) {
      await updateTask.mutateAsync({ id: taskModal.task.id, patch: form });
    } else {
      await createTask.mutateAsync(form);
    }
    closeModal();
  };

  const isPending = createTask.isPending || updateTask.isPending;
  const col = COLUMN_MAP[form.column];

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, border: "1px solid", borderColor: "divider" } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: "2px solid",
          borderColor: col?.color ?? "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
          {col?.icon} &nbsp;
          {isEdit ? "Edit Task" : `New Task in ${col?.label}`}
        </Typography>
        <IconButton size="small" onClick={closeModal}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Title */}
        <TextField
          label="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={Boolean(errors.title)}
          helperText={errors.title ?? `${form.title.length}/80`}
          fullWidth
          autoFocus
          size="small"
          inputProps={{ maxLength: 80 }}
        />

        {/* Description */}
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder="Optional – add more context…"
        />

        {/* Column selector */}
        <TextField
          select
          label="Column"
          value={form.column}
          onChange={(e) => setForm({ ...form, column: e.target.value })}
          fullWidth
          size="small"
        >
          {COLUMNS.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: c.color,
                    flexShrink: 0,
                  }}
                />
                {c.icon} &nbsp; {c.label}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={closeModal} disabled={isPending} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          size="small"
          sx={{
            bgcolor: col?.color,
            "&:hover": { bgcolor: col?.color, filter: "brightness(0.9)" },
          }}
          startIcon={isPending && <CircularProgress size={14} color="inherit" />}
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
