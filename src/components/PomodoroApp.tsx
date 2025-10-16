import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
// Hooks
import { useTimer } from "../hooks/useTimer";
import { usePomodoroSettings } from "../hooks/usePomodoroSettings";
import { useAudio } from "../hooks/useAudio";
// Components
import { Sidebar } from "./Sidebar";
import { SettingsPanel } from "./Settings";
import { CelebrationModal, BackgroundElements } from "./UI";
import { TopBar, TimerSection } from "./Layout";
// Utils
import { getPhaseColor, getNextPhase } from "../utils/phaseUtils";
import type { Mode } from "../types/pomodoro.types";

export const PomodoroApp = () => {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Settings Hook
  const {
    customSettings,
    setCustomWork,
    setCustomBreak,
    setCustomLongBreak,
    getModeConfigs,
  } = usePomodoroSettings();

  // Audio Hook
  const { playNotification } = useAudio();

  /**
   * Handles phase completion - plays sound and shows celebration
   */
  const handlePhaseComplete = () => {
    playNotification();
    if (timer.phase === "work") {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // Timer Hook
  const timer = useTimer({
    modeConfigs: getModeConfigs(),
    onPhaseComplete: handlePhaseComplete,
  });

  /**
   * Handles mode switching
   */
  const handleModeSwitch = (newMode: Mode) => {
    timer.switchMode(newMode, customSettings.work);
  };

  /**
   * Handles saving settings
   */
  const handleSaveSettings = () => {
    setSettingsOpen(false);
    if (timer.mode === "custom") {
      timer.switchMode("custom", customSettings.work);
    }
  };

  const modeConfigs = getModeConfigs();
  const nextPhase = getNextPhase(
    timer.phase,
    timer.completedSessions,
    timer.mode,
    modeConfigs,
  );

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
      <CelebrationModal isVisible={showCelebration} />

      {/* Sidebar */}
      <AnimatePresence>
        {!focusMode && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentMode={timer.mode}
            onModeChange={handleModeSwitch}
            stats={timer.stats}
            onSettingsClick={() => setSettingsOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        animate={{
          marginLeft: sidebarOpen && !focusMode ? 288 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top Bar */}
        <AnimatePresence>
          {!focusMode && (
            <TopBar
              isSidebarOpen={sidebarOpen}
              onSidebarToggle={() => setSidebarOpen(true)}
              onFocusModeToggle={() => setFocusMode(true)}
            />
          )}
        </AnimatePresence>

        {/* Timer Section */}
        <TimerSection
          phase={timer.phase}
          timeLeft={timer.timeLeft}
          isRunning={timer.isRunning}
          completedSessions={timer.completedSessions}
          sessionsBeforeLong={timer.modeConfig.sessionsBeforeLong}
          taskInput={timer.taskInput}
          currentTask={timer.currentTask}
          nextPhase={nextPhase}
          focusMode={focusMode}
          onTaskInputChange={timer.setTaskInput}
          onToggleTimer={timer.toggleTimer}
          onResetTimer={timer.resetTimer}
          onGetProgress={timer.getProgress}
        />

        {/* Focus Mode Exit Button */}
        <AnimatePresence>
          {focusMode && (
            <motion.button
              onClick={() => setFocusMode(false)}
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
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={customSettings}
        onWorkChange={setCustomWork}
        onBreakChange={setCustomBreak}
        onLongBreakChange={setCustomLongBreak}
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
