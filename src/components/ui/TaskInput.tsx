/**
 * Task Input Component
 *
 * Input field for entering the current task name.
 */

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskInput = ({ value, onChange }: TaskInputProps) => {
  return (
    <div className="mb-6 animate-fade-in">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What are you working on?"
        className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-lg"
      />
    </div>
  );
};
