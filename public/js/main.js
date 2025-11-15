const tasks = 
    [" Go for a walk",
    " Journal",
    " Eat breakfast",
    " Take a break",
    " Meditate",
    " Spend at least 15 minutes reading",
    " Clean/declutter a small space"];
const taskList = document.getElementById("tasklist");

tasks.forEach((task, index) => {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `task-${index}`;

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = task;

  // When checkbox changes, toggle completed class and reorder
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);

    if (checkbox.checked) {
      // Move checked task to the end
      taskList.appendChild(li);
    } else {
      // Move unchecked task to before the first completed item
      const firstCompleted = taskList.querySelector(".completed");
      if (firstCompleted) {
        taskList.insertBefore(li, firstCompleted);
      } else {
        // If no completed items, keep at the end
        taskList.appendChild(li);
      }
    }
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  taskList.appendChild(li);
});