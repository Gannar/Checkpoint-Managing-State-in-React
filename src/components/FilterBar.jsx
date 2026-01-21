import React from "react";

/**
 * Optional enhancement: filter tasks by status.
 */
export default function FilterBar({ filter, setFilter }) {
  return (
    <div className="segmented">
      <button
        className={filter === "all" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
        onClick={() => setFilter("all")}
      >
        All
      </button>
      <button
        className={filter === "active" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
        onClick={() => setFilter("active")}
      >
        Active
      </button>
      <button
        className={filter === "completed" ? "segmented__btn segmented__btn--active" : "segmented__btn"}
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>
    </div>
  );
}
