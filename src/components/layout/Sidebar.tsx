import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Key, Settings, FileText, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import ThemeToggle from "../shared/ThemeToggle";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navSections: NavSection[] = [
  {
    title: "Platform",
    items: [
      {
        name: "Clientes",
        path: "/client/dashboard",
        icon: <Users className="w-5 h-5" />,
      },
      {
        name: "Keys",
        path: "/key/dashboard",
        icon: <Key className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        name: "Reportes",
        path: "/reports",
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        name: "Documentos",
        path: "/documents",
        icon: <FileText className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        name: "Configuración",
        path: "/settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ],
  },
];

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Platform"]);
  const location = useLocation();

  const toggleSection = (title: string) => {
    if (expandedSections.includes(title)) {
      setExpandedSections(expandedSections.filter((s) => s !== title));
    } else {
      setExpandedSections([...expandedSections, title]);
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen
        bg-sidebar
        transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? "w-16" : "w-64"}
        border-r border-sidebar-border
      `}
    >
      {/* Header */}
      <div className="relative p-4 border-b border-sidebar-border">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sidebar-foreground font-bold text-base">EICAP</h1>
                <p className="text-muted-foreground text-xs">Enterprise</p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-240px)] custom-scrollbar">
        {navSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title);

          return (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex  items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group mb-2
                    bg-gray-100 dark:bg-sidebar-accent/50 
                    hover:bg-gray-200 dark:hover:bg-sidebar-accent
                    text-white dark:text-sidebar-foreground/60 
                    hover:text-gray-900 dark:hover:text-sidebar-foreground"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider">{section.title}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 group-hover:text-[#db1d25] transition-colors" />
                  ) : (
                    <ChevronDown className="w-3 h-3 group-hover:text-[#db1d25] transition-colors" />
                  )}
                </button>
              )}

              {/* Section Items */}
              {(isExpanded || isCollapsed) && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200
                          group relative 
                          ${isActive ? "bg-gradient-to-r from-[#254181] to-[#3d5fa3]" : "hover:bg-sidebar-accent"}
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? item.name : ""}
                      >
                        {/* Icon */}
                        <div
                          className={`relative z-10 ${
                            isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                          }`}
                        >
                          {item.icon}
                        </div>

                        {/* Label */}
                        {!isCollapsed && (
                          <span
                            className={`relative z-10 font-medium text-sm ${
                              isActive ? "text-white" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                            }`}
                          >
                            {item.name}
                          </span>
                        )}

                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#db1d25] rounded-l-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer - Theme Toggle & User info */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border">
        {/* Theme Toggle */}
        {!isCollapsed && (
          <div className="p-3 pb-2">
            <ThemeToggle />
          </div>
        )}

        {/* User Info */}
        <div className="p-4 pt-2">
          <div
            className={`
            flex items-center gap-3
            ${isCollapsed ? "justify-center" : ""}
          `}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#db1d25] to-[#ff3d47] flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sidebar-foreground font-medium text-sm truncate">Admin</p>
                <p className="text-muted-foreground text-xs truncate">admin@eicap.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: color-mix(in oklch, var(--color-sidebar-accent) 30%, transparent);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: color-mix(in oklch, var(--color-sidebar-foreground) 30%, transparent);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #db1d25;
        }
      `}</style>
    </aside>
  );
}
