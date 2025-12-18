import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground
        transition-all duration-200
        group relative bg-sidebar-accent/30 hover:bg-sidebar-accent/50
      "
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {/* Icon */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </div>

      {/* Label */}
      <span className="relative z-10 font-medium text-sm">
        {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
      </span>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#254181]/20 to-[#3d5fa3]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
}
