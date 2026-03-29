// src/App.jsx
// ─────────────────────────────────────────────────────────────
// Application shell:
//  • MUI ThemeProvider with custom theme
//  • React Query client
//  • Top bar with search
//  • KanbanBoard
//  • Global modals (TaskModal, DeleteConfirmDialog)
// ─────────────────────────────────────────────────────────────

import React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Chip,
} from "@mui/material";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import AddIcon from "@mui/icons-material/Add";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import KanbanBoard from "./components/KanbanBoard";
import TaskModal from "./components/TaskModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import SearchBar from "./components/SearchBar";
import useKanbanStore from "./store/useKanbanStore";

// ── React Query client ────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ── MUI theme ─────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6366f1" },
    secondary: { main: "#f59e0b" },
    background: { default: "#f8fafc", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    h5: { fontWeight: 800 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

// ── Top bar ───────────────────────────────────────────────────
const TopBar = () => {
  const openCreateModal = useKanbanStore((s) => s.openCreateModal);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ViewKanbanOutlinedIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, fontSize: { xs: "1rem", sm: "1.1rem" }, letterSpacing: -0.5 }}
          >
            KanbanFlow
          </Typography>
          <Chip
            label="beta"
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              height: 18,
              fontSize: "0.6rem",
              fontWeight: 700,
              display: { xs: "none", sm: "flex" },
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Search */}
        <SearchBar />

        {/* New task CTA */}
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => openCreateModal("backlog")}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          New Task
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// ── Root ──────────────────────────────────────────────────────
function AppInner() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar />

      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 4 }}>
        {/* Page title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ letterSpacing: -0.5, color: "text.primary" }}>
            Project Board
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Drag tasks between columns · click{" "}
            <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
              +
            </Box>{" "}
            to add · search to filter
          </Typography>
        </Box>

        {/* Board */}
        <KanbanBoard />
      </Container>

      {/* Global modals */}
      <TaskModal />
      <DeleteConfirmDialog />
    </Box>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppInner />
      </ThemeProvider>
      {/* Dev tools visible in development only */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
