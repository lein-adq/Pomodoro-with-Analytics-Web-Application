import type { StateCreator } from "zustand";
import type { TaskItem, TasksState } from "../types";

export interface TasksActions {
  addTask: (name: string) => TaskItem;
  selectTask: (taskId: string | null) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStats: (taskId: string, sessionTime: number) => void;
  getTaskById: (taskId: string) => TaskItem | undefined;
  getTaskStats: (taskId: string) => {
    sessions: number;
    totalTime: number;
  } | null;
}

export type TasksSlice = TasksState & TasksActions;

const initialState: TasksState = {
  tasks: [],
  activeTaskId: null,
};

/**
 * Generates a simple unique ID
 */
const generateId = () =>
  `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createTasksSlice: StateCreator<TasksSlice, [], [], TasksSlice> = (
  set,
  get,
) => ({
  ...initialState,

  /**
   * Adds a new task to the list
   */
  addTask: (name: string) => {
    const newTask: TaskItem = {
      id: generateId(),
      name,
      createdAt: Date.now(),
      completedSessions: 0,
      totalFocusTime: 0,
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    return newTask;
  },

  /**
   * Selects a task as active
   */
  selectTask: (taskId: string | null) => {
    set({ activeTaskId: taskId });
  },

  /**
   * Deletes a task
   */
  deleteTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId,
    }));
  },

  /**
   * Updates task statistics after a session
   */
  updateTaskStats: (taskId: string, sessionTime: number) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completedSessions: task.completedSessions + 1,
              totalFocusTime: task.totalFocusTime + sessionTime,
              lastWorkedOn: Date.now(),
            }
          : task,
      ),
    }));
  },

  /**
   * Gets a task by ID
   */
  getTaskById: (taskId: string) => {
    return get().tasks.find((task) => task.id === taskId);
  },

  /**
   * Gets statistics for a specific task
   */
  getTaskStats: (taskId: string) => {
    const task = get().getTaskById(taskId);
    if (!task) return null;

    return {
      sessions: task.completedSessions,
      totalTime: task.totalFocusTime,
    };
  },
});
