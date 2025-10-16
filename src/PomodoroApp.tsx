import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { TimerSection, TopBar } from "./components/Layout";
import { SettingsPanel } from "./components/Settings";
// Components
import { Sidebar } from "./components/Sidebar";
import { BackgroundElements, CelebrationModal } from "./components/UI";
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

  // Ref for interval
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
   * Timer tick effect
   */
  useEffect(() => {
    if (timer.isRunning && timer.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        timerActions.tick();
      }, 1000);
    } else if (timer.timeLeft === 0) {
      handlePhaseComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isRunning, timer.timeLeft]);

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
   * Handles mode switching
   */
  const handleModeSwitch = (newMode: Mode) => {
    timerActions.switchMode(newMode, customSettings.work);
  };

  /**
   * Handles saving settings
   */
  const handleSaveSettings = () => {
    uiActions.setSettingsOpen(false);
    if (timer.mode === "custom") {
      timerActions.switchMode("custom", customSettings.work);
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
      className={`min-h-screen bg-gradient-to-br ${getPhaseColor(timer.phase)} relative overflow-hidden`}
      key={timer.phase}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Background Elements */}
      <BackgroundElements />

      {/* Celebration Modal */}
      <CelebrationModal isVisible={ui.showCelebration} />

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
          onResetTimer={timerActions.resetTimer}
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
