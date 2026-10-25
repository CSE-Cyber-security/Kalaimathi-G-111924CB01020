
const $ = id => document.getElementById(id);

const taskForm = $("task-form");
const taskInput = $("task-input");
const priorityInput = $("priority-input");
const taskList = $("task-list");
const emptyMessage = $("empty-message");

const today = new Date();
today.setHours(0, 0, 0, 0);

let selectedDate = dateKey(today);
let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let currentFilter = "all";
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("motivationalTodoTasks")) || [];
    if (!Array.isArray(tasks)) tasks = [];
} catch {
    tasks = [];
}

const quotes = [
    "You are stronger than you think.",
    "Small steps every day lead to big results.",
    "Progress, not perfection.",
    "Believe in yourself and keep going.",
    "Your future is created by what you do today.",
    "Every completed task is a little victory."
];

$("quote-text").textContent =
    quotes[Math.floor(Math.random() * quotes.length)];

$("selected-date-label").textContent = "Today";

function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function saveTasks() {
    localStorage.setItem("motivationalTodoTasks", JSON.stringify(tasks));
}

function renderCalendar() {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    $("calendar-month").textContent =
        displayedMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

    const calendar = $("calendar-days");
    calendar.replaceChildren();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Blank spaces before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("span");
        blank.setAttribute("aria-hidden", "true");
        calendar.appendChild(blank);
    }

    // Create every date in the displayed month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const key = dateKey(date);
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = day;
        button.setAttribute("aria-label", key);

        if (key === dateKey(today)) button.classList.add("today");
        if (key === selectedDate) button.classList.add("selected");
        if (tasks.some(task => task.date === key)) {
            button.classList.add("has-tasks");
        }

        button.addEventListener("click", () => {
            selectedDate = key;
            updateSelectedDateLabel();
            renderCalendar();
            renderTasks();
        });

        calendar.appendChild(button);
    }
}

function updateSelectedDateLabel() {
    if (selectedDate === dateKey(today)) {
        $("selected-date-label").textContent = "Today";
        return;
    }

    const [year, month, day] = selectedDate.split("-").map(Number);
    $("selected-date-label").textContent =
        new Date(year, month - 1, day).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}

function renderTasks() {
    taskList.replaceChildren();

    const dateTasks = tasks.filter(task => task.date === selectedDate);
    const pending = dateTasks.filter(task => !task.completed);
    const completed = dateTasks.filter(task => task.completed);

    const filtered = dateTasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    const filterButtons = document.querySelectorAll(".filter");

    filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        const count = filter === "all"
            ? dateTasks.length
            : filter === "pending"
                ? pending.length
                : completed.length;

        button.textContent =
            `${filter.charAt(0).toUpperCase() + filter.slice(1)} (${count})`;

        button.classList.toggle("active", filter === currentFilter);
    });

    emptyMessage.hidden = filtered.length > 0;

    filtered.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) item.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderCalendar();
            renderTasks();
        });

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.text;

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = `${task.priority} Priority`;

        info.append(title, priority);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderCalendar();
            renderTasks();
        });

        item.append(checkbox, info, deleteButton);
        taskList.appendChild(item);
    });

    updateStats();
}

function updateStats() {
    const todayTasks = tasks.filter(task => task.date === dateKey(today));
    const todayCompleted = todayTasks.filter(task => task.completed).length;
    const totalCompleted = tasks.filter(task => task.completed).length;

    $("today-count").textContent =
        `${todayCompleted}/${todayTasks.length}`;

    $("total-completed").textContent = totalCompleted;

    const success = tasks.length
        ? Math.round((totalCompleted / tasks.length) * 100)
        : 0;

    $("success-rate").textContent = `${success}%`;

    const selectedTasks = tasks.filter(task => task.date === selectedDate);
    const selectedCompleted = selectedTasks.filter(task => task.completed).length;

    const progress = selectedTasks.length
        ? Math.round((selectedCompleted / selectedTasks.length) * 100)
        : 0;

    $("progress-percent").textContent = `${progress}%`;
    $("progress-done").textContent = selectedCompleted;
    $("progress-total").textContent = selectedTasks.length;

    $("progress-ring").style.background =
        `conic-gradient(#7b51eb ${progress}%, #ffffff75 ${progress}%)`;

    $("progress-message").textContent =
        selectedTasks.length && progress === 100
            ? "✦ All done! Great work!"
            : "✦ Keep going, you've got this!";

    // Count consecutive days with at least one completed task,
    // starting from today or the most recent completed day.
    const completedDates = new Set(
        tasks.filter(task => task.completed).map(task => task.date)
    );

    let cursor = new Date(today);
    if (!completedDates.has(dateKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (completedDates.has(dateKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }

    $("streak-count").textContent = streak;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: `${Date.now()}-${Math.random()}`,
        text,
        priority: priorityInput.value,
        date: selectedDate,
        completed: false
    });

    saveTasks();
    taskForm.reset();
    priorityInput.value = "Medium";
    taskForm.hidden = true;

    renderCalendar();
    renderTasks();
});

$("add-task-btn").addEventListener("click", () => {
    taskForm.hidden = !taskForm.hidden;

    if (!taskForm.hidden) {
        taskInput.focus();
    }
});

$("cancel-task").addEventListener("click", () => {
    taskForm.reset();
    taskForm.hidden = true;
});

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

$("prev-month").addEventListener("click", () => {
    displayedMonth = new Date(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth() - 1,
        1
    );
    renderCalendar();
});

$("next-month").addEventListener("click", () => {
    displayedMonth = new Date(
        displayedMonth.getFullYear(),
        displayedMonth.getMonth() + 1,
        1
    );
    renderCalendar();
});

$("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const darkMode = document.body.classList.contains("dark");

    $("theme-toggle").textContent = darkMode ? "☀" : "☾";
    $("theme-toggle").setAttribute(
        "aria-label",
        darkMode ? "Switch to light mode" : "Switch to dark mode"
    );
});

renderCalendar();
updateSelectedDateLabel();
renderTasks();
