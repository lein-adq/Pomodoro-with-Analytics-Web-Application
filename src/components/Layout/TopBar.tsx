/**
 * Top Bar Component
 *
 * Navigation bar with sidebar toggle and focus mode button.
 */

import { Menu } from "lucide-react";

interface TopBarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  onFocusModeToggle: () => void;
}

export const TopBar = ({
  isSidebarOpen,
  onSidebarToggle,
  onFocusModeToggle,
}: TopBarProps) => {
  return (
    <div className="flex items-center justify-between p-6">
      {!isSidebarOpen && (
        <button
          onClick={onSidebarToggle}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all border border-white/10"
          type="button"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onFocusModeToggle}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all border border-white/10 text-sm font-medium"
          type="button"
        >
          Focus Mode
        </button>
      </div>
    </div>
  );
};
