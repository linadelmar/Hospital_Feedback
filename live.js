let liveStartTime = null;
let liveSteps = {};
let liveInterval = null;

function startLiveTimer() {
  liveStartTime = new Date();
  liveInterval = setInterval(updateLiveTimer, 1000);
  nextStep('live');
}

function updateLiveTimer() {
  const now = new Date();
  const diff = Math.floor((now - liveStartTime) / 1000);
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  document.getElementById('live-timer').textContent = `Total time: ${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Show reminders every 10 minutes
  if (diff % 600 === 0 && diff !== 0) {
    alert(`⏰ You've been here for ${minutes} minutes.\nIf you're still waiting, let us know by starting the next step.`);
  }
}

function startLiveStep(stepName) {
  const now = new Date();
  const sinceStart = Math.floor((now - liveStartTime) / 1000);
  const minutes = Math.floor(sinceStart / 60);
  const seconds = sinceStart % 60;

  liveSteps[stepName] = { time: now, elapsed: `${minutes}m ${seconds}s` };
  document.getElementById(`live-${stepName}`).textContent = `Started after ${minutes}m ${seconds}s.`;
}

function endLiveFeedback() {
  clearInterval(liveInterval);
  console.log("Live session data:", liveSteps);
  nextStep(2); // or nextStep('rating') depending on your app
}

//trying to push this request