"use client";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TodoItemProps {
  id: Id<"todos">;
  text: string;
  isCompleted: boolean;
}

export default function TodoItem({ id, text, isCompleted }: TodoItemProps) {
  const toggle = useMutation(api.todos.toggle);
  const remove = useMutation(api.todos.remove);

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => toggle({ id })}
        className="h-5 w-5 cursor-pointer"
      />
      <span className={`flex-1 ${isCompleted ? "text-gray-500 line-through" : ""}`}>{text}</span>
      <button
        onClick={() => remove({ id })}
        className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
