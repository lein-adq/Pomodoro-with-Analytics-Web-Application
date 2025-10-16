/**
 * Celebration Modal Component
 *
 * Animated celebration display shown when a session is completed.
 */

import { Sparkles } from "lucide-react";

interface CelebrationModalProps {
  isVisible: boolean;
}

export const CelebrationModal = ({ isVisible }: CelebrationModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl animate-bounce">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-2">Great Work!</h2>
          <p className="text-white/80 text-lg">Session completed 🎉</p>
        </div>
      </div>
    </div>
  );
};
