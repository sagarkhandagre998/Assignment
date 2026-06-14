// draggableNode.js
// A palette chip the user drags onto the canvas. Its accent colour + icon come
// from the shared NODE_META map so chips and the nodes they create always match.

import { useState } from 'react';
import { NODE_META, DEFAULT_META, tint, theme } from './theme';

export const DraggableNode = ({ type, label }) => {
  const [hover, setHover] = useState(false);
  const meta = NODE_META[type] || DEFAULT_META;

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      draggable
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        minWidth: 96,
        borderRadius: theme.radius.pill,
        background: hover ? tint(meta.accent, 0.12) : theme.color.surface,
        border: `1px solid ${hover ? meta.accent : theme.color.border}`,
        boxShadow: hover ? theme.shadow.md : theme.shadow.sm,
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'all 0.16s ease',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 7,
          fontSize: 13,
          background: tint(meta.accent, 0.16),
          color: meta.accent,
          flexShrink: 0,
        }}
      >
        {meta.icon}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: theme.color.text }}>
        {label}
      </span>
    </div>
  );
};
