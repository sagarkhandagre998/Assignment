// fields/SelectField.js

import { useState } from 'react';
import { useStore } from '../../store';
import { styles } from '../nodeStyles';

// field.options may be ['Text', 'File'] or [{ value, label }, ...].
const normalize = (opt) =>
  typeof opt === 'object' ? opt : { value: opt, label: opt };

export const SelectField = ({ id, data, field }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const options = (field.options ?? []).map(normalize);
  const [value, setValue] = useState(
    data?.[field.name] ?? field.default ?? options[0]?.value ?? ''
  );

  const onChange = (e) => {
    setValue(e.target.value);
    updateNodeField(id, field.name, e.target.value);
  };

  return (
    <label style={styles.label}>
      {field.label}
      <select value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
};
