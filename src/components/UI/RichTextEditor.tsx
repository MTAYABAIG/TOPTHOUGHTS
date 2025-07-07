import React from 'react';
import MediumEditor from './MediumEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Tell your story...",
  height = 400
}) => {
  return (
    <MediumEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default RichTextEditor;