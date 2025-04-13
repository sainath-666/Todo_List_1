document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const pendingTasksList = document.getElementById("pending-tasks");
  const completedTasksList = document.getElementById("completed-tasks");

  addTaskBtn.addEventListener("click", addTask);

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const taskItem = createTaskItem(taskText);
    pendingTasksList.appendChild(taskItem);
    taskInput.value = "";
  }

  function createTaskItem(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("task-buttons");

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", () => completeTask(li));

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editTask(li));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteTask(li));

    buttonsDiv.appendChild(completeBtn);
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    li.appendChild(buttonsDiv);

    return li;
  }

  function completeTask(taskItem) {
    taskItem.classList.add("completed");
    completedTasksList.appendChild(taskItem);
  }

  function editTask(taskItem) {
    const newTaskText = prompt("Edit task:", taskItem.firstChild.textContent);
    if (newTaskText !== null) {
      taskItem.firstChild.textContent = newTaskText;
    }
  }

  function deleteTask(taskItem) {
    taskItem.remove();
  }
});
