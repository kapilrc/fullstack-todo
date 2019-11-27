//define UI vars

const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

// Load event listeners
loadEventListeners();

// load all event listeners
function loadEventListeners() {
  // DOM load event
  document.addEventListener("DOMContentLoaded", getTasks);

  // Add task event
  form.addEventListener("submit", addTask);

  // remove a task
  taskList.addEventListener("click", removeTask);

  // clear tasks
  clearBtn.addEventListener("click", clearTasks);

  // filter tasks
  filter.addEventListener("keyup", filterTasks);
}

// Add task

function addTask(e) {
  if(taskInput.value === '') {
    alert("Add a task");
    return;
  }

  // create li element
  const li = document.createElement("li");
  
  // Add class
  li.className = "collection-item";

  // create text node and append to li
  li.appendChild(document.createTextNode(taskInput.value));

  // Create new link el
  const link = document.createElement("a");

  // Add class
  link.className = "delete-item secondary-content";

  // Add icon html
  link.innerHTML = "<i class='fa fa-remove'></i>";

  li.appendChild(link);

  // Append li to ul
  taskList.appendChild(li);

  // store in LS
  storeTaskInLocalStorage(taskInput.value);

  // clear input
  taskInput.value = "";

  e.preventDefault();
}

// store Task
function storeTaskInLocalStorage(task) {
  let tasks;

  if(!localStorage.getItem('tasks')){
    tasks = [];
  }else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// get tasks from LS
function getTasks() {
  let tasks;
  if(!localStorage.getItem('tasks')){
    tasks = [];
  }else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(task) {
    // create li element
    const li = document.createElement("li");
    
    // Add class
    li.className = "collection-item";

    // create text node and append to li
    li.appendChild(document.createTextNode(task));

    // Create new link el
    const link = document.createElement("a");

    // Add class
    link.className = "delete-item secondary-content";

    // Add icon html
    link.innerHTML = "<i class='fa fa-remove'></i>";

    li.appendChild(link);

    // Append li to ul
    taskList.appendChild(li);
  });

}

// remove task
function removeTask(e) {
  if(e.target.parentElement.classList.contains("delete-item")) {
    if(confirm("Are you sure?")){
      e.target.parentElement.parentElement.remove();

      // remove task from LS
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    }
    
  }
}

function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if(!localStorage.getItem('tasks')){
    tasks = [];
  }else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(task, index) {
    if(taskItem.textContent === task){
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTasks(e) {
  // taskList.innerHTML = "";

  // faster
  while(taskList.firstChild){
    taskList.removeChild(taskList.firstChild);
  }

  // clear tasks from LS
  clearTasksFromLocalStorage();
}

function clearTasksFromLocalStorage() {
  localStorage.clear('tasks');
}

function filterTasks(e) {
  const text = e.target.value.toLowerCase();
  // console.log(text);

  document.querySelectorAll(".collection-item").forEach(
    function(task) {
      const item = task.firstChild.textContent;

      if(item.toLowerCase().indexOf(text) != -1) {
        task.style.display = "block";
      }else {
        task.style.display = "none";
      }
    }
  )
}