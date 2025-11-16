const tasksKey = "tasks"; // localStorage key

// Default tasks
let tasks = [
  { text: "Go for a walk", points: 100, completed: false },
  { text: "Journal", points: 100, completed: false },
  { text: "Eat breakfast", points: 100, completed: false },
  { text: "Take a break", points: 100, completed: false },
  { text: "Meditate", points: 100, completed: false },
  { text: "Read 15 mins", points: 100, completed: false },
  { text: "Clean small space", points: 50, completed: false }
];

// Load saved tasks from localStorage
const savedTasks = JSON.parse(localStorage.getItem(tasksKey));
if (savedTasks) tasks = savedTasks;

// DOM elements
const taskList = document.getElementById("tasklist");
const totalPointsEl = document.querySelector(".total_points h3");
const pointsTillNextPhaseEl = document.querySelector(".points_till_next_phase h3");
const pointsTillLaunchEl = document.querySelector(".points_till_launch h3");
const progressBarEl = document.querySelector(".progress-bar");
const rocketSpace = document.querySelector(".rocket_space");
const rocketPhases = rocketSpace.querySelectorAll("div"); // Phase1-4
const launchBtn = document.getElementById("launchBtn");
const launchMessage = document.getElementById("launchMessage");

// Form elements for adding tasks
const addTaskForm = document.getElementById("addTaskForm");
const taskDescInput = document.getElementById("taskDesc");

// Phase points
const phasePoints = [100, 200, 300, 400];
const launchPoints = 400;

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";

  // Separate unchecked and checked tasks
  const unchecked = tasks.filter(t => !t.completed);
  const checked = tasks.filter(t => t.completed);

  unchecked.concat(checked).forEach(task => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
      updateProgress();
    });

    const label = document.createElement("label");
    label.textContent = task.text;

    const pointsSpan = document.createElement("span");
    pointsSpan.textContent = ` (${task.points} pts)`;
    pointsSpan.style.color = "#888";
    pointsSpan.style.fontSize = "0.9em";
    label.appendChild(pointsSpan);

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => {
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      renderTasks();
      updateProgress();
    };

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    if (task.completed) li.classList.add("completed");

    taskList.appendChild(li);
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

// Update points and rocket progress
function updateProgress() {
  const totalPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  totalPointsEl.textContent = `Total Points: ${totalPoints}`;

  // Determine current phase
  let currentPhase = 0;
  for (let i = 0; i < phasePoints.length; i++) {
    if (totalPoints >= phasePoints[i]) currentPhase = i + 1;
  }

  rocketPhases.forEach((phase, idx) => {
    phase.style.display = idx === currentPhase - 1 ? "block" : "none";
  });

  pointsTillNextPhaseEl.textContent = currentPhase < phasePoints.length
    ? `Points until next phase: ${phasePoints[currentPhase] - totalPoints}`
    : `Points until next phase: 0`;

  pointsTillLaunchEl.textContent = `Points until launch: ${launchPoints - totalPoints}`;

  progressBarEl.style.width = `${Math.min((totalPoints / launchPoints) * 100, 100)}%`;

  if (totalPoints >= launchPoints) {
    launchBtn.classList.remove("grey");
    launchBtn.classList.add("red");
  } else {
    launchBtn.classList.remove("red");
    launchBtn.classList.add("grey");
  }
}

// Launch button logic
launchBtn.onclick = () => {
  const totalPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
  if (totalPoints < launchPoints) {
    launchMessage.textContent = "You do not have enough points to launch!";
    launchMessage.style.display = "block";
    setTimeout(() => { launchMessage.style.display = "none"; }, 3000);
  } else {
    // Reset all tasks
    tasks.forEach(t => t.completed = false);
    saveTasks();
    renderTasks();
    updateProgress();
  }
};

// Add new task form submission
addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = taskDescInput.value.trim();
  const points = parseInt(document.querySelector('input[name="points"]:checked').value);

  if (!desc) return;

  tasks.push({ text: desc, points, completed: false });
  saveTasks();
  renderTasks();
  updateProgress();

  addTaskForm.reset();
});

// STAR BACKGROUND
const starsContainer = document.querySelector('.stars');
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

// Initialize
renderTasks();
updateProgress();
