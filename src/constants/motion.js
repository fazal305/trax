// Mirrors the --duration-* / --ease-* custom properties in tokens.css.
// Use these in JS-driven animation (e.g. dnd-kit drop transitions, timers)
// so JS and CSS motion timing never drift apart.
export const DURATIONS = {
  instant: 80,
  fast: 130,
  base: 200,
  slow: 320,
  slower: 450,
};

export const EASINGS = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};
