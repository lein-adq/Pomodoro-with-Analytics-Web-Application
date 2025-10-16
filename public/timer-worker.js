let timerInterval = null;
let startTime = null;
let targetTime = null;
let isRunning = false;

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case "START":
      startTimer(payload.timeLeft);
      break;

    case "PAUSE":
      pauseTimer();
      break;

    case "RESUME":
      resumeTimer(payload.timeLeft);
      break;

    case "STOP":
      stopTimer();
      break;

    case "SYNC":
      // Main thread is checking if we're still in sync
      if (isRunning && targetTime) {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((targetTime - now) / 1000));
        self.postMessage({ type: "SYNC_RESPONSE", payload: { timeLeft } });
      }
      break;
  }
};

function startTimer(timeLeft) {
  isRunning = true;
  startTime = Date.now();
  targetTime = startTime + timeLeft * 1000;

  // Clear any existing interval
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Send immediate update
  self.postMessage({ type: "TICK", payload: { timeLeft } });

  // Tick every second
  timerInterval = setInterval(() => {
    if (!isRunning) return;

    const now = Date.now();
    const timeLeft = Math.max(0, Math.ceil((targetTime - now) / 1000));

    self.postMessage({ type: "TICK", payload: { timeLeft } });

    if (timeLeft === 0) {
      self.postMessage({ type: "COMPLETE" });
      stopTimer();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resumeTimer(timeLeft) {
  startTimer(timeLeft);
}

function stopTimer() {
  isRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  startTime = null;
  targetTime = null;
}
