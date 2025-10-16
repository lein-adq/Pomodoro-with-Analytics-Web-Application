import { useCallback, useEffect, useRef } from "react";

interface UseTimerWorkerOptions {
  onTick: (timeLeft: number) => void;
  onComplete: () => void;
}

export const useTimerWorker = ({
  onTick,
  onComplete,
}: UseTimerWorkerOptions) => {
  const workerRef = useRef<Worker | null>(null);

  /**
   * Refs to hold stable callback references
   */
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  // Update refs when callbacks change
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  /**
   * Initialize worker on mount (only once)
   */
  useEffect(() => {
    // Create worker
    workerRef.current = new Worker("/timer-worker.js");

    // Handle messages from worker
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case "TICK":
          onTickRef.current(payload.timeLeft);
          break;

        case "COMPLETE":
          onCompleteRef.current();
          break;

        case "SYNC_RESPONSE":
          // Worker is confirming the current time
          onTickRef.current(payload.timeLeft);
          break;
      }
    };

    // Handle worker errors
    workerRef.current.onerror = (error) => {
      console.error("Timer worker error:", error);
    };

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []); // Empty deps - only run once on mount

  /**
   * Sync with worker when tab becomes visible again
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && workerRef.current) {
        // Tab is now visible, sync with worker
        workerRef.current.postMessage({ type: "SYNC" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /**
   * Start the timer
   */
  const start = useCallback((timeLeft: number) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "START",
        payload: { timeLeft },
      });
    }
  }, []);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: "PAUSE" });
    }
  }, []);

  /**
   * Resume the timer
   */
  const resume = useCallback((timeLeft: number) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "RESUME",
        payload: { timeLeft },
      });
    }
  }, []);

  /**
   * Stop the timer
   */
  const stop = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: "STOP" });
    }
  }, []);

  return {
    start,
    pause,
    resume,
    stop,
  };
};
