import type { StateCreator } from "zustand";
import { DEFAULT_CUSTOM_SETTINGS } from "../../constants/pomodoro.constants";
import type { SettingsState } from "../types";

export interface SettingsActions {
  updateCustomWork: (value: number) => void;
  updateCustomBreak: (value: number) => void;
  updateCustomLongBreak: (value: number) => void;
  resetSettings: () => void;
}

export type SettingsSlice = SettingsState & SettingsActions;

const initialState: SettingsState = {
  customSettings: DEFAULT_CUSTOM_SETTINGS,
};

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  ...initialState,

  /**
   * Updates custom work duration
   */
  updateCustomWork: (value: number) => {
    set((state) => ({
      customSettings: {
        ...state.customSettings,
        work: value,
      },
    }));
  },

  /**
   * Updates custom break duration
   */
  updateCustomBreak: (value: number) => {
    set((state) => ({
      customSettings: {
        ...state.customSettings,
        break: value,
      },
    }));
  },

  /**
   * Updates custom long break duration
   */
  updateCustomLongBreak: (value: number) => {
    set((state) => ({
      customSettings: {
        ...state.customSettings,
        longBreak: value,
      },
    }));
  },

  /**
   * Resets settings to defaults
   */
  resetSettings: () => {
    set({ customSettings: DEFAULT_CUSTOM_SETTINGS });
  },
});
