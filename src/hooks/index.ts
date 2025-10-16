/**
 * Hooks Barrel Export
 */

// Store hooks (re-exported for convenience)
export {
  useSettings,
  useSettingsActions,
  useStats,
  useStatsActions,
  useTasks,
  useTasksActions,
  useTimer,
  useTimerActions,
  useTimerState,
  useUI,
  useUIActions,
} from "../store/hooks";

// Local hooks
export { useAudio } from "./useAudio";
export { useTimerWorker } from "./useTimerWorker";

// Specialized hooks for app logic
export { useDocumentTitle } from "./useDocumentTitle";
export { usePageRefreshWarning } from "./usePageRefreshWarning";
export { useModeConfigs } from "./useModeConfigs";
export { usePhaseCompletion } from "./usePhaseCompletion";
export { useTimerController } from "./useTimerController";
export { useModeSwitch } from "./useModeSwitch";
