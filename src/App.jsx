import React, { useMemo, useState } from "react";
import { TasksProvider, useTasks } from "./context/TasksContext.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import FilterBar from "./components/FilterBar.jsx";

/**
 * Root wrapper that provides global task state via Context.
 */
export default function App() {
  return (
    <TasksProvider>
      <AppShell />
    </TasksProvider>
  );
}

/**
 * App UI shell. Uses local UI state for filtering and editing selection.
 */
function AppShell() {
  const { tasks } = useTasks();

  // Local UI state (not global): filter & currently edited task
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [editingTaskId, setEditingTaskId] = useState(null);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const editingTask = useMemo(
    () => tasks.find((t) => t.id === editingTaskId) || null,
    [tasks, editingTaskId]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>To-Do List</h1>
        <p className="subtle">Add, edit, complete, delete — saved automatically.</p>
      </header>

      <main className="grid">
        <section className="card">
          <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
          <TaskForm
            mode={editingTask ? "edit" : "add"}
            initialTask={editingTask}
            onDone={() => setEditingTaskId(null)}
          />
        </section>

        <section className="card">
          <div className="row row--space">
            <h2>Tasks</h2>
            <FilterBar filter={filter} setFilter={setFilter} />
          </div>
          <TaskList tasks={filteredTasks} onEdit={(id) => setEditingTaskId(id)} />
        </section>
      </main>

      <footer className="footer">
        <span className="subtle">
          Total: <strong>{tasks.length}</strong> • Completed:{" "}
          <strong>{tasks.filter((t) => t.completed).length}</strong>
        </span>
      </footer>
    </div>
  );
}
