const tasks = [
  { text: "Go for a walk", points: 100},
  { text: "Journal", points: 100},
  { text: "Eat breakfast", points: 100},
  { text: "Take a break", points: 100},
  { text: "Meditate", points: 100},
  { text: "Read 15 mins", points: 100},
  { text: "Clean small space", points: 50}
];

// DOM elements
const taskList = document.getElementById("tasklist");
const calculateBtn = document.querySelector(".calculate-points");
const totalPointsEl = document.querySelector(".total_points h3");
const pointsTillNextPhaseEl = document.querySelector(".points_till_next_phase h3");
const pointsTillLaunchEl = document.querySelector(".points_till_launch h3");
const progressBarEl = document.querySelector(".progress-bar");

const rocketSpace = document.querySelector(".rocket_space");
const rocketPhases = rocketSpace.querySelectorAll("div"); // Phase1-4

const phasePoints = [100, 200, 300, 400];
const launchPoints = 400;

// Build task list
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
    setTimeout(() => {
      if (checkbox.checked) taskList.appendChild(li);
      else {
        const firstCompleted = taskList.querySelector(".completed");
        if (firstCompleted) taskList.insertBefore(li, firstCompleted);
        else taskList.appendChild(li);
      }
    }, 500);
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  taskList.appendChild(li);
});

// Calculate points
calculateBtn.addEventListener("click", () => {
  let totalPoints = 0;
  document.querySelectorAll("#tasklist li input[type='checkbox']").forEach(checkbox => {
    if (checkbox.checked) totalPoints += parseInt(checkbox.dataset.points);
  });

  totalPointsEl.textContent = `Total Points: ${totalPoints}`;

  // Determine phase
  let currentPhase = 0;
  for (let i = 0; i < phasePoints.length; i++) {
    if (totalPoints >= phasePoints[i]) currentPhase = i + 1;
  }

  rocketPhases.forEach((phase, idx) => {
    phase.style.display = (idx === currentPhase - 1) ? "block" : "none";
  });

  // Points till next phase
  if (currentPhase < phasePoints.length) {
    pointsTillNextPhaseEl.textContent = `Points until next phase: ${phasePoints[currentPhase] - totalPoints}`;
  } else pointsTillNextPhaseEl.textContent = `Points until next phase: 0`;

  // Points till launch
  pointsTillLaunchEl.textContent = `Points until launch: ${launchPoints - totalPoints}`;

  // Update progress bar
  const progressPercent = Math.min((totalPoints / launchPoints) * 100, 100);
  progressBarEl.style.width = progressPercent + "%";
});
