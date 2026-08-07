import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "./contexts/AppProviders";
import { AppShell } from "./components/layout/AppShell";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { LoadingOverlay } from "./components/common/LoadingOverlay";
import { NotFound } from "./components/common/NotFound";
import { ROUTE_PATTERNS } from "./constants/routes";

// Route-level code splitting: each page ships as its own chunk, fetched only
// when the user navigates there.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Workspace = lazy(() => import("./pages/Workspace"));
const Project = lazy(() => import("./pages/Project"));
const Board = lazy(() => import("./pages/Board"));
const Search = lazy(() => import("./pages/Search"));
const Settings = lazy(() => import("./pages/Settings"));
const Activity = lazy(() => import("./pages/Activity"));
const Help = lazy(() => import("./pages/Help"));

function App() {
  return (
    <AppProviders>
      <HashRouter>
        <ErrorBoundary>
          <Routes>
            <Route element={<AppShell />}>
              <Route
                path={ROUTE_PATTERNS.dashboard}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading dashboard…" />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.workspace}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading workspace…" />}>
                    <Workspace />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.project}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading project…" />}>
                    <Project />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.board}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading board…" />}>
                    <Board />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.search}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading search…" />}>
                    <Search />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.settings}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading settings…" />}>
                    <Settings />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.activity}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading activity…" />}>
                    <Activity />
                  </Suspense>
                }
              />
              <Route
                path={ROUTE_PATTERNS.help}
                element={
                  <Suspense fallback={<LoadingOverlay fullscreen label="Loading help…" />}>
                    <Help />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </HashRouter>
    </AppProviders>
  );
}

export default App;
