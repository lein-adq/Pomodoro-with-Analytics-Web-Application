import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CelebrationModalProps {
  isVisible: boolean;
}

export const CelebrationModal = ({ isVisible }: CelebrationModalProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: [0, -5, 5, -5, 0],
            }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              rotate: {
                duration: 0.5,
                repeat: 2,
                ease: "easeInOut",
              },
            }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Great Work!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-lg"
              >
                Session completed 🎉
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
