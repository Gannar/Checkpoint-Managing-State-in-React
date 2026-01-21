import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadTasks, saveTasks } from "../utils/storage.js";

/**
 * Task shape:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   completed: boolean,
 *   createdAt: number,
 *   updatedAt: number
 * }
 */

const TasksContext = createContext(null);

/**
 * Reducer keeps state updates centralized & predictable.
 * Never mutate state; always return new arrays/objects.
 */
function tasksReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return action.payload;
    }
    case "ADD": {
      return [action.payload, ...state];
    }
    case "UPDATE": {
      const { id, patch } = action.payload;
      return state.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t));
    }
    case "TOGGLE_COMPLETE": {
      const id = action.payload;
      return state.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      );
    }
    case "DELETE": {
      const id = action.payload;
      return state.filter((t) => t.id !== id);
    }
    default:
      return state;
  }
}

/**
 * Provider loads tasks from localStorage on mount and saves whenever tasks change.
 */
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  // Load once on app start
  useEffect(() => {
    dispatch({ type: "INIT", payload: loadTasks() });
  }, []);

  // Persist every time tasks changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Action helpers (nice API for components)
  const actions = useMemo(
    () => ({
      addTask(task) {
        dispatch({ type: "ADD", payload: task });
      },
      updateTask(id, patch) {
        dispatch({ type: "UPDATE", payload: { id, patch } });
      },
      toggleComplete(id) {
        dispatch({ type: "TOGGLE_COMPLETE", payload: id });
      },
      deleteTask(id) {
        dispatch({ type: "DELETE", payload: id });
      },
    }),
    []
  );

  const value = useMemo(() => ({ tasks, ...actions }), [tasks, actions]);

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

/**
 * Reusable hook to consume TasksContext safely across components.
 */
export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside <TasksProvider>.");
  return ctx;
}
