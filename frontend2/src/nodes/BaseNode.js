// BaseNode.js
// The one reusable node shell. A node = BaseNode + a config object describing
// its title, handles, and fields. Structure/styling/handle-spacing/state
// plumbing all live here so individual nodes stay declarative.
//
// A node's accent colour + icon come from the shared NODE_META map (keyed by
// nodeType), so a node type's identity colour is defined in exactly one place
// and is reused by the toolbar chips too. A config may still override with its
// own `accent` / `icon` if needed.

import { Handle, Position } from 'reactflow';
import { styles } from './nodeStyles';
import { FIELD_COMPONENTS } from './fields';
import { NODE_META, DEFAULT_META, tint } from '../theme';

const SIDE = { left: Position.Left, right: Position.Right };

// Evenly distribute N handles along a side: 1 -> [50%], 2 -> [33%, 66%], ...
const handleTop = (index, total) => `${(100 * (index + 1)) / (total + 1)}%`;

// Turn a handle id like "customInput-1-system" / "system" into a tidy label.
const prettyHandle = (rawId) => {
  const last = String(rawId).split('-').pop();
  return last.charAt(0).toUpperCase() + last.slice(1);
};

export const BaseNode = ({ id, data, config }) => {
  const { title, handles = [], fields = [] } = config;

  const meta = NODE_META[data?.nodeType] || DEFAULT_META;
  const accent = config.accent || meta.accent;
  const icon = config.icon || meta.icon;

  const renderSide = (side) => {
    const group = handles.filter((h) => h.side === side);
    const isLeft = side === 'left';
    return group.map((h, i) => {
      const top = handleTop(i, group.length);
      return (
        <div key={h.id}>
          <Handle
            type={h.type}
            position={SIDE[side]}
            id={`${id}-${h.id}`}
            style={{ top, background: accent }}
          />
          {h.showLabel !== false && (
            <span
              style={{
                ...styles.handleLabel,
                top,
                [isLeft ? 'right' : 'left']: '100%',
                [isLeft ? 'marginRight' : 'marginLeft']: 10,
              }}
            >
              {h.label || prettyHandle(h.id)}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="vai-node"
      style={{
        ...styles.container,
        borderTop: `3px solid ${accent}`,
        '--vai-node-accent': accent,
        ...config.containerStyle,
      }}
    >
      {renderSide('left')}

      <div style={styles.header}>
        <span style={{ ...styles.icon, background: tint(accent, 0.14), color: accent }}>
          {icon}
        </span>
        <span style={styles.title}>{title}</span>
      </div>

      {config.description && <div style={styles.description}>{config.description}</div>}

      {fields.length > 0 && (
        <div style={styles.body}>
          {fields.map((field) => {
            const Control = FIELD_COMPONENTS[field.type];
            if (!Control) return null;
            return <Control key={field.name} id={id} data={data} field={field} />;
          })}
        </div>
      )}

      {renderSide('right')}
    </div>
  );
};
