import { useState } from "react";
import type {
  CustomSettings,
  ModeConfigs,
} from "../types/pomodoro.types";
import {
  DEFAULT_POMODORO_CONFIG,
  DEFAULT_ANIMEDORO_CONFIG,
  DEFAULT_CUSTOM_SETTINGS,
} from "../constants/pomodoro.constants";

export const usePomodoroSettings = () => {
  const [customSettings, setCustomSettings] = useState<CustomSettings>(
    DEFAULT_CUSTOM_SETTINGS,
  );

  /**
   * Gets the configuration for all modes
   */
  const getModeConfigs = (): ModeConfigs => ({
    pomodoro: DEFAULT_POMODORO_CONFIG,
    animedoro: DEFAULT_ANIMEDORO_CONFIG,
    custom: {
      work: customSettings.work * 60,
      break: customSettings.break * 60,
      longBreak: customSettings.longBreak * 60,
      sessionsBeforeLong: 4,
    },
  });

  /**
   * Updates custom work duration
   */
  const setCustomWork = (value: number) => {
    setCustomSettings((prev) => ({ ...prev, work: value }));
  };

  /**
   * Updates custom break duration
   */
  const setCustomBreak = (value: number) => {
    setCustomSettings((prev) => ({ ...prev, break: value }));
  };

  /**
   * Updates custom long break duration
   */
  const setCustomLongBreak = (value: number) => {
    setCustomSettings((prev) => ({ ...prev, longBreak: value }));
  };

  return {
    customSettings,
    setCustomWork,
    setCustomBreak,
    setCustomLongBreak,
    getModeConfigs,
  };
};
