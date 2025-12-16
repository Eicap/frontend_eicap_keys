import { PanelLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TopNavProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function TopNav({ onToggleSidebar, isSidebarCollapsed }: TopNavProps) {
  const location = useLocation();

  // Get breadcrumb from current path
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/client')) return 'Clientes';
    if (path.includes('/key')) return 'Keys';
    if (path.includes('/reports')) return 'Reportes';
    if (path.includes('/documents')) return 'Documentos';
    if (path.includes('/settings')) return 'Configuración';
    return 'Dashboard';
  };

  return (
    <div className="fixed top-0 right-0 left-0 h-14 bg-[#1a1a1a] border-b border-gray-800 z-40 flex items-center px-4 gap-4"
         style={{ marginLeft: isSidebarCollapsed ? '64px' : '256px' }}>
      {/* Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
        title={isSidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        <PanelLeft className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">EICAP</span>
        <ChevronRight className="w-4 h-4 text-gray-600" />
        <span className="text-white font-medium">{getBreadcrumb()}</span>
      </div>
    </div>
  );
}
