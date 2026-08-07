import {
  LayoutDashboard,
  Search,
  History,
  Settings,
  HelpCircle,
} from "lucide-react";
import { ROUTES } from "./routes";

// Top-level sidebar navigation. Workspace/project/board navigation is
// contextual and rendered within those pages themselves (added in later
// steps), not as fixed top-level items here.
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: ROUTES.dashboard() },
  { id: "search", label: "Search", icon: Search, path: ROUTES.search() },
  { id: "activity", label: "Activity", icon: History, path: ROUTES.activity() },
  { id: "settings", label: "Settings", icon: Settings, path: ROUTES.settings() },
  { id: "help", label: "Help", icon: HelpCircle, path: ROUTES.help() },
];
