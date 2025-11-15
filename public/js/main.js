const tasks = 
    ["Go for a walk",
    "Journal",
    "Eat breakfast",
    "Take a break",
    "Meditate",
    "Spend at least 15 minutes reading",
    "Clean/declutter a small space"];
const taskList = document.getElementById("tasklist");

tasks.forEach(task => {
  const li = document.createElement("li");
  li.textContent = task;
  taskList.appendChild(li);
});
