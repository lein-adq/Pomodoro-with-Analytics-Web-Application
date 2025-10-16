import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TimerSection, TopBar } from "./components/Layout";
import { SettingsPanel } from "./components/Settings";
// Components
import { Sidebar } from "./components/Sidebar";
import {
  BackgroundElements,
  CelebrationModal,
  ConfirmDialog,
} from "./components/UI";
// Constants
import {
  DEFAULT_ANIMEDORO_CONFIG,
  DEFAULT_POMODORO_CONFIG,
} from "./constants/pomodoro.constants";
// Hooks
import {
  useAudio,
  useSettings,
  useSettingsActions,
  useStatsActions,
  useTimerActions,
  useTimerState,
  useTimerWorker,
  useUI,
  useUIActions,
} from "./hooks";
import type { Mode, ModeConfigs } from "./types/pomodoro.types";
// Utils
import { getNextPhase, getPhaseColor } from "./utils/phaseUtils";

export const PomodoroApp = () => {
  // Store hooks
  const timer = useTimerState();
  const timerActions = useTimerActions();
  const { customSettings } = useSettings();
  const settingsActions = useSettingsActions();
  const statsActions = useStatsActions();
  const ui = useUI();
  const uiActions = useUIActions();

  // Audio Hook
  const { playNotification } = useAudio();

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    mode: Mode | null;
  }>({
    isOpen: false,
    mode: null,
  });

  // Previous isRunning state to detect changes
  const prevIsRunningRef = useRef(timer.isRunning);

  /**
   * Get mode configurations
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

  const modeConfigs = getModeConfigs();

  /**
   * Timer worker for accurate timing
   */
  const worker = useTimerWorker({
    onTick: (timeLeft) => {
      timerActions.setTimeLeft(timeLeft);
    },
    onComplete: () => {
      handlePhaseComplete();
    },
  });

  /**
   * Page refresh warning effect
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if timer is actively running
      if (timer.isRunning) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [timer.isRunning]);

  /**
   * Control worker based on timer state changes
   */
  useEffect(() => {
    const wasRunning = prevIsRunningRef.current;
    const isNowRunning = timer.isRunning;

    // Only start/pause when the running state actually changes
    if (isNowRunning && !wasRunning) {
      // Just started - start worker with current time
      worker.start(timer.timeLeft);
    } else if (!isNowRunning && wasRunning) {
      // Just paused/stopped - pause worker
      worker.pause();
    }

    // Update ref for next render
    prevIsRunningRef.current = isNowRunning;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isRunning]);

  /**
   * Stop worker when timer is reset (completedSessions becomes 0 while not running)
   */
  useEffect(() => {
    if (
      !timer.isRunning &&
      timer.completedSessions === 0 &&
      timer.phase === "work"
    ) {
      worker.stop();
    }
  }, [timer.completedSessions, timer.phase, timer.isRunning]);

  /**
   * Update document title with timer
   */
  useEffect(() => {
    if (timer.isRunning) {
      const minutes = Math.floor(timer.timeLeft / 60);
      const seconds = timer.timeLeft % 60;
      const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      document.title = `${timeStr} - ${
        timer.phase === "work"
          ? "Focus"
          : timer.phase === "longBreak"
            ? "Long Break"
            : "Break"
      }`;
    } else {
      document.title = "Focus Time - Pomodoro Timer";
    }
  }, [timer.timeLeft, timer.isRunning, timer.phase]);

  /**
   * Handles phase completion - plays sound, shows celebration, adds to stats
   */
  const handlePhaseComplete = () => {
    playNotification();

    // Add to session history
    const config = modeConfigs[timer.mode];
    const duration =
      timer.phase === "work"
        ? config.work
        : timer.phase === "break"
          ? config.break
          : config.longBreak;

    statsActions.addSession(
      duration,
      timer.mode,
      timer.phase,
      timer.currentTask,
    );

    // Show celebration for work completion
    if (timer.phase === "work") {
      uiActions.triggerCelebration();
      setTimeout(() => uiActions.hideCelebration(), 3000);
    }

    // Advance to next phase
    timerActions.completePhase(modeConfigs);
  };

  /**
   * Handles mode switching with confirmation if there's progress
   */
  const handleModeSwitch = (newMode: Mode) => {
    // Check if there's progress that would be lost
    const hasProgress =
      timer.timeLeft > 0 &&
      (timer.completedSessions > 0 || timer.currentTask !== "");

    // If there's progress and not already on this mode, show confirmation
    if (hasProgress && timer.mode !== newMode) {
      setConfirmDialog({ isOpen: true, mode: newMode });
    } else {
      // No progress or same mode, switch directly
      timerActions.switchMode(newMode, modeConfigs);
    }
  };

  /**
   * Confirms mode switch and executes it
   */
  const confirmModeSwitch = () => {
    if (confirmDialog.mode) {
      timerActions.switchMode(confirmDialog.mode, modeConfigs);
      setConfirmDialog({ isOpen: false, mode: null });
    }
  };

  /**
   * Cancels mode switch
   */
  const cancelModeSwitch = () => {
    setConfirmDialog({ isOpen: false, mode: null });
  };

  /**
   * Handles saving settings
   */
  const handleSaveSettings = () => {
    uiActions.setSettingsOpen(false);
    if (timer.mode === "custom") {
      timerActions.switchMode("custom", modeConfigs);
    }
  };

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
        settings={customSettings}
        onWorkChange={settingsActions.updateCustomWork}
        onBreakChange={settingsActions.updateCustomBreak}
        onLongBreakChange={settingsActions.updateCustomLongBreak}
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
