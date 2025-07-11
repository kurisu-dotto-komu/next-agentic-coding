import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
    });
    return newTaskId;
  },
});

export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
  },
});

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// For testing only - clears all todos
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    await Promise.all(todos.map((todo) => ctx.db.delete(todo._id)));
  },
});
