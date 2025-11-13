# My Todo List (Vanilla JS)

A small, polished To-Do List web app built with **HTML**, **CSS**, and **Vanilla JavaScript**.  
It stores tasks in the browser's `localStorage`, supports due dates, sorting, marking tasks complete, and shows counts for pending & completed tasks.

---

## Live demo
You can host this on GitHub Pages by pushing the repository and enabling Pages for the `main` branch (see instructions below).

---

## Features
- Add tasks with an optional due date.
- If no due date is provided, today's date is applied automatically.
- Mark tasks as completed using a checkbox — completed tasks appear in a separate section.
- Delete single task or **Clear All** tasks.
- Sort tasks by **Default** (insertion order) or **Due Date**.
- Persistent (strong) storage using `localStorage`.
- Counts displayed for both Pending and Completed tasks.
- Simple responsive layout for mobile.

---

## File structure
todo-list/
├── index.html
├── README.md
├── Styles/
│ └── style.css
└── Logics/
  └── logic.js

---

## How it works (brief)
- `index.html` provides the structure and IDs/classes used to hook JS to the DOM.
- `Styles/style.css` contains layout, grid templates, colors and responsive tweaks.
- `Logics/logic.js` handles:
  - loading/saving `todoList` to `localStorage`.
  - rendering pending & completed lists.
  - adding, deleting, toggling completion.
  - sorting and counts.

## Important: each todo object has this shape:
```js
{
  name: "Task name",
  dueDate: "YYYY-MM-DD",
  completed: false,   // or true
  createdAt: 159...   // timestamp used to restore insertion (default) order
}
```

---

## Run locally (quick)
- Open `index.html` in your browser.
- (OR)
- Double-click `index.html` in your file explorer.

---

## Troubleshooting
- If counts or order seem off, try clearing localStorage for this site via the browser devtools (Application → Local Storage).
- Ensure the file paths in index.html (./Styles/style.css and ./Logics/logic.js) match your repo structure.

---

## Final note
- I added thorough comments in every file so anyone can understand the shape and behavior quickly.
