// ------------------ TASK DATA ------------------
const tasks = [
  { text: "Go for a walk", points: 100 },
  { text: "Journal", points: 100 },
  { text: "Eat breakfast", points: 100 },
  { text: "Take a break", points: 100 },
  { text: "Meditate", points: 100 },
  { text: "Read 15 mins", points: 100 },
  { text: "Clean small space", points: 50 }
];

// ------------------ DOM ELEMENTS ------------------
const taskList = document.getElementById("tasklist");
const totalPointsEl = document.querySelector(".total_points h3");
const pointsTillNextPhaseEl = document.querySelector(".points_till_next_phase h3");
const pointsTillLaunchEl = document.querySelector(".points_till_launch h3");
const progressBarEl = document.querySelector(".progress-bar");

const rocketSpace = document.querySelector(".rocket_space");
const rocketPhases = rocketSpace.querySelectorAll("div"); // Phase1-4

const phasePoints = [100, 200, 300, 400];
const launchPoints = 400;

const launchBtn = document.getElementById("launchBtn");
const launchMessage = document.getElementById("launchMessage");

let totalPoints = 0;

// ------------------ BUILD TASK LIST ------------------
tasks.forEach((task, index) => {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `task-${index}`;
  checkbox.dataset.points = task.points;

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = task.text;

  const pointsSpan = document.createElement("span");
  pointsSpan.textContent = ` (${task.points} pts)`;
  pointsSpan.style.color = "#888";
  pointsSpan.style.fontSize = "0.9em";
  label.appendChild(pointsSpan);

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    reorderTasks();
    refreshUI();
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  taskList.appendChild(li);
});

// ------------------ REORDER TASKS ------------------
function reorderTasks() {
  const allTasks = Array.from(taskList.querySelectorAll("li"));
  allTasks.forEach(li => {
    const checkbox = li.querySelector("input[type='checkbox']");
    if (checkbox.checked) {
      taskList.appendChild(li); // move completed tasks to bottom
    } else {
      taskList.insertBefore(li, taskList.firstChild); // keep unchecked at top
    }
  });
}

// ------------------ REFRESH UI ------------------
function refreshUI() {
  totalPoints = 0;
  document.querySelectorAll("#tasklist li input[type='checkbox']").forEach(cb => {
    if (cb.checked) totalPoints += parseInt(cb.dataset.points);
  });

  totalPointsEl.textContent = `Total Points: ${totalPoints}`;

  let currentPhase = 0;
  for (let i = 0; i < phasePoints.length; i++) {
    if (totalPoints >= phasePoints[i]) currentPhase = i + 1;
  }

  rocketPhases.forEach((phase, idx) => {
    phase.style.display = (idx === currentPhase - 1) ? "block" : "none";
  });

  pointsTillNextPhaseEl.textContent =
    (currentPhase < phasePoints.length)
      ? `Points until next phase: ${phasePoints[currentPhase] - totalPoints}`
      : `Points until next phase: 0`;

  pointsTillLaunchEl.textContent = `Points until launch: ${launchPoints - totalPoints}`;

  const progressPercent = Math.min((totalPoints / launchPoints) * 100, 100);
  progressBarEl.style.width = progressPercent + "%";

  if (totalPoints >= launchPoints) {
    launchBtn.classList.remove("grey");
    launchBtn.classList.add("red");
  } else {
    launchBtn.classList.remove("red");
    launchBtn.classList.add("grey");
  }

  // Save state in localStorage
  saveToLocal();
}

// ------------------ LOCAL STORAGE ------------------
function saveToLocal() {
  const state = [];
  document.querySelectorAll("#tasklist li input[type='checkbox']").forEach(cb => {
    state.push(cb.checked);
  });
  localStorage.setItem("tasksState", JSON.stringify(state));
  localStorage.setItem("totalPoints", totalPoints);
}

function loadFromLocal() {
  const savedState = JSON.parse(localStorage.getItem("tasksState") || "[]");
  savedState.forEach((checked, index) => {
    const checkbox = document.getElementById(`task-${index}`);
    if (checkbox) {
      checkbox.checked = checked;
      if (checked) checkbox.parentElement.classList.add("completed");
    }
  });
  refreshUI();
}

// ------------------ LAUNCH BUTTON ------------------
launchBtn.onclick = () => {
  if (totalPoints < launchPoints) {
    launchMessage.textContent = "You do not have enough points to launch!";
    launchMessage.style.display = "block";
    setTimeout(() => { launchMessage.style.display = "none"; }, 3000);
  } else {
    // Reset tasks
    document.querySelectorAll("#tasklist li input[type='checkbox']").forEach(cb => {
      cb.checked = false;
      cb.parentElement.classList.remove("completed");
    });
    refreshUI();
  }
};

// ------------------ STARS (for decoration) ------------------
const starsContainer = document.querySelector('.stars');
if (starsContainer) {
  const numStars = 200;
  const maxStarSize = 3;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * maxStarSize + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.opacity = Math.random() * 0.8 + 0.2;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    starsContainer.appendChild(star);
  }
}

// ------------------ INITIAL LOAD ------------------
window.addEventListener("load", () => {
  loadFromLocal();
});
