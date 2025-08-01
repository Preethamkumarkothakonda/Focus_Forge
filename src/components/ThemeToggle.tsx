import React from 'react';
import { Moon, Focus } from 'lucide-react';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  const themes = [
    { id: 'dark' as Theme, icon: Moon, label: 'Dark' },
    { id: 'focus' as Theme, icon: Focus, label: 'Focus' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full p-1">
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`p-2 rounded-full transition-all duration-200 ${
            theme === id
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title={label}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}