// theme.js
// Single source of truth for the app's visual design language.
//
// Two things live here:
//   1. `theme`     — global design tokens (color, spacing, radius, shadow, type).
//   2. `NODE_META` — per-node-type accent colour + icon, shared by the toolbar
//                    chips and the nodes themselves so a node's identity colour
//                    is defined in exactly one place.

export const theme = {
  color: {
    bg: '#eef1f7',
    bgGradient: 'linear-gradient(180deg, #f3f5fb 0%, #e9edf6 100%)',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    border: '#e3e8f0',
    borderStrong: '#cdd5e1',
    text: '#0f172a',
    textMuted: '#64748b',
    brand: '#6366f1',
    brand2: '#8b5cf6',
    brandGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    danger: '#ef4444',
  },
  radius: { sm: 6, md: 10, lg: 14, pill: 999 },
  shadow: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
    md: '0 6px 18px rgba(15, 23, 42, 0.08)',
    lg: '0 16px 40px rgba(15, 23, 42, 0.14)',
    focus: '0 0 0 3px rgba(99, 102, 241, 0.25)',
  },
  font: {
    family:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "'SFMono-Regular', Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
};

// Convert a #rrggbb hex to an rgba() string at the given alpha.
export const tint = (hex, alpha) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Accent colour + icon per node type. The key is the React Flow node `type`
// (matching ui.js `nodeTypes` / toolbar `DraggableNode` type props).
export const NODE_META = {
  customInput: { accent: '#10b981', icon: '📥' },
  llm: { accent: '#8b5cf6', icon: '✨' },
  customOutput: { accent: '#f43f5e', icon: '📤' },
  text: { accent: '#3b82f6', icon: '📝' },
  filter: { accent: '#f59e0b', icon: '🔎' },
  math: { accent: '#06b6d4', icon: '🔢' },
  note: { accent: '#eab308', icon: '📌' },
  api: { accent: '#14b8a6', icon: '🌐' },
  delay: { accent: '#f97316', icon: '⏱️' },
};

export const DEFAULT_META = { accent: theme.color.brand, icon: '⬡' };
