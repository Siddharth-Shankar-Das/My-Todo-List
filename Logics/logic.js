// Main app logic: load/save todos, render UI, add/delete/toggle, sort, helper functions.

// Load todo list from localStorage or start with empty array.
let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

// Ensure older items (saved before we added createdAt) get a createdAt timestamp.
// This ensures "default" sorting (insertion order) works reliably.
todoList = todoList.map(item => {
  if (!item.createdAt) item.createdAt = Date.now(); // fallback: treat old items as 'now'
  return item;
});

// Initial render on page load.
renderTodoList();

// ---------------------- Helper functions ----------------------
// saveTodoList: persist the current todoList to localStorage.
function saveTodoList() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

// getTodayDate: returns today's date formatted as yyyy-mm-dd which matches <input type="date"> value format.
function getTodayDate() {
  const t = new Date();
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth()+1).padStart(2,'0');
  const dd = String(t.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---------------------- Render logic ----------------------
// renderTodoList: clear and re-populate both pending and completed lists.
// - Uses DOM creation (createElement) to avoid fragile innerHTML manipulation.
// - Updates pending and completed counts.
function renderTodoList() {
  const todoContainer = document.querySelector(".js-todo-list");
  const completedContainer = document.querySelector(".js-completed-list");

  // Clear the containers before re-rendering
  todoContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  let completedCount = 0;
  let pendingCount = 0;

  // Iterate through todoList and create DOM rows for each item
  todoList.forEach((todo, i) => {
    // row element: uses CSS grid defined in style.css (4 columns)
    const row = document.createElement("div");
    row.className = todo.completed ? "completed-item" : "todo-item";

    // Checkbox: toggles completed state
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = !!todo.completed;
    // toggleComplete will flip the completed boolean and re-render
    checkbox.addEventListener("change", () => toggleComplete(i));

    // Text cell: shows task name, with 'completed' class if applicable
    const textDiv = document.createElement("div");
    textDiv.className = "todo-text" + (todo.completed ? " completed" : "");
    textDiv.textContent = todo.name;
    textDiv.title = todo.name;

    // Due-date cell: shows the date; if missing it falls back to today's date
    const dateDiv = document.createElement("div");
    dateDiv.className = "due-date";
    dateDiv.textContent = todo.dueDate || getTodayDate();

    // Delete button: removes item and re-renders
    const delBtn = document.createElement("button");
    delBtn.className = "delete-button";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTodo(i));

    // Append the four cells in the expected order: checkbox, text, date, delete
    row.appendChild(checkbox);
    row.appendChild(textDiv);
    row.appendChild(dateDiv);
    row.appendChild(delBtn);

    // Place row in the completed container or pending container
    if (todo.completed) {
      completedContainer.appendChild(row);
      completedCount++;
    } else {
      todoContainer.appendChild(row);
      pendingCount++;
    }
  });

  // Update counts in the UI
  const completedSpan = document.getElementById("completedCount");
  const pendingSpan = document.getElementById("pendingCount");
  if (completedSpan) completedSpan.textContent = completedCount;
  if (pendingSpan) pendingSpan.textContent = pendingCount;

  // Persist the list after any changes
  saveTodoList();
}

// ---------------------- Add / Delete / Toggle ----------------------
// addTodo: reads inputs, validates, adds new todo with createdAt timestamp, then re-renders.
function addTodo() {
  const input = document.querySelector(".js-input");
  const name = input.value.trim();
  const dueDateInput = document.querySelector(".js-due-date");
  let dueDate = dueDateInput.value;

  // validation: task name required
  if (!name) {
    alert("Please enter a task name!");
    return;
  }

  // If no date selected, set to today's date (keeps date consistent)
  if (!dueDate) dueDate = getTodayDate();

  // push new todo object; createdAt helps restore insertion order later
  todoList.push({ name, dueDate, completed: false, createdAt: Date.now() });

  // clear inputs
  input.value = "";
  dueDateInput.value = "";

  // re-render and save
  renderTodoList();
}

// toggleComplete: flip completed flag for item at index, then re-render.
// We don't mutate sorting keys or createdAt so the original insertion info stays intact.
function toggleComplete(index) {
  todoList[index].completed = !todoList[index].completed;
  renderTodoList();
}

// deleteTodo: remove item at index and re-render
function deleteTodo(index) {
  todoList.splice(index, 1);
  renderTodoList();
}

// clearAll: confirm, then remove all tasks and re-render
function clearAll() {
  if (!todoList.length) return;
  if (confirm("Are you sure you want to delete all tasks?")) {
    todoList = [];
    renderTodoList();
  }
}

// ---------------------- Sorting ----------------------

// sortTodos: sorts todoList in-place based on chosen option, then re-renders.
// - 'date' sorts by dueDate (invalid/missing dates move to far future).
// - 'default' restores insertion order using createdAt.
// The small transform on the select element is just a brief UI cue.groups by boolean
function sortTodos(option) {
  const select = document.getElementById("sortSelect");
  // small UI cue (scale up briefly)
  select.style.transform = "scale(1.03)";
  setTimeout(()=> select.style.transform = "scale(1)", 160);

  if (option === "date") {
    // convert empty/invalid dates to very large date so they appear last
    todoList.sort((a,b) => {
      const da = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
      const db = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
      return da - db;
    });
  } else {
    // default: sort by createdAt (insertion order)
    todoList.sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0));
  }

  renderTodoList();
}

// ---------------------- Keyboard helper ----------------------

// eventKeydown: when the user presses Enter inside the name or date inputs, add the todo.
function eventKeydown(e) { if (e.key === "Enter") addTodo(); }
