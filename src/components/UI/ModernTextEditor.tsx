import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Type,
  Palette,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ModernTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
}

const ModernTextEditor: React.FC<ModernTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  height = 400,
  className = ""
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    if (showLinkDialog && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkDialog]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    } else {
      setSelectedText('');
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const handleColor = (color: string) => {
    execCommand('foreColor', color);
  };

  const handleBackgroundColor = (color: string) => {
    execCommand('backColor', color);
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setLinkText(selection.toString());
      setShowLinkDialog(true);
    } else {
      // If no text selected, prompt for both text and URL
      setLinkText('');
      setShowLinkDialog(true);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      if (linkText && !selectedText) {
        // Insert new link with text
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        execCommand('insertHTML', linkHtml);
      } else {
        // Wrap selected text with link
        execCommand('createLink', linkUrl);
      }
    }
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const imgHtml = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
      execCommand('insertHTML', imgHtml);
    }
  };

  const insertMention = () => {
    const mention = prompt('Enter username to mention:');
    if (mention) {
      const mentionHtml = `<span style="color: #3b82f6; background-color: #dbeafe; padding: 2px 6px; border-radius: 4px; font-weight: 500;">@${mention}</span>&nbsp;`;
      execCommand('insertHTML', mentionHtml);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toolbarButtons = [
    {
      group: 'format',
      buttons: [
        { icon: Bold, command: 'bold', tooltip: 'Bold (Ctrl+B)' },
        { icon: Italic, command: 'italic', tooltip: 'Italic (Ctrl+I)' },
        { icon: Underline, command: 'underline', tooltip: 'Underline (Ctrl+U)' },
        { icon: Strikethrough, command: 'strikeThrough', tooltip: 'Strikethrough' },
      ]
    },
    {
      group: 'align',
      buttons: [
        { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Align Left' },
        { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Align Center' },
        { icon: AlignRight, command: 'justifyRight', tooltip: 'Align Right' },
        { icon: AlignJustify, command: 'justifyFull', tooltip: 'Justify' },
      ]
    },
    {
      group: 'list',
      buttons: [
        { icon: List, command: 'insertUnorderedList', tooltip: 'Bullet List' },
        { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Numbered List' },
        { icon: Quote, command: 'formatBlock', value: 'blockquote', tooltip: 'Quote' },
      ]
    },
    {
      group: 'insert',
      buttons: [
        { icon: Link, action: handleLink, tooltip: 'Insert Link' },
        { icon: Image, action: handleImage, tooltip: 'Insert Image' },
        { icon: Code, command: 'formatBlock', value: 'pre', tooltip: 'Code Block' },
      ]
    },
    {
      group: 'history',
      buttons: [
        { icon: Undo, command: 'undo', tooltip: 'Undo (Ctrl+Z)' },
        { icon: Redo, command: 'redo', tooltip: 'Redo (Ctrl+Y)' },
      ]
    }
  ];

  const headingOptions = [
    { label: 'Normal', value: 'div' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
  ];

  const colorOptions = [
    '#000000', '#374151', '#6b7280', '#ef4444', '#f97316', 
    '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  return (
    <div className={`modern-text-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} ${className}`}>
      {/* Toolbar */}
      <div className="border border-neutral-200 rounded-t-lg bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Heading Selector */}
          <select
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="px-3 py-1 border border-neutral-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {headingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Toolbar Groups */}
          {toolbarButtons.map((group, groupIndex) => (
            <React.Fragment key={group.group}>
              {groupIndex > 0 && <div className="w-px h-6 bg-neutral-200" />}
              <div className="flex items-center gap-1">
                {group.buttons.map((button, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (button.action) {
                        button.action();
                      } else {
                        execCommand(button.command, button.value);
                      }
                    }}
                    className="p-2 hover:bg-neutral-100 rounded transition-colors"
                    title={button.tooltip}
                  >
                    <button.icon className="w-4 h-4 text-neutral-600" />
                  </motion.button>
                ))}
              </div>
            </React.Fragment>
          ))}

          {/* Color Picker */}
          <div className="w-px h-6 bg-neutral-200" />
          <div className="flex items-center gap-1">
            <div className="relative group">
              <button
                type="button"
                className="p-2 hover:bg-neutral-100 rounded transition-colors"
                title="Text Color"
              >
                <Palette className="w-4 h-4 text-neutral-600" />
              </button>
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-neutral-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="grid grid-cols-6 gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColor(color)}
                      className="w-6 h-6 rounded border border-neutral-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="p-2 hover:bg-neutral-100 rounded transition-colors"
              title={isPreview ? 'Edit Mode' : 'Preview Mode'}
            >
              {isPreview ? <EyeOff className="w-4 h-4 text-neutral-600" /> : <Eye className="w-4 h-4 text-neutral-600" />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 hover:bg-neutral-100 rounded transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-neutral-600" /> : <Maximize2 className="w-4 h-4 text-neutral-600" />}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Quick actions:</span>
            <button
              type="button"
              onClick={insertMention}
              className="px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              @ Mention
            </button>
            <span>•</span>
            <span>Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for link</span>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div 
        className={`border-x border-b border-neutral-200 rounded-b-lg bg-white ${isFullscreen ? 'flex-1' : ''}`}
        style={{ height: isFullscreen ? 'calc(100vh - 140px)' : height }}
      >
        {isPreview ? (
          <div 
            className="p-4 prose prose-lg max-w-none overflow-y-auto h-full"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            className="p-4 h-full overflow-y-auto focus:outline-none prose prose-lg max-w-none"
            style={{ minHeight: '100%' }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              {!selectedText && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Link Text
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter link text"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  URL
                </label>
                <input
                  ref={linkInputRef}
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl || (!linkText && !selectedText)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Insert Link
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .modern-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .modern-text-editor .prose h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0;
          color: #111827;
        }
        
        .modern-text-editor .prose h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.875rem 0;
          color: #111827;
        }
        
        .modern-text-editor .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0;
          color: #111827;
        }
        
        .modern-text-editor .prose h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.625rem 0;
          color: #111827;
        }
        
        .modern-text-editor .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .modern-text-editor .prose pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        
        .modern-text-editor .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .modern-text-editor .prose a:hover {
          color: #1d4ed8;
        }
        
        .modern-text-editor .prose ul, .modern-text-editor .prose ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .modern-text-editor .prose li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default ModernTextEditor;