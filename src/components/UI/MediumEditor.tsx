import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Underline,
  Link,
  Image,
  Quote,
  Code,
  Type,
  Plus,
  X,
  Check,
  ExternalLink,
  AtSign,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff
} from 'lucide-react';

interface MediumEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface FloatingToolbarProps {
  show: boolean;
  position: { x: number; y: number };
  onFormat: (command: string, value?: string) => void;
  onLink: () => void;
}

interface AddMenuProps {
  show: boolean;
  position: { x: number; y: number };
  onInsert: (type: string) => void;
  onClose: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ show, position, onFormat, onLink }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 bg-neutral-900 text-white rounded-lg shadow-2xl px-2 py-1 flex items-center space-x-1"
      style={{ 
        left: position.x, 
        top: position.y - 50,
        transform: 'translateX(-50%)'
      }}
    >
      <button
        onClick={() => onFormat('bold')}
        className="p-2 hover:bg-white/20 rounded transition-colors"
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('italic')}
        className="p-2 hover:bg-white/20 rounded transition-colors"
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFormat('underline')}
        className="p-2 hover:bg-white/20 rounded transition-colors"
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/20 mx-1" />
      <button
        onClick={onLink}
        className="p-2 hover:bg-white/20 rounded transition-colors"
        title="Add Link"
      >
        <Link className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const AddMenu: React.FC<AddMenuProps> = ({ show, position, onInsert, onClose }) => {
  if (!show) return null;

  const menuItems = [
    { icon: Image, label: 'Image', type: 'image', description: 'Upload or embed an image' },
    { icon: Quote, label: 'Quote', type: 'quote', description: 'Create a quote block' },
    { icon: Code, label: 'Code', type: 'code', description: 'Insert code block' },
    { icon: Type, label: 'Heading', type: 'heading', description: 'Add a heading' },
    { icon: ExternalLink, label: 'Embed', type: 'embed', description: 'Embed from URL' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 min-w-[280px]"
      style={{ 
        left: position.x + 40, 
        top: position.y - 10
      }}
    >
      <div className="px-4 py-2 border-b border-neutral-100">
        <p className="text-sm font-medium text-neutral-700">Add content</p>
      </div>
      {menuItems.map((item) => (
        <button
          key={item.type}
          onClick={() => {
            onInsert(item.type);
            onClose();
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left"
        >
          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
            <item.icon className="w-4 h-4 text-neutral-600" />
          </div>
          <div>
            <p className="font-medium text-neutral-900">{item.label}</p>
            <p className="text-xs text-neutral-500">{item.description}</p>
          </div>
        </button>
      ))}
    </motion.div>
  );
};

const MediumEditor: React.FC<MediumEditorProps> = ({
  value,
  onChange,
  placeholder = "Tell your story...",
  className = ""
}) => {
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 });
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [currentLine, setCurrentLine] = useState<HTMLElement | null>(null);
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [plusButtonPosition, setPlusButtonPosition] = useState({ x: 0, y: 0 });

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
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY
      });
      setShowFloatingToolbar(true);
    } else {
      setShowFloatingToolbar(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPreview) return;

    const target = e.target as HTMLElement;
    const line = target.closest('p, h1, h2, h3, h4, div') as HTMLElement;
    
    if (line && line !== currentLine) {
      setCurrentLine(line);
      const rect = line.getBoundingClientRect();
      const isEmpty = line.textContent?.trim() === '' || line.innerHTML === '<br>';
      
      if (isEmpty) {
        setPlusButtonPosition({
          x: rect.left - 40,
          y: rect.top + window.scrollY + rect.height / 2
        });
        setShowPlusButton(true);
      } else {
        setShowPlusButton(false);
      }
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => setShowPlusButton(false), 100);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleFormat = (command: string, value?: string) => {
    execCommand(command, value);
    setShowFloatingToolbar(false);
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setLinkText(selection.toString());
      setShowLinkDialog(true);
      setShowFloatingToolbar(false);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      if (linkText) {
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">${linkText}</a>`;
        execCommand('insertHTML', linkHtml);
      } else {
        execCommand('createLink', linkUrl);
      }
    }
    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleInsert = (type: string) => {
    const cursor = window.getSelection();
    let html = '';

    switch (type) {
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          html = `<div class="my-6"><img src="${imageUrl}" alt="Image" class="w-full rounded-lg shadow-sm" /></div>`;
        }
        break;
      case 'quote':
        html = `<blockquote class="border-l-4 border-neutral-300 pl-6 py-4 my-6 italic text-lg text-neutral-700 bg-neutral-50 rounded-r-lg">"Your quote here"</blockquote>`;
        break;
      case 'code':
        html = `<pre class="bg-neutral-900 text-green-400 p-4 rounded-lg my-6 overflow-x-auto"><code>// Your code here</code></pre>`;
        break;
      case 'heading':
        html = `<h2 class="text-2xl font-bold text-neutral-900 mt-8 mb-4">Your heading</h2>`;
        break;
      case 'embed':
        const embedUrl = prompt('Paste a link to embed content:');
        if (embedUrl) {
          html = `<div class="my-6 p-4 border border-neutral-200 rounded-lg bg-neutral-50"><p class="text-sm text-neutral-600 mb-2">Embedded content:</p><a href="${embedUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">${embedUrl}</a></div>`;
        }
        break;
    }

    if (html) {
      execCommand('insertHTML', html);
    }
  };

  const handleMention = () => {
    const mention = prompt('Enter username to mention:');
    if (mention) {
      const mentionHtml = `<span class="text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">@${mention}</span>&nbsp;`;
      execCommand('insertHTML', mentionHtml);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle @ mentions
    if (e.key === '@') {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection) {
          const range = selection.getRangeAt(0);
          const textNode = range.startContainer;
          if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent || '';
            const atIndex = text.lastIndexOf('@');
            if (atIndex !== -1) {
              // Could implement autocomplete here
            }
          }
        }
      }, 0);
    }

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          handleLink();
          break;
      }
    }

    // Handle Enter for new paragraphs
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      execCommand('insertHTML', '<p><br></p>');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Check if it's a URL
    const urlRegex = /^https?:\/\/.+/;
    if (urlRegex.test(text.trim())) {
      const shouldEmbed = window.confirm('This looks like a URL. Would you like to embed it?');
      if (shouldEmbed) {
        const embedHtml = `<div class="my-6 p-4 border border-neutral-200 rounded-lg bg-neutral-50"><p class="text-sm text-neutral-600 mb-2">Embedded content:</p><a href="${text}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">${text}</a></div>`;
        execCommand('insertHTML', embedHtml);
        return;
      }
    }
    
    // Regular text paste
    execCommand('insertText', text);
  };

  return (
    <div className={`medium-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} ${className}`}>
      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-neutral-900">Write your story</h3>
          <button
            onClick={handleMention}
            className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <AtSign className="w-4 h-4" />
            <span>Mention</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title={isPreview ? 'Edit' : 'Preview'}
          >
            {isPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div 
        className={`relative ${isFullscreen ? 'h-full overflow-y-auto' : 'min-h-[500px]'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Plus Button */}
        <AnimatePresence>
          {showPlusButton && !isPreview && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                setAddMenuPosition(plusButtonPosition);
                setShowAddMenu(true);
              }}
              className="fixed z-40 w-8 h-8 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full flex items-center justify-center transition-colors"
              style={{
                left: plusButtonPosition.x,
                top: plusButtonPosition.y - 16
              }}
            >
              <Plus className="w-4 h-4 text-neutral-600" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Editor */}
        {isPreview ? (
          <div 
            className="p-8 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="p-8 focus:outline-none prose prose-lg max-w-none"
            style={{ minHeight: isFullscreen ? 'calc(100vh - 80px)' : '500px' }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
      </div>

      {/* Floating Toolbar */}
      <AnimatePresence>
        {showFloatingToolbar && (
          <FloatingToolbar
            show={showFloatingToolbar}
            position={toolbarPosition}
            onFormat={handleFormat}
            onLink={handleLink}
          />
        )}
      </AnimatePresence>

      {/* Add Menu */}
      <AnimatePresence>
        {showAddMenu && (
          <AddMenu
            show={showAddMenu}
            position={addMenuPosition}
            onInsert={handleInsert}
            onClose={() => setShowAddMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Add Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Link text"
                />
              </div>
              
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
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Overlay for fullscreen */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowAddMenu(false)}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .medium-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        .medium-editor .prose p {
          margin: 1rem 0;
          line-height: 1.7;
          font-size: 1.125rem;
        }
        
        .medium-editor .prose h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .medium-editor .prose h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem 0;
          line-height: 1.3;
        }
        
        .medium-editor .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          line-height: 1.4;
        }
        
        .medium-editor .prose blockquote {
          font-style: italic;
          font-size: 1.25rem;
          line-height: 1.6;
        }
        
        .medium-editor .prose a {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-color: rgba(37, 99, 235, 0.3);
          text-underline-offset: 2px;
          transition: all 0.2s ease;
        }
        
        .medium-editor .prose a:hover {
          color: #1d4ed8;
          text-decoration-color: rgba(29, 78, 216, 0.6);
        }
        
        .medium-editor .prose img {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .medium-editor .prose pre {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        
        .medium-editor [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default MediumEditor;