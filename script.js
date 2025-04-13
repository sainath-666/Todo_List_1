document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const pendingTasksList = document.getElementById("pending-tasks");
  const completedTasksList = document.getElementById("completed-tasks");

  // Load tasks from local storage
  loadTasks();

  // Event listeners
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Add a new task
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    // Create new task with unique ID
    const taskId = Date.now().toString();
    const taskItem = createTaskItem(taskText, taskId, false);
    pendingTasksList.appendChild(taskItem);
    
    // Save to local storage
    saveTask(taskId, taskText, false);
    
    // Clear input
    taskInput.value = "";
    taskInput.focus();
  }

  // Create a task item element
  function createTaskItem(taskText, taskId, isCompleted) {
    const li = document.createElement("li");
    li.dataset.id = taskId;
    
    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = taskText;
    taskTextSpan.classList.add("task-text");
    li.appendChild(taskTextSpan);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("task-buttons");

    const completeBtn = document.createElement("button");
    completeBtn.innerHTML = '<i class="fas fa-check"></i> ' + (isCompleted ? 'Undo' : 'Complete');
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", () => completeTask(li));

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editTask(li));

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteTask(li));

    buttonsDiv.appendChild(completeBtn);
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    li.appendChild(buttonsDiv);

    if (isCompleted) {
      li.classList.add("completed");
    }

    return li;
  }

  // Mark a task as complete/incomplete
  function completeTask(taskItem) {
    const taskId = taskItem.dataset.id;
    const taskText = taskItem.querySelector(".task-text").textContent;
    const isCompleted = !taskItem.classList.contains("completed");
    
    // Update UI
    if (isCompleted) {
      taskItem.classList.add("completed");
      completedTasksList.appendChild(taskItem);
      taskItem.querySelector(".complete-btn").innerHTML = '<i class="fas fa-undo"></i> Undo';
    } else {
      taskItem.classList.remove("completed");
      pendingTasksList.appendChild(taskItem);
      taskItem.querySelector(".complete-btn").innerHTML = '<i class="fas fa-check"></i> Complete';
    }
    
    // Update local storage
    updateTask(taskId, taskText, isCompleted);
  }

  // Edit a task
  function editTask(taskItem) {
    const taskTextElement = taskItem.querySelector(".task-text");
    const currentText = taskTextElement.textContent;
    const taskId = taskItem.dataset.id;
    const isCompleted = taskItem.classList.contains("completed");
    
    const newTaskText = prompt("Edit task:", currentText);
    
    if (newTaskText !== null && newTaskText.trim() !== "") {
      // Update UI
      taskTextElement.textContent = newTaskText.trim();
      
      // Update local storage
      updateTask(taskId, newTaskText.trim(), isCompleted);
    }
  }

  // Delete a task
  function deleteTask(taskItem) {
    if (confirm("Are you sure you want to delete this task?")) {
      const taskId = taskItem.dataset.id;
      
      // Remove from UI
      taskItem.remove();
      
      // Remove from local storage
      removeTask(taskId);
    }
  }

  // Save task to local storage
  function saveTask(id, text, completed) {
    const tasks = getTasks();
    tasks.push({ id, text, completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update task in local storage
  function updateTask(id, text, completed) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = { id, text, completed };
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  // Remove task from local storage
  function removeTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Get tasks from local storage
  function getTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }

  // Load tasks from local storage
  function loadTasks() {
    const tasks = getTasks();
    
    tasks.forEach(task => {
      const taskItem = createTaskItem(task.text, task.id, task.completed);
      
      if (task.completed) {
        completedTasksList.appendChild(taskItem);
      } else {
        pendingTasksList.appendChild(taskItem);
      }
    });
  }
});
