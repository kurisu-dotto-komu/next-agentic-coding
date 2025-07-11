import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

// Export all data
export const exportData = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const tamagochis = await ctx.db.query("tamagochis").collect();
    return {
      todos: todos.map((todo) => ({
        _id: todo._id.toString(),
        text: todo.text,
        isCompleted: todo.isCompleted,
      })),
      tamagochis: tamagochis.map((tamagochi) => ({
        _id: tamagochi._id.toString(),
        userId: tamagochi.userId,
        name: tamagochi.name,
        pixelData: tamagochi.pixelData,
        position: tamagochi.position,
        velocity: tamagochi.velocity,
        stats: tamagochi.stats,
        alive: tamagochi.alive,
        birthTime: tamagochi.birthTime,
        lastUpdated: tamagochi.lastUpdated,
        animations: tamagochi.animations,
      })),
    };
  },
});

// Import data
export const importData = mutation({
  args: {
    todos: v.optional(
      v.array(
        v.object({
          _id: v.string(),
          text: v.string(),
          isCompleted: v.boolean(),
        }),
      ),
    ),
    tamagochis: v.optional(
      v.array(
        v.object({
          _id: v.string(),
          userId: v.string(),
          name: v.string(),
          pixelData: v.string(),
          position: v.object({
            x: v.number(),
            y: v.number(),
          }),
          velocity: v.object({
            x: v.number(),
            y: v.number(),
          }),
          stats: v.object({
            hunger: v.number(),
            happiness: v.number(),
            health: v.number(),
          }),
          alive: v.boolean(),
          birthTime: v.number(),
          lastUpdated: v.number(),
          animations: v.object({
            current: v.string(),
            startTime: v.number(),
          }),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing todos if provided
    if (args.todos) {
      const existingTodos = await ctx.db.query("todos").collect();
      await Promise.all(existingTodos.map((todo) => ctx.db.delete(todo._id)));

      // Import new todos
      await Promise.all(
        args.todos.map((todo) =>
          ctx.db.insert("todos", {
            text: todo.text,
            isCompleted: todo.isCompleted,
          }),
        ),
      );
    }

    // Clear existing tamagochis if provided
    if (args.tamagochis) {
      const existingTamagochis = await ctx.db.query("tamagochis").collect();
      await Promise.all(existingTamagochis.map((tamagochi) => ctx.db.delete(tamagochi._id)));

      // Import new tamagochis
      await Promise.all(
        args.tamagochis.map((tamagochi) =>
          ctx.db.insert("tamagochis", {
            userId: tamagochi.userId,
            name: tamagochi.name,
            pixelData: tamagochi.pixelData,
            position: tamagochi.position,
            velocity: tamagochi.velocity,
            stats: tamagochi.stats,
            alive: tamagochi.alive,
            birthTime: tamagochi.birthTime,
            lastUpdated: tamagochi.lastUpdated,
            animations: tamagochi.animations,
          }),
        ),
      );
    }

    return {
      importedTodos: args.todos?.length || 0,
      importedTamagochis: args.tamagochis?.length || 0,
    };
  },
});
