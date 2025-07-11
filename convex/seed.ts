import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Export all todos data
export const exportData = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    return {
      todos: todos.map(({ _creationTime, ...todo }) => ({
        ...todo,
        _id: todo._id.toString(),
      })),
    };
  },
});

// Import todos data
export const importData = mutation({
  args: {
    todos: v.array(
      v.object({
        _id: v.string(),
        text: v.string(),
        isCompleted: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing todos first
    const existingTodos = await ctx.db.query("todos").collect();
    await Promise.all(existingTodos.map((todo) => ctx.db.delete(todo._id)));

    // Import new todos (without _id, as Convex will create new ones)
    await Promise.all(
      args.todos.map((todo) =>
        ctx.db.insert("todos", {
          text: todo.text,
          isCompleted: todo.isCompleted,
        }),
      ),
    );

    return { imported: args.todos.length };
  },
});
