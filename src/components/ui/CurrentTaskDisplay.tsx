import { motion, AnimatePresence } from "motion/react";

interface CurrentTaskDisplayProps {
  taskName: string;
}

export const CurrentTaskDisplay = ({ taskName }: CurrentTaskDisplayProps) => {
  return (
    <AnimatePresence>
      {taskName && (
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-white/60 text-sm mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Working on
          </motion.p>
          <motion.p
            className="text-white text-xl font-medium"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {taskName}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
