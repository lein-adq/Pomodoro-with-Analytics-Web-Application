import { AnimatePresence, motion } from "motion/react";
import { TimerSection, TopBar } from "./components/Layout";
import { SettingsPanel } from "./components/Settings";
// Components
import { Sidebar } from "./components/Sidebar";
import {
  BackgroundElements,
  CelebrationModal,
  ConfirmDialog,
} from "./components/UI";
// Hooks
import {
  useDocumentTitle,
  useModeConfigs,
  useModeSwitch,
  usePageRefreshWarning,
  useSettingsActions,
  useStatsActions,
  useTimerActions,
  useTimerController,
  useTimerState,
  useUI,
  useUIActions,
} from "./hooks";
// Utils
import { getNextPhase, getPhaseColor } from "./utils/phaseUtils";

/**
 * Main Pomodoro Application Component
 *
 * Orchestrates the timer application by:
 * - Composing specialized hooks for focused responsibilities
 * - Rendering the layout and UI components
 * - Passing appropriate props to child components
 *
 * Heavy lifting is delegated to custom hooks:
 * - useModeConfigs: Mode configuration logic
 * - useTimerController: Timer worker orchestration
 * - useModeSwitch: Mode switching with confirmation
 * - useDocumentTitle: Browser tab title updates
 * - usePageRefreshWarning: Prevent accidental page close
 */
export const PomodoroApp = () => {
  // Timer state and actions
  const timer = useTimerState();
  const timerActions = useTimerActions();

  // UI state and actions
  const ui = useUI();
  const uiActions = useUIActions();

  // Settings and stats actions
  const settingsActions = useSettingsActions();
  const statsActions = useStatsActions();

  // Compute mode configurations
  const modeConfigs = useModeConfigs();

  // Timer orchestration (worker + phase completion)
  useTimerController(modeConfigs);

  // Mode switching with confirmation dialog
  const {
    confirmDialog,
    handleModeSwitch,
    confirmModeSwitch,
    cancelModeSwitch,
  } = useModeSwitch(modeConfigs);

  // Side effects
  useDocumentTitle(timer.timeLeft, timer.isRunning, timer.phase);
  usePageRefreshWarning(timer.isRunning);

  /**
   * Handle settings save
   */
  const handleSaveSettings = () => {
    uiActions.setSettingsOpen(false);
    if (timer.mode === "custom") {
      timerActions.switchMode("custom", modeConfigs);
    }
  };

  // Compute next phase for preview
  const nextPhase = getNextPhase(
    timer.phase,
    timer.completedSessions,
    timer.mode,
    modeConfigs,
  );

  // Get today's stats for display
  const todayStats = statsActions.getTodayStats();

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${getPhaseColor(
        timer.phase,
      )} relative overflow-hidden`}
      key={timer.phase}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Background Elements */}
      <BackgroundElements />

      {/* Celebration Modal */}
      <CelebrationModal isVisible={ui.showCelebration} />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Switch Timer Mode?"
        message={`You have an active session with ${timer.completedSessions} completed session(s). Switching modes will save your current progress but reset the timer. Continue?`}
        confirmText="Switch Mode"
        cancelText="Stay Here"
        onConfirm={confirmModeSwitch}
        onCancel={cancelModeSwitch}
        variant="warning"
      />

      {/* Sidebar */}
      <AnimatePresence>
        {!ui.focusMode && (
          <Sidebar
            isOpen={ui.sidebarOpen}
            onClose={() => uiActions.setSidebarOpen(false)}
            currentMode={timer.mode}
            onModeChange={handleModeSwitch}
            stats={{
              todaysSessions: todayStats.sessions,
              totalFocusTime: todayStats.focusTime,
            }}
            onSettingsClick={() => uiActions.setSettingsOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        animate={{
          marginLeft: ui.sidebarOpen && !ui.focusMode ? 288 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top Bar */}
        <AnimatePresence>
          {!ui.focusMode && (
            <TopBar
              isSidebarOpen={ui.sidebarOpen}
              onSidebarToggle={() => uiActions.setSidebarOpen(true)}
              onFocusModeToggle={() => uiActions.setFocusMode(true)}
            />
          )}
        </AnimatePresence>

        {/* Timer Section */}
        <TimerSection
          phase={timer.phase}
          timeLeft={timer.timeLeft}
          isRunning={timer.isRunning}
          completedSessions={timer.completedSessions}
          sessionsBeforeLong={modeConfigs[timer.mode].sessionsBeforeLong}
          taskInput={timer.taskInput}
          currentTask={timer.currentTask}
          nextPhase={nextPhase}
          focusMode={ui.focusMode}
          onTaskInputChange={timerActions.setTaskInput}
          onToggleTimer={timerActions.toggleTimer}
          onResetTimer={() => timerActions.resetTimer(modeConfigs)}
          onGetProgress={() => timerActions.getProgress(modeConfigs)}
        />

        {/* Focus Mode Exit Button */}
        <AnimatePresence>
          {ui.focusMode && (
            <motion.button
              onClick={() => uiActions.setFocusMode(false)}
              className="fixed bottom-8 right-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 text-sm font-medium hover:bg-white/20"
              type="button"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Exit Focus Mode
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={ui.settingsOpen}
        onClose={() => uiActions.setSettingsOpen(false)}
        settings={modeConfigs.custom}
        onWorkChange={(value) => settingsActions.updateCustomWork(value)}
        onBreakChange={(value) => settingsActions.updateCustomBreak(value)}
        onLongBreakChange={(value) =>
          settingsActions.updateCustomLongBreak(value)
        }
        onSave={handleSaveSettings}
        currentMode={timer.mode}
        currentPhase={timer.phase}
        isRunning={timer.isRunning}
        onTimeLeftUpdate={() => {
          // This is handled within SettingsPanel
        }}
      />
    </motion.div>
  );
};

export default PomodoroApp;
