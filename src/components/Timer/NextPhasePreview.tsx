/**
 * Next Phase Preview Component
 *
 * Shows information about the upcoming phase.
 */

import { ChevronRight } from "lucide-react";
import type { NextPhaseInfo } from "../../types/pomodoro.types";

interface NextPhasePreviewProps {
  nextPhase: NextPhaseInfo;
}

export const NextPhasePreview = ({ nextPhase }: NextPhasePreviewProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-sm">Next up</span>
        <div className="flex items-center gap-2 text-white">
          <span className="font-medium">{nextPhase.name}</span>
          <span className="text-white/60">·</span>
          <span className="text-white/60">{nextPhase.duration}</span>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </div>
      </div>
    </div>
  );
};
