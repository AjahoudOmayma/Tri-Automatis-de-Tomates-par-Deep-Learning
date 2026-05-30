import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Scan,
  FileCheck,
  Activity,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Live Detection", href: "/detection", icon: Scan },
  { name: "Results", href: "/results", icon: FileCheck },
  { name: "Performance", href: "/performance", icon: Activity },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Scan className="size-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">TomatoAI</span>
              <span className="text-xs text-muted-foreground">YOLOv8</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )
            }
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={cn("border-t p-4", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg bg-muted p-3",
            collapsed && "flex-col gap-1 p-2"
          )}
        >
          <div
            className={cn(
              "size-2 rounded-full bg-success",
              "animate-pulse"
            )}
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-medium">System Online</span>
              <span className="text-xs text-muted-foreground">GPU Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
