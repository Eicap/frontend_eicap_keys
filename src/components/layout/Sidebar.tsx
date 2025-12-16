import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Key, LayoutDashboard, Settings, FileText, BarChart3, ChevronDown, ChevronUp } from "lucide-react";

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

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
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
        bg-[#1a1a1a]
        transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? "w-16" : "w-64"}
        border-r border-gray-800
      `}
    >
      {/* Header */}
      <div className="relative p-4 border-b border-gray-800">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#254181] to-[#3d5fa3] flex items-center justify-center shadow-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base">EICAP</h1>
                <p className="text-gray-400 text-xs">Enterprise</p>
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
      <nav className="p-3 space-y-6 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
        {navSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title);

          return (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider">{section.title}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 group-hover:text-[#db1d25]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 group-hover:text-[#db1d25]" />
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
                          ${
                            isActive
                              ? "bg-gradient-to-r from-[#254181] to-[#3d5fa3] text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? item.name : ""}
                      >
                        {/* Icon */}
                        <div className="relative z-10">{item.icon}</div>

                        {/* Label */}
                        {!isCollapsed && <span className="relative z-10 font-medium text-sm">{item.name}</span>}

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

      {/* Footer - User info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
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
              <p className="text-white font-medium text-sm truncate">Admin</p>
              <p className="text-gray-400 text-xs truncate">admin@eicap.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #254181;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #db1d25;
        }
      `}</style>
    </aside>
  );
}
