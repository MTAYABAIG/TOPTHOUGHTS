import React from 'react';
import ModernTextEditor from './ModernTextEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = 400
}) => {
  return (
    <ModernTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      height={height}
    />
  );
};

export default RichTextEditor;