/**
 * Current Task Display Component
 *
 * Shows the currently active task name.
 */

interface CurrentTaskDisplayProps {
  taskName: string;
}

export const CurrentTaskDisplay = ({ taskName }: CurrentTaskDisplayProps) => {
  if (!taskName) return null;

  return (
    <div className="mb-6 text-center">
      <p className="text-white/60 text-sm mb-1">Working on</p>
      <p className="text-white text-xl font-medium">{taskName}</p>
    </div>
  );
};
