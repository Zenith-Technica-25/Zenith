// Hardcoded list of tasks
const tasks = [
  "Wake up early",
  "Make breakfast",
  "Work on Zenith website",
  "Take a break",
  "Finish homework"
];

// Grab the UL
const list = document.getElementById("tasklist");

// Insert tasks into the UL
tasks.forEach(task => {
  const li = document.createElement("li");
  li.textContent = task;
  list.appendChild(li);
});
