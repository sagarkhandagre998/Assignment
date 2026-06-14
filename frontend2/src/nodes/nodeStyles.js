// nodeStyles.js
// Single source of truth for node presentation. Edit here to restyle every node.
// Pseudo-states (hover/focus/selected) and form-control looks live in index.css;
// these are the static structural styles applied inline by BaseNode + fields.

import { theme } from '../theme';

export const styles = {
  // The node card shell. BaseNode overlays a per-node accent on top of this.
  container: {
    position: 'relative',
    width: 220,
    minHeight: 70,
    paddingTop: 0,
    background: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.md,
    fontFamily: theme.font.family,
    color: theme.color.text,
  },
  // Title row: coloured icon badge + the node name.
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 7,
    fontSize: 13,
    flexShrink: 0,
  },
  title: {
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.01em',
    color: theme.color.text,
  },
  description: {
    fontSize: 11.5,
    color: theme.color.textMuted,
    padding: '0 12px 4px',
    lineHeight: 1.4,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '4px 12px 12px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 11,
    fontWeight: 600,
    color: theme.color.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    gap: 5,
  },
  // A small text label rendered next to a connection handle.
  handleLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 600,
    color: theme.color.textMuted,
    background: theme.color.surface,
    padding: '1px 5px',
    borderRadius: 4,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transform: 'translateY(-50%)',
  },
};
