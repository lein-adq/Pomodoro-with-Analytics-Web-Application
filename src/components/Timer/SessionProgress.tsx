/**
 * Session Progress Component
 *
 * Visual dots showing progress through sessions before long break.
 */

interface SessionProgressProps {
  completedSessions: number;
  sessionsBeforeLong: number;
}

export const SessionProgress = ({
  completedSessions,
  sessionsBeforeLong,
}: SessionProgressProps) => {
  return (
    <div className="mt-6 flex justify-center gap-2">
      {[...Array(sessionsBeforeLong)].map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all ${
            i < completedSessions % sessionsBeforeLong
              ? "bg-white scale-110"
              : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
};
