/**
 * Settings Panel Component
 *
 * Modal panel for configuring custom timer durations.
 */

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
  if (!isOpen) return null;

  const handleWorkChange = (value: string) => {
    const val = Number.parseInt(value) || 1;
    onWorkChange(val);
    if (currentMode === "custom" && currentPhase === "work" && !isRunning) {
      onTimeLeftUpdate(val * 60);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Custom Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.work}
              onChange={(e) => handleWorkChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              min="1"
              max="120"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.break}
              onChange={(e) =>
                onBreakChange(Number.parseInt(e.target.value) || 1)
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              min="1"
              max="60"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.longBreak}
              onChange={(e) =>
                onLongBreakChange(Number.parseInt(e.target.value) || 1)
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              min="1"
              max="60"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="w-full mt-6 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all"
          type="button"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};
