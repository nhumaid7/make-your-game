let timerInterval = null;
let elapsedTime = 0;

function startTimer() {
  stopTimer(); // prevent duplicates
  elapsedTime = 0;

  timerInterval = setInterval(() => {
    elapsedTime++;

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    document.getElementById("timer").textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function resumeTimer() {
  timerInterval = setInterval(() => {
    elapsedTime++;

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    document.getElementById("timer").textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);
}