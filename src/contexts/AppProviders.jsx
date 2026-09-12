import { ThemeProvider } from "./ThemeContext";
import { UIProvider } from "./UIContext";
import { UserProvider } from "./UserContext";
import { SearchProvider } from "./SearchContext";
import { DataProvider } from "./DataContext";
import { ToastProvider } from "./ToastContext";

// Composition root for all app-wide state. Order only matters where one
// context's data depends on another's — none currently do, so this is
// purely to avoid a deep manual nesting pyramid in App.jsx.
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UIProvider>
          <UserProvider>
            <SearchProvider>
              <DataProvider>{children}</DataProvider>
            </SearchProvider>
          </UserProvider>
        </UIProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
