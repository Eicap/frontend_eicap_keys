import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#254181] transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-4 py-3 rounded-xl
          bg-[#1a1a1a] border border-gray-800
          focus:border-[#254181] focus:ring-2 focus:ring-[#254181]/20
          outline-none transition-all duration-200
          text-white placeholder-gray-500
          hover:border-gray-700
          font-medium
        "
      />
    </div>
  );
}
