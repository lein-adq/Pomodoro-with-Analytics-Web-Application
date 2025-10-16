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
    <div className="flex items-center justify-between p-6 min-h-16">
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            onClick={onSidebarToggle}
            className="p-2 h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/10 hover:bg-white/20 flex items-center justify-center"
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
          className="h-10 px-4 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/10 text-sm font-medium hover:bg-white/20 flex items-center"
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
