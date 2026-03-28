// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root component. Sets up:
//   • React Query provider (caching layer)
//   • MUI dark theme
//   • App shell: header, search bar, board, dialogs
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KanbanBoard from "./components/KanbanBoard";
import SearchBar from "./components/SearchBar";
import TaskDialog from "./components/TaskDialog";
import useKanbanStore from "./store/useKanbanStore";

// ── React Query client config ─────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ── MUI dark theme ────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366f1" },
    background: {
      default: "#050c1a",
      paper: "#0f172a",
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; }
        
        body {
          background: #050c1a;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        /* Animated background mesh */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 90%, rgba(139,92,246,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 60% 40%, rgba(52,211,153,0.04) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        
        /* Noise grain overlay */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.15); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.3); }
      `,
    },
  },
});

// ── App Shell ─────────────────────────────────────────────────────────────────
function AppShell() {
  const { openCreateDialog } = useKanbanStore();

  return (
    <Box sx={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 3 } }}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <Box sx={{ mb: 4 }}>
          {/* Brand row */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            sx={{ mb: 2.5 }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                  }}
                >
                  📋
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "1.4rem", md: "1.8rem" },
                    background: "linear-gradient(135deg, #f1f5f9 30%, #a5b4fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  KanbanFlow
                </Typography>
              </Stack>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "0.8rem",
                  letterSpacing: "0.05em",
                  fontWeight: 500,
                }}
              >
                Manage your workflow across every stage
              </Typography>
            </Box>

            {/* Add Task CTA */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openCreateDialog("backlog")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                borderRadius: 2.5,
                px: 2.5,
                py: 1,
                fontSize: "0.85rem",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 6px 20px rgba(99,102,241,0.5)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              New Task
            </Button>
          </Stack>

          <Divider sx={{ borderColor: "rgba(148,163,184,0.08)", mb: 2.5 }} />

          {/* Search */}
          <SearchBar />
        </Box>

        {/* ── Board ────────────────────────────────────────────────────────── */}
        <KanbanBoard />
      </Container>

      {/* ── Global Task Dialog ───────────────────────────────────────────── */}
      <TaskDialog />
    </Box>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppShell />
      </ThemeProvider>
      {/* Dev tools only appear in development builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
