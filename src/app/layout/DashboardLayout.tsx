import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import TopNav from '../../components/layout/TopNav';
import { useState } from 'react';

function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />
      <TopNav onToggleSidebar={handleToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      
      {/* Main Content */}
      <main 
        className="transition-all duration-300 ease-in-out min-h-screen pt-14"
        style={{ marginLeft: isSidebarCollapsed ? '64px' : '256px' }}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;

