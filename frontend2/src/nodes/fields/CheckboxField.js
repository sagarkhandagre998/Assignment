// fields/CheckboxField.js

import { useState } from 'react';
import { useStore } from '../../store';
import { styles } from '../nodeStyles';

export const CheckboxField = ({ id, data, field }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [checked, setChecked] = useState(data?.[field.name] ?? field.default ?? false);

  const onChange = (e) => {
    setChecked(e.target.checked);
    updateNodeField(id, field.name, e.target.checked);
  };

  return (
    <label style={{ ...styles.label, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {field.label}
    </label>
  );
};
