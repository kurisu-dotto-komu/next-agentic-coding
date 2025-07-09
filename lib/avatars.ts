import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export function generateAvatar(seed: string, size = 96): string {
  const avatar = createAvatar(adventurer, {
    seed,
    size,
    backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
    radius: 50,
  });

  return avatar.toDataUri();
}
