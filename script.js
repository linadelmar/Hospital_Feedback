let currentStep = 0;
let selectedLanguage = 'en';
let feedbackFlow = 'full';
const totalSteps = 6;

const feedback = {
  registration: 0,
  triage: 0,
  doctor: 0,
  comments: ''
};

let selectedSteps = ['registration', 'triage', 'doctor'];

function updateProgress(step) {
  const percent = ((step - 1) / (totalSteps - 1)) * 100;
  document.getElementById('progressFill').style.width = `${percent}%`;
}

function nextStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${step}`).classList.add('active');
  currentStep = step;
  updateProgress(step);
}

function prevStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-${step}`).classList.add('active');
  currentStep = step;
  updateProgress(step);
}

function selectLanguage(lang) {
  selectedLanguage = lang;
  nextStep(1);
}

function chooseFlow(type) {
  if (type === 'partial') {
    nextStep(15);
  } else if (type === 'live') {
    startLiveTimer();
  } else {
    selectedSteps = ['registration', 'triage', 'doctor'];
    nextStep(2);
  }
}


function startSelectedFlow() {
  selectedSteps = [];
  if (document.getElementById('check-registration').checked) selectedSteps.push('registration');
  if (document.getElementById('check-triage').checked) selectedSteps.push('triage');
  if (document.getElementById('check-doctor').checked) selectedSteps.push('doctor');

  if (selectedSteps.length === 0) {
    alert("Please select at least one step.");
    return;
  }

  goToStepByKey(selectedSteps[0]);
}

function goToNextRatingStep(currentKey) {
  const index = selectedSteps.indexOf(currentKey);
  if (index === -1) return;

  // Validate current step has a rating
  if (feedback[currentKey] === 0) {
    alert("Please provide a rating before continuing.");
    return;
  }

  const nextKey = selectedSteps[index + 1];
  if (nextKey) {
    goToStepByKey(nextKey);
  } else {
    nextStep(5); // comments
  }
}

function goToStepByKey(key) {
  const stepMap = {
    registration: 2,
    triage: 3,
    doctor: 4
  };
  nextStep(stepMap[key]);
}

// Build stars
document.querySelectorAll('.stars').forEach(div => {
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.textContent = '★';
    star.dataset.value = i;

    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value);
      const key = div.dataset.step;
      feedback[key] = value;

      [...div.children].forEach(s => s.classList.remove('selected'));
      for (let j = 0; j < value; j++) {
        div.children[j].classList.add('selected');
      }
    });

    div.appendChild(star);
  }
});

function showSummary() {
  // Check if any selected step is unrated
  const incomplete = selectedSteps.filter(step => feedback[step] === 0);
  if (incomplete.length > 0) {
    alert("Please complete all selected steps before continuing.");
    goToStepByKey(incomplete[0]);
    return;
  }

  feedback.comments = document.getElementById('comments').value;

  const avg = Math.round(
    (feedback.registration + feedback.triage + feedback.doctor) / 3 * 10
  ) / 10;

  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.round(avg) ? '★' : '☆';
  }

  const copyText = `${feedback.comments}\n\nRating: ${avg}/5`;
  document.getElementById('copyMessage').innerHTML =
    `Thank you for your feedback!<br><strong>${stars} (${avg}/5)</strong>`;

  const manualCopy = document.getElementById('manualCopyBox');
  const googleBtn = document.getElementById('googleButton');
  const emailBox = document.getElementById('emailBox');

  if (avg >= 4) {
    manualCopy.style.display = 'block';
    googleBtn.style.display = 'inline-block';
    emailBox.style.display = 'none';
    document.getElementById('manualCopyText').value = copyText;
  } else {
    manualCopy.style.display = 'none';
    googleBtn.style.display = 'none';
    emailBox.style.display = 'block';
  }

  nextStep(6);
}

function redirectToGoogle() {
  const placeID = "ChIJB8hzTypoA4wRqh01PV3BhZw";
  const url = `https://search.google.com/local/writereview?placeid=${placeID}`;
  window.location.href = url;
}

function copyManually() {
  const textarea = document.getElementById('manualCopyText');
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    alert("Copied! Now paste it on the review.");
  } catch {
    alert("Manual copy failed.");
  }
}

function sendFollowUpEmail() {
  const email = document.getElementById('userEmail').value.trim();
  const message = feedback.comments;

  if (!email || !email.includes('@')) {
    alert("Please enter a valid email address.");
    return;
  }

  console.log(`Sending follow-up to ${email}:\nThank you for your feedback. We will keep your message in mind.`);
  alert("Thank you! We'll be in touch.");
  document.getElementById('emailBox').innerHTML = "<p>Thank you! Your email was received.</p>";
}
