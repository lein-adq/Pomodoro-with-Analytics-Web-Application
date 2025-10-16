# Pomodoro App Architecture

## Overview

The Pomodoro application has been refactored from a single monolithic component into a clean, modular architecture with clear separation of concerns.

## Project Structure

```
src/
├── components/           # All React components
│   ├── Layout/          # Layout components (TopBar, TimerCard)
│   ├── Sidebar/         # Sidebar and related components
│   ├── Settings/        # Settings panel
│   ├── Timer/           # Timer-related components
│   ├── UI/              # Reusable UI components
│   └── PomodoroApp.tsx  # Main orchestrator component
│
├── hooks/               # Custom React hooks
│   ├── useAudio.ts      # Audio notification logic
│   ├── usePomodoroSettings.ts  # Settings management
│   └── useTimer.ts      # Core timer logic
│
├── types/               # TypeScript type definitions
│   └── pomodoro.types.ts
│
├── constants/           # App constants and configurations
│   └── pomodoro.constants.ts
│
└── utils/               # Utility functions
    ├── formatTime.ts    # Time formatting
    └── phaseUtils.ts    # Phase-related utilities
```

## Component Hierarchy

```
PomodoroApp (Main Orchestrator)
├── BackgroundElements
├── CelebrationModal
├── Sidebar
│   ├── ModeSelector
│   └── StatsDisplay
├── TopBar
├── PhaseIndicator
├── TaskInput
├── CurrentTaskDisplay
├── TimerCard
│   ├── TimerDisplay
│   ├── TimerControls
│   ├── NextPhasePreview
│   └── SessionProgress
└── SettingsPanel
```

## Component Responsibilities

### Main Components

- **PomodoroApp**: Main orchestrator that manages global state and coordinates all child components
- **Sidebar**: Contains mode selection and statistics
- **TimerCard**: Main timer interface container

### Timer Components (`components/Timer/`)

- **PhaseIndicator**: Shows current phase (Work/Break) with icon
- **TimerDisplay**: SVG circular timer with animated progress ring
- **TimerControls**: Play/Pause and Reset buttons
- **NextPhasePreview**: Shows upcoming phase information
- **SessionProgress**: Visual dots indicating session progress

### Sidebar Components (`components/Sidebar/`)

- **Sidebar**: Main sidebar container
- **ModeSelector**: Mode switching buttons (Pomodoro/Animedoro/Custom)
- **StatsDisplay**: Today's statistics (sessions, focus time)

### UI Components (`components/UI/`)

- **TaskInput**: Input field for task name
- **CelebrationModal**: Success animation on session completion
- **CurrentTaskDisplay**: Shows active task name
- **BackgroundElements**: Animated background decorations

### Layout Components (`components/Layout/`)

- **TopBar**: Navigation with sidebar toggle and focus mode
- **TimerCard**: Glassmorphic card container for timer

### Settings Components (`components/Settings/`)

- **SettingsPanel**: Modal for custom timer duration configuration

## Custom Hooks

### `useTimer`
**Purpose**: Core timer logic and state management

**Responsibilities**:
- Timer countdown logic
- Phase transitions (work → break → work)
- Session tracking
- Statistics accumulation

**State**:
- `mode`, `phase`, `timeLeft`, `isRunning`
- `completedSessions`, `currentTask`, `taskInput`
- `stats` (today's sessions and focus time)

**Methods**:
- `toggleTimer()` - Start/pause timer
- `resetTimer()` - Reset to initial state
- `switchMode()` - Change timer mode
- `getProgress()` - Calculate progress percentage

### `usePomodoroSettings`
**Purpose**: Manage custom timer settings

**Responsibilities**:
- Store custom durations (work, break, long break)
- Generate mode configurations
- Update custom values

**Methods**:
- `getModeConfigs()` - Get all mode configurations
- `setCustomWork()`, `setCustomBreak()`, `setCustomLongBreak()`

### `useAudio`
**Purpose**: Handle audio notifications

**Responsibilities**:
- Play notification sounds using Web Audio API
- Generate tone when phases complete

**Methods**:
- `playNotification()` - Play completion sound

## Type System

### Core Types (`types/pomodoro.types.ts`)

- **Mode**: `'pomodoro' | 'animedoro' | 'custom'`
- **Phase**: `'work' | 'break' | 'longBreak'`
- **ModeConfig**: Configuration for each mode (durations, sessions)
- **Stats**: User statistics (sessions, focus time)
- **TimerState**: Complete timer state
- **CustomSettings**: User-defined durations

## Utilities

### `formatTime`
Converts seconds to MM:SS format for display

### `getPhaseColor`
Returns Tailwind gradient classes based on current phase

### `getNextPhase`
Calculates information about the upcoming phase

## Data Flow

1. **User Interaction** → Component handler
2. **Component** → Calls hook method
3. **Hook** → Updates state
4. **State Change** → Re-render affected components
5. **Component** → Displays updated UI

## Key Features

### State Management
- Local component state for UI (sidebar, modals, focus mode)
- Custom hooks for business logic (timer, settings)
- Props for component communication

### Type Safety
- Full TypeScript coverage
- Explicit interfaces for all props
- Type-safe state management

### Separation of Concerns
- **Presentation**: Components handle rendering
- **Logic**: Hooks handle business logic
- **Utilities**: Pure functions for reusable operations
- **Types**: Centralized type definitions

### Code Organization
- Each component in its own file
- Barrel exports (`index.ts`) for clean imports
- Logical folder grouping by feature
- Comprehensive JSDoc comments

## Best Practices Applied

1. **Single Responsibility**: Each component/hook has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Shared logic in hooks and utils
3. **Composition**: Small, composable components
4. **Type Safety**: Full TypeScript coverage
5. **Documentation**: JSDoc comments on all functions
6. **Clean Imports**: Barrel exports for organized imports
7. **Maintainability**: Easy to locate, modify, and extend code

## Benefits of This Architecture

1. **Maintainability**: Easy to find and modify specific features
2. **Testability**: Small, focused units are easier to test
3. **Reusability**: Components and hooks can be reused
4. **Scalability**: Easy to add new features without affecting existing code
5. **Readability**: Clear structure makes code easy to understand
6. **Type Safety**: Catch errors at compile time
7. **Collaboration**: Multiple developers can work on different components

