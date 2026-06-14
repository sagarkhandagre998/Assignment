// fields/AutoResizeTextArea.js
// A textarea whose HEIGHT grows to fit its content as the user types.
// (Width is driven by the node container — see textNode.js.)

import { useState, useRef, useLayoutEffect } from 'react';
import { useStore } from '../../store';
import { styles } from '../nodeStyles';

export const AutoResizeTextArea = ({ id, data, field }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [value, setValue] = useState(data?.[field.name] ?? field.default ?? '');
  const ref = useRef(null);

  // After every value change, reset the height then grow it to fit content.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const onChange = (e) => {
    setValue(e.target.value);
    updateNodeField(id, field.name, e.target.value);
  };

  return (
    <label style={styles.label}>
      {field.label}
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          resize: 'none',
          overflow: 'hidden',
          fontFamily: 'inherit',
          fontSize: 12,
        }}
      />
    </label>
  );
};
