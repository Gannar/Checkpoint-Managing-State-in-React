const STORAGE_KEY = "todo_tasks_v1";

/**
 * Loads tasks from localStorage.
 * Returns [] if nothing is stored or parsing fails.
 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves tasks to localStorage.
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // If storage is full or unavailable, we silently fail.
  }
}
