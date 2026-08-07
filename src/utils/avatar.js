import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

// Generates a deterministic placeholder avatar (same seed -> same image).
// Used until real user-uploaded avatars are supported.
export function generateAvatarDataUri(seed) {
  return createAvatar(initials, {
    seed,
    radius: 50,
  }).toDataUri();
}
