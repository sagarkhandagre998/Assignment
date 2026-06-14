// fields/TextField.js

import { useState } from 'react';
import { useStore } from '../../store';
import { styles } from '../nodeStyles';

export const TextField = ({ id, data, field }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [value, setValue] = useState(data?.[field.name] ?? field.default ?? '');

  const onChange = (e) => {
    setValue(e.target.value);
    updateNodeField(id, field.name, e.target.value);
  };

  return (
    <label style={styles.label}>
      {field.label}
      <input type="text" value={value} onChange={onChange} />
    </label>
  );
};
