/**
 * Top Bar Component
 *
 * Navigation bar with sidebar toggle and focus mode button with Motion animations.
 */

import { motion, AnimatePresence } from "motion/react";
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
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            onClick={onSidebarToggle}
            className="p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/10 hover:bg-white/20"
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <div className="ml-auto flex items-center gap-3">
        <motion.button
          onClick={onFocusModeToggle}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/10 text-sm font-medium hover:bg-white/20"
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Focus Mode
        </motion.button>
      </div>
    </div>
  );
};
