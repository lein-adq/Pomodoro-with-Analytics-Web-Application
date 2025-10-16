/**
 * Settings Panel Component
 *
 * Modal panel for configuring custom timer durations with Motion animations.
 */

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { CustomSettings, Mode, Phase } from "../../types/pomodoro.types";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomSettings;
  onWorkChange: (value: number) => void;
  onBreakChange: (value: number) => void;
  onLongBreakChange: (value: number) => void;
  onSave: () => void;
  currentMode: Mode;
  currentPhase: Phase;
  isRunning: boolean;
  onTimeLeftUpdate: (value: number) => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  settings,
  onWorkChange,
  onBreakChange,
  onLongBreakChange,
  onSave,
  currentMode,
  currentPhase,
  isRunning,
  onTimeLeftUpdate,
}: SettingsPanelProps) => {
  const handleWorkChange = (value: string) => {
    const val = Number.parseInt(value) || 1;
    onWorkChange(val);
    if (currentMode === "custom" && currentPhase === "work" && !isRunning) {
      onTimeLeftUpdate(val * 60);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white">Custom Settings</h2>
              <motion.button
                onClick={onClose}
                className="text-white/60 hover:text-white"
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Settings Form */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-white text-sm font-medium block mb-2">
                  Work Duration (minutes)
                </label>
                <motion.input
                  type="number"
                  value={settings.work}
                  onChange={(e) => handleWorkChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  min="1"
                  max="120"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-white text-sm font-medium block mb-2">
                  Break Duration (minutes)
                </label>
                <motion.input
                  type="number"
                  value={settings.break}
                  onChange={(e) =>
                    onBreakChange(Number.parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  min="1"
                  max="60"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="text-white text-sm font-medium block mb-2">
                  Long Break Duration (minutes)
                </label>
                <motion.input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) =>
                    onLongBreakChange(Number.parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  min="1"
                  max="60"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              onClick={onSave}
              className="w-full mt-6 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold"
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Settings
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
