import { motion } from "motion/react";

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskInput = ({ value, onChange }: TaskInputProps) => {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What are you working on?"
        className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl text-white placeholder-white/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-lg"
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );
};
