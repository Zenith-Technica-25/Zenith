const tasks = 
    [{ text: " Go for a walk", points: 5},
    { text: " Journal", points: 5},
    { text: " Eat breakfast", points: 5},
    { text: " Take a break", points: 5},
    { text: " Meditate", points: 5},
    { text: " Spend at least 15 minutes reading", points: 5},
    { text: " Clean/declutter a small space", points: 5}];



// ===== SELECT TASK LIST AND BUTTON =====
const taskList = document.getElementById("tasklist");
const calculateBtn = document.querySelector(".calculate-points");

// ===== CREATE TASK LIST =====
tasks.forEach((task, index) => {
  const li = document.createElement("li");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `task-${index}`;

  // Create label
  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = task.text;

  // Add point value span
  const pointsSpan = document.createElement("span");
  pointsSpan.textContent = ` (${task.points} pts)`;
  pointsSpan.style.color = "#888888"; // lighter text color
  pointsSpan.style.fontSize = "0.9em";
  label.appendChild(pointsSpan);

  // Checkbox change behavior (move tasks)
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);

    setTimeout(() => {
      if (checkbox.checked) {
        taskList.appendChild(li); // move to bottom
      } else {
        const firstCompleted = taskList.querySelector(".completed");
        if (firstCompleted) {
          taskList.insertBefore(li, firstCompleted); // move above first completed
        } else {
          taskList.appendChild(li);
        }
      }
    }, 500); // delay in milliseconds (longer delay)
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  taskList.appendChild(li);
});

// ===== CALCULATE POINTS BUTTON =====
calculateBtn.addEventListener("click", () => {
  let totalPoints = 0;

  document.querySelectorAll("#tasklist li").forEach((taskItem, index) => {
    const checkbox = taskItem.querySelector("input[type='checkbox']");
    if (checkbox.checked) {
      totalPoints += tasks[index].points;
    }
  });

  alert(`You have earned ${totalPoints} points!`);
});
