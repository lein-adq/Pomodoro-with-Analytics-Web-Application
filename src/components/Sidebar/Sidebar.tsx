import { motion, AnimatePresence } from "motion/react";
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
    <motion.div
      className="fixed left-0 top-0 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 z-40 overflow-hidden"
      initial={{ width: 0 }}
      animate={{ width: isOpen ? 288 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="p-6 h-full flex flex-col w-72"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6" />
                Focus Timer
              </h1>
              <motion.button
                onClick={onClose}
                className="text-white/60 hover:text-white"
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Mode Selection */}
            <ModeSelector
              currentMode={currentMode}
              onModeChange={onModeChange}
            />

            {/* Stats */}
            <StatsDisplay stats={stats} />

            {/* Settings Button */}
            <motion.button
              onClick={onSettingsClick}
              className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white"
              type="button"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
