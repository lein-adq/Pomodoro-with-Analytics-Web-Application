/**
 * Sidebar Component
 *
 * Left sidebar containing mode selection, stats, and settings.
 */

import { X, Flame, Settings } from "lucide-react";
import type { Mode, Stats } from "../../types/pomodoro.types";
import { ModeSelector } from "./ModeSelector";
import { StatsDisplay } from "./StatsDisplay";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  stats: Stats;
  onSettingsClick: () => void;
}

export const Sidebar = ({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
  stats,
  onSettingsClick,
}: SidebarProps) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 ${
        isOpen ? "w-72" : "w-0"
      }`}
    >
      <div
        className={`p-6 h-full flex flex-col ${isOpen ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Focus Timer
          </h1>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        <ModeSelector currentMode={currentMode} onModeChange={onModeChange} />

        {/* Stats */}
        <StatsDisplay stats={stats} />

        {/* Settings Button */}
        <button
          onClick={onSettingsClick}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"
          type="button"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
