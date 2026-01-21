import React from "react";
import TaskItem from "./TaskItem.jsx";

/**
 * TaskList renders a list of tasks.
 */
export default function TaskList({ tasks, onEdit }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks here yet.</p>;
  }

  return (
    <ul className="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} />
      ))}
    </ul>
  );
}
