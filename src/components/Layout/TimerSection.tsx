import { AnimatePresence, motion } from "motion/react";
import type { NextPhaseInfo, Phase } from "../../types/pomodoro.types";
import {
  NextPhasePreview,
  PhaseIndicator,
  SessionProgress,
  TimerControls,
  TimerDisplay,
} from "../Timer";
import { CurrentTaskDisplay, TaskInput } from "../UI";
import { TimerCard } from "./TimerCard";

interface TimerSectionProps {
  phase: Phase;
  timeLeft: number;
  isRunning: boolean;
  completedSessions: number;
  sessionsBeforeLong: number;
  taskInput: string;
  currentTask: string;
  nextPhase: NextPhaseInfo;
  focusMode: boolean;
  onTaskInputChange: (value: string) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onGetProgress: () => number;
}

export const TimerSection = ({
  phase,
  timeLeft,
  isRunning,
  completedSessions,
  sessionsBeforeLong,
  taskInput,
  currentTask,
  nextPhase,
  focusMode,
  onTaskInputChange,
  onToggleTimer,
  onResetTimer,
  onGetProgress,
}: TimerSectionProps) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-88px)] p-6">
      <motion.div
        className="max-w-2xl w-full"
        animate={{
          scale: focusMode ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Phase Indicator */}
        <PhaseIndicator phase={phase} />

        {/* Task Input */}
        <AnimatePresence>
          {!isRunning && phase === "work" && !focusMode && (
            <TaskInput value={taskInput} onChange={onTaskInputChange} />
          )}
        </AnimatePresence>

        {/* Current Task Display */}
        <CurrentTaskDisplay taskName={currentTask} />

        {/* Main Timer Card */}
        <TimerCard>
          {/* Timer Display */}
          <TimerDisplay
            timeLeft={timeLeft}
            progress={onGetProgress()}
            isRunning={isRunning}
            sessionNumber={completedSessions + 1}
            phase={phase}
          />

          {/* Controls */}
          <TimerControls
            isRunning={isRunning}
            onToggle={onToggleTimer}
            onReset={onResetTimer}
          />

          {/* Next Phase Preview */}
          <AnimatePresence>
            {!focusMode && <NextPhasePreview nextPhase={nextPhase} />}
          </AnimatePresence>

          {/* Session Progress */}
          <SessionProgress
            completedSessions={completedSessions}
            sessionsBeforeLong={sessionsBeforeLong}
          />
        </TimerCard>
      </motion.div>
    </div>
  );
};
