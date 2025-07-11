"use client";

import CharacterCreator from "@/components/character/CharacterCreator";
import Card from "@/components/ui/Card";

export default function CharacterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-900 dark:text-amber-100">
          Create Your Barista
        </h1>
        <Card variant="elevated">
          <CharacterCreator />
        </Card>
      </div>
    </div>
  );
}
