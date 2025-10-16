import type { ModeConfig } from "../types/pomodoro.types";

export const DEFAULT_POMODORO_CONFIG: ModeConfig = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
  sessionsBeforeLong: 4,
};

export const DEFAULT_ANIMEDORO_CONFIG: ModeConfig = {
  work: 40 * 60,
  break: 20 * 60,
  longBreak: 20 * 60,
  sessionsBeforeLong: 2,
};

export const DEFAULT_CUSTOM_SETTINGS = {
  work: 25,
  break: 5,
  longBreak: 15,
};
