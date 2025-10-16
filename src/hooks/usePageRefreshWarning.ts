import { useEffect } from "react";

/**
 * Custom hook to warn users before page refresh when timer is running
 *
 * Prevents accidental loss of active timer session by showing
 * a browser confirmation dialog when user tries to:
 * - Close the tab
 * - Refresh the page
 * - Navigate away
 */
export const usePageRefreshWarning = (isRunning: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if timer is actively running
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning]);
};
