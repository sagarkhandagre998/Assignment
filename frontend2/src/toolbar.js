// toolbar.js
// The top header: brand identity on the left + the draggable node palette.

import { DraggableNode } from './draggableNode';
import { theme } from './theme';

const NODE_TYPES = [
  { type: 'customInput', label: 'Input' },
  { type: 'llm', label: 'LLM' },
  { type: 'customOutput', label: 'Output' },
  { type: 'text', label: 'Text' },
  { type: 'filter', label: 'Filter' },
  { type: 'math', label: 'Math' },
  { type: 'note', label: 'Note' },
  { type: 'api', label: 'API' },
  { type: 'delay', label: 'Delay' },
];

export const PipelineToolbar = () => {
  return (
    <header
      style={{
        background: theme.color.surface,
        borderBottom: `1px solid ${theme.color.border}`,
        boxShadow: theme.shadow.sm,
        padding: '14px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: theme.radius.md,
            background: theme.color.brandGradient,
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          }}
        >
          ⬡
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.color.text, lineHeight: 1.1 }}>
            VectorAI Pipeline Builder
          </div>
          <div style={{ fontSize: 12, color: theme.color.textMuted }}>
            Drag a node onto the canvas to start building
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {NODE_TYPES.map((n) => (
          <DraggableNode key={n.type} type={n.type} label={n.label} />
        ))}
      </div>
    </header>
  );
};
