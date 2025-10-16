/**
 * Store Migrations
 *
 * Handles versioning and migration of persisted state
 */

import type { PersistedState } from "./types";

/**
 * Current state version
 */
export const CURRENT_VERSION = 1;

/**
 * Migration function type
 */
type MigrationFn = (state: Record<string, unknown>) => Record<string, unknown>;

/**
 * Migration map: version -> migration function
 */
const migrations: Record<number, MigrationFn> = {
  // Example migration from v0 to v1
  // 1: (state: any) => {
  //   return {
  //     ...state,
  //     // Add new fields, transform old data, etc.
  //   };
  // },
};

/**
 * Migrates persisted state to current version
 */
export const migrateState = (
  persistedState: unknown,
): PersistedState | null => {
  try {
    const state = persistedState as Record<string, unknown>;
    const version = (state?.version as number) || 0;

    // If already at current version, return as-is
    if (version === CURRENT_VERSION) {
      return state as unknown as PersistedState;
    }

    // Apply migrations sequentially
    let currentState = state;
    for (let v = version + 1; v <= CURRENT_VERSION; v++) {
      const migrationFn = migrations[v];
      if (migrationFn) {
        currentState = migrationFn(currentState);
        currentState.version = v;
      }
    }

    return currentState as unknown as PersistedState;
  } catch (error) {
    console.error("State migration failed:", error);
    return null;
  }
};

/**
 * Validates that the persisted state structure is valid
 */
export const validateState = (state: unknown): boolean => {
  try {
    // Basic validation checks
    if (!state || typeof state !== "object") {
      return false;
    }

    const stateObj = state as Record<string, unknown>;
    // Check for required top-level fields
    const hasVersion = typeof stateObj.version === "number";

    // Could add more specific validation here
    return hasVersion;
  } catch {
    return false;
  }
};

/**
 * Clears persisted state (for debugging or reset)
 */
export const clearPersistedState = () => {
  try {
    localStorage.removeItem("pomodoro-app-state");
    console.log("Persisted state cleared");
  } catch (error) {
    console.error("Failed to clear persisted state:", error);
  }
};
