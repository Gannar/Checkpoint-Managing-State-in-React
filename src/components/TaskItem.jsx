import React from "react";
import { useTasks } from "../context/TasksContext.jsx";

/**
 * TaskItem shows one task with:
 * - click-to-edit
 * - complete toggle
 * - delete with confirmation
 */
export default function TaskItem({ task, onEdit }) {
  const { toggleComplete, deleteTask } = useTasks();

  function handleDelete() {
    // Confirmation prompt required by instructions
    const ok = window.confirm(`Delete "${task.name}"? This cannot be undone.`);
    if (!ok) return;
    deleteTask(task.id);
  }

  return (
    <li className={task.completed ? "item item--done" : "item"}>
      <div className="item__main" onClick={() => onEdit(task.id)} role="button" tabIndex={0}>
        <div className="item__titleRow">
          <h3 className="item__title">{task.name}</h3>
          {task.completed ? <span className="badge">Completed</span> : <span className="badge badge--active">Active</span>}
        </div>
        <p className="item__desc">{task.description}</p>
      </div>

      <div className="item__actions">
        <button className="btn btn--small" onClick={() => toggleComplete(task.id)}>
          {task.completed ? "Undo" : "Complete"}
        </button>
        <button className="btn btn--small btn--danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}
