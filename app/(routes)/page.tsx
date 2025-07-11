"use client";

import { useState } from "react";

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import TodoItem from "@/app/components/TodoItem";

export default function Home() {
  const todos = useQuery(api.todos.list);
  const add = useMutation(api.todos.add);
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      await add({ text: newTodo.trim() });
      setNewTodo("");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Todo List</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {todos === undefined ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No todos yet. Add one above!</div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo._id}
              id={todo._id}
              text={todo.text}
              isCompleted={todo.isCompleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
