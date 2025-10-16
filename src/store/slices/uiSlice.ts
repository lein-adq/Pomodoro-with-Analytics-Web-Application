/**
 * UI Slice
 *
 * Manages UI state like sidebar, settings panel, focus mode
 */

import type { StateCreator } from "zustand";
import type { UIState } from "../types";

export interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
  toggleFocusMode: () => void;
  setFocusMode: (enabled: boolean) => void;
  triggerCelebration: () => void;
  hideCelebration: () => void;
}

export type UISlice = UIState & UIActions;

const initialState: UIState = {
  sidebarOpen: true,
  settingsOpen: false,
  focusMode: false,
  showCelebration: false,
};

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  ...initialState,

  /**
   * Toggles sidebar open/closed
   */
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  /**
   * Sets sidebar open state
   */
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  /**
   * Toggles settings panel open/closed
   */
  toggleSettings: () => {
    set((state) => ({ settingsOpen: !state.settingsOpen }));
  },

  /**
   * Sets settings panel open state
   */
  setSettingsOpen: (open: boolean) => {
    set({ settingsOpen: open });
  },

  /**
   * Toggles focus mode on/off
   */
  toggleFocusMode: () => {
    set((state) => ({ focusMode: !state.focusMode }));
  },

  /**
   * Sets focus mode state
   */
  setFocusMode: (enabled: boolean) => {
    set({ focusMode: enabled });
  },

  /**
   * Shows celebration modal
   */
  triggerCelebration: () => {
    set({ showCelebration: true });
  },

  /**
   * Hides celebration modal
   */
  hideCelebration: () => {
    set({ showCelebration: false });
  },
});
