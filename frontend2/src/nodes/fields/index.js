// fields/index.js
// Registry mapping a field "type" to its control component.
// Add a new control type here and it becomes usable in any node config.

import { TextField } from './TextField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { CheckboxField } from './CheckboxField';
import { AutoResizeTextArea } from './AutoResizeTextArea';

export const FIELD_COMPONENTS = {
  text: TextField,
  select: SelectField,
  textarea: TextAreaField,
  checkbox: CheckboxField,
  autoTextarea: AutoResizeTextArea,
};
