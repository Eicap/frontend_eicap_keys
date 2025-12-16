import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  variant?: 'create' | 'edit' | 'delete' | 'primary';
  className?: string;
}

export default function ActionButton({
  onClick,
  icon: Icon,
  label,
  variant = 'primary',
  className = '',
}: ActionButtonProps) {
  const variants = {
    create: 'bg-gradient-to-r from-[#254181] via-[#3d5fa3] to-[#254181] hover:from-[#db1d25] hover:via-[#ff3d47] hover:to-[#db1d25] text-white shadow-xl shadow-[#254181]/40 hover:shadow-[#db1d25]/40 ring-2 ring-white/20',
    edit: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 text-white shadow-xl shadow-blue-500/40 ring-2 ring-white/20',
    delete: 'bg-gradient-to-r from-[#db1d25] via-[#ff3d47] to-[#db1d25] hover:from-red-600 hover:via-red-700 hover:to-red-600 text-white shadow-xl shadow-[#db1d25]/40 ring-2 ring-white/20',
    primary: 'bg-gradient-to-r from-[#254181] via-[#3d5fa3] to-[#254181] hover:from-[#3d5fa3] hover:via-[#254181] hover:to-[#3d5fa3] text-white shadow-xl shadow-[#254181]/40 ring-2 ring-white/20',
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg
        font-medium transition-all duration-200
        hover:scale-105 active:scale-95
        ${variants[variant]}
        ${className}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
