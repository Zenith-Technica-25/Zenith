const tasks = ["one", "two", "three", "five"];
const taskList = document.getElementById("tasklist");

tasks.forEach(task => {
  const li = document.createElement("li");
  li.textContent = task;
  taskList.appendChild(li);
});
