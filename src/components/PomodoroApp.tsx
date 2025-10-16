/**
 * Pomodoro App - Main Component
 *
 * This is the main orchestrator component that brings together all
 * the smaller components, hooks, and utilities to create the complete
 * Pomodoro timer application.
 */

import { useState } from "react";
import type { Mode } from "../types/pomodoro.types";

// Hooks
import { useTimer } from "../hooks/useTimer";
import { usePomodoroSettings } from "../hooks/usePomodoroSettings";
import { useAudio } from "../hooks/useAudio";

// Components
import { Sidebar } from "./Sidebar";
import { SettingsPanel } from "./Settings";
import {
  TaskInput,
  CelebrationModal,
  CurrentTaskDisplay,
  BackgroundElements,
} from "./UI";
import {
  PhaseIndicator,
  TimerDisplay,
  TimerControls,
  NextPhasePreview,
  SessionProgress,
} from "./Timer";
import { TopBar, TimerCard } from "./Layout";

// Utils
import { getPhaseColor, getNextPhase } from "../utils/phaseUtils";

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
    <div
      className={`min-h-screen bg-gradient-to-br ${getPhaseColor(timer.phase)} transition-all duration-1000 relative overflow-hidden`}
    >
      {/* Background Elements */}
      <BackgroundElements />

      {/* Celebration Modal */}
      <CelebrationModal isVisible={showCelebration} />

      {/* Sidebar */}
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

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen && !focusMode ? "ml-72" : "ml-0"}`}
      >
        {/* Top Bar */}
        {!focusMode && (
          <TopBar
            isSidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            onFocusModeToggle={() => setFocusMode(true)}
          />
        )}

        {/* Timer Section */}
        <div className="flex items-center justify-center min-h-screen p-6">
          <div
            className={`max-w-2xl w-full transition-all duration-500 ${focusMode ? "scale-110" : ""}`}
          >
            {/* Phase Indicator */}
            <PhaseIndicator phase={timer.phase} />

            {/* Task Input */}
            {!timer.isRunning && timer.phase === "work" && !focusMode && (
              <TaskInput
                value={timer.taskInput}
                onChange={timer.setTaskInput}
              />
            )}

            {/* Current Task Display */}
            <CurrentTaskDisplay taskName={timer.currentTask} />

            {/* Main Timer Card */}
            <TimerCard>
              {/* Timer Display */}
              <TimerDisplay
                timeLeft={timer.timeLeft}
                progress={timer.getProgress()}
                isRunning={timer.isRunning}
                sessionNumber={timer.completedSessions + 1}
              />

              {/* Controls */}
              <TimerControls
                isRunning={timer.isRunning}
                onToggle={timer.toggleTimer}
                onReset={timer.resetTimer}
              />

              {/* Next Phase Preview */}
              {!focusMode && <NextPhasePreview nextPhase={nextPhase} />}

              {/* Session Progress */}
              <SessionProgress
                completedSessions={timer.completedSessions}
                sessionsBeforeLong={timer.modeConfig.sessionsBeforeLong}
              />
            </TimerCard>
          </div>
        </div>

        {/* Focus Mode Exit Button */}
        {focusMode && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed bottom-8 right-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 text-sm font-medium"
            type="button"
          >
            Exit Focus Mode
          </button>
        )}
      </div>

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
        onTimeLeftUpdate={(value) => {
          // This is handled within SettingsPanel
        }}
      />
    </div>
  );
};

export default PomodoroApp;
