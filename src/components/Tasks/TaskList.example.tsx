/**
 * Task List Component (Example)
 *
 * This is an example component showing how to use the task management features.
 * You can integrate this into your sidebar or create a dedicated task panel.
 */

import { CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTasks, useTasksActions } from "../../hooks";

/**
 * Formats seconds to hours and minutes
 */
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const TaskListExample = () => {
  const { tasks, activeTaskId } = useTasks();
  const { addTask, selectTask, deleteTask } = useTasksActions();
  const [newTaskName, setNewTaskName] = useState("");

  /**
   * Handles adding a new task
   */
  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim());
      setNewTaskName("");
    }
  };

  /**
   * Handles key press in input
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-4">Tasks</h2>

      {/* Add Task Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          type="button"
          title="Add task"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-white/50 text-center py-4">
            No tasks yet. Add one above!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activeTaskId === task.id
                  ? "bg-white/20 border-white/40"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() =>
                selectTask(task.id === activeTaskId ? null : task.id)
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{task.name}</h3>
                    {activeTaskId === task.id && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{task.completedSessions} sessions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(task.totalFocusTime)}</span>
                    </div>
                  </div>

                  {task.lastWorkedOn && (
                    <p className="text-xs text-white/50 mt-1">
                      Last worked:{" "}
                      {new Date(task.lastWorkedOn).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  type="button"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4 text-red-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm text-white/70">
            <span>Total Tasks:</span>
            <span className="font-semibold">{tasks.length}</span>
          </div>
          <div className="flex justify-between text-sm text-white/70 mt-1">
            <span>Total Sessions:</span>
            <span className="font-semibold">
              {tasks.reduce((sum, t) => sum + t.completedSessions, 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-white/70 mt-1">
            <span>Total Focus Time:</span>
            <span className="font-semibold">
              {formatTime(tasks.reduce((sum, t) => sum + t.totalFocusTime, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
