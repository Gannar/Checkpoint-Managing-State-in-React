import React, { useEffect, useMemo, useState } from "react";
import { useTasks } from "../context/TasksContext.jsx";

/**
 * TaskForm handles:
 * - Adding a new task
 * - Editing an existing task
 * - Validation for name & description
 *
 * Local state is used for form inputs (controlled components).
 */
export default function TaskForm({ mode, initialTask, onDone }) {
  const { addTask, updateTask } = useTasks();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Simple validation errors
  const [errors, setErrors] = useState({ name: "", description: "" });

  // When editingTask changes, prefill fields
  useEffect(() => {
    if (mode === "edit" && initialTask) {
      setName(initialTask.name);
      setDescription(initialTask.description);
      setErrors({ name: "", description: "" });
    } else {
      setName("");
      setDescription("");
      setErrors({ name: "", description: "" });
    }
  }, [mode, initialTask]);

  const isEdit = mode === "edit";

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && description.trim().length > 0;
  }, [name, description]);

  function validate() {
    const next = { name: "", description: "" };
    if (!name.trim()) next.name = "Task name is required.";
    if (!description.trim()) next.description = "Description is required.";
    setErrors(next);
    return !next.name && !next.description;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && initialTask) {
      updateTask(initialTask.id, {
        name: name.trim(),
        description: description.trim(),
      });
      onDone?.();
      return;
    }

    // Create a new task object
    const now = Date.now();
    addTask({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    // Reset form after adding
    setName("");
    setDescription("");
    setErrors({ name: "", description: "" });
  }

  function handleCancel() {
    // Cancel editing, reset
    onDone?.();
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field__label">Task name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? "input input--error" : "input"}
          placeholder="e.g., Study React"
          maxLength={80}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>

      <label className="field">
        <span className="field__label">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={errors.description ? "input input--error" : "input"}
          placeholder="What do you need to do?"
          rows={4}
          maxLength={240}
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </label>

      <div className="row">
        <button className="btn btn--primary" disabled={!canSubmit}>
          {isEdit ? "Save changes" : "Add task"}
        </button>

        {isEdit && (
          <button type="button" className="btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>

      {!canSubmit && (
        <p className="hint">Fill in both fields to {isEdit ? "save" : "add"} a task.</p>
      )}
    </form>
  );
}
