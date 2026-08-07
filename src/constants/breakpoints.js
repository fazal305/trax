// Mirrors the --breakpoint-* custom properties in src/styles/tokens.css.
// Kept in sync manually since CSS custom properties can't be read into
// @media queries; this is the single JS source of truth for the same values.
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};
