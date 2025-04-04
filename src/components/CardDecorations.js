import React from 'react';

const Heart = ({ color, size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </svg>
);

const Star = ({ color, size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

const Balloon = ({ color, size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
    />
  </svg>
);

export const Decorations = {
  heart: Heart,
  star: Star,
  balloon: Balloon
}; 