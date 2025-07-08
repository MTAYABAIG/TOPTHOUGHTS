import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Type,
  Minus,
  FileText,
  MapPin,
  Bookmark,
  MousePointer,
  Plus,
  X,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  AtSign,
  Hash
} from 'lucide-react';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface AddMenuProps {
  editor: any;
  onClose: () => void;
}

const AddMenu: React.FC<AddMenuProps> = ({ editor, onClose }) => {
  const menuItems = [
    {
      icon: Type,
      label: 'Heading 1',
      description: 'Large section heading',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      shortcut: 'Ctrl+Alt+1'
    },
    {
      icon: Type,
      label: 'Heading 2',
      description: 'Medium section heading',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      shortcut: 'Ctrl+Alt+2'
    },
    {
      icon: Type,
      label: 'Heading 3',
      description: 'Small section heading',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      shortcut: 'Ctrl+Alt+3'
    },
    {
      icon: FileText,
      label: 'Text',
      description: 'Regular paragraph text',
      action: () => editor.chain().focus().setParagraph().run(),
      shortcut: 'Ctrl+Alt+0'
    },
    {
      icon: ImageIcon,
      label: 'Image',
      description: 'Upload or embed an image',
      action: () => {
        const url = prompt('Enter image URL:');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    },
    {
      icon: YoutubeIcon,
      label: 'Video',
      description: 'Embed YouTube or Vimeo video',
      action: () => {
        const url = prompt('Enter YouTube URL:');
        if (url) {
          editor.commands.setYoutubeVideo({ src: url });
        }
      }
    },
    {
      icon: Code,
      label: 'Code Block',
      description: 'Multi-line code with syntax highlighting',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      shortcut: 'Ctrl+Alt+C'
    },
    {
      icon: Quote,
      label: 'Quote',
      description: 'Capture a quote or citation',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      shortcut: 'Ctrl+Shift+B'
    },
    {
      icon: Minus,
      label: 'Divider',
      description: 'Visual separator line',
      action: () => editor.chain().focus().setHorizontalRule().run()
    },
    {
      icon: List,
      label: 'Bullet List',
      description: 'Unordered list of items',
      action: () => editor.chain().focus().toggleBulletList().run(),
      shortcut: 'Ctrl+Shift+8'
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      description: 'Ordered list of items',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      shortcut: 'Ctrl+Shift+7'
    },
    {
      icon: CheckSquare,
      label: 'To-do List',
      description: 'Interactive checklist',
      action: () => editor.chain().focus().toggleTaskList().run()
    },
    {
      icon: TableIcon,
      label: 'Table',
      description: 'Insert a data table',
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
    {
      icon: LinkIcon,
      label: 'Embed',
      description: 'Embed iframe or HTML',
      action: () => {
        const url = prompt('Enter URL to embed:');
        if (url) {
          const embedHtml = `<div class="embed-container"><iframe src="${url}" frameborder="0" allowfullscreen></iframe></div>`;
          editor.chain().focus().insertContent(embedHtml).run();
        }
      }
    },
    {
      icon: Bookmark,
      label: 'Bookmark Card',
      description: 'Rich link preview card',
      action: () => {
        const url = prompt('Enter URL for bookmark:');
        if (url) {
          const bookmarkHtml = `<div class="bookmark-card"><a href="${url}" target="_blank">${url}</a></div>`;
          editor.chain().focus().insertContent(bookmarkHtml).run();
        }
      }
    },
    {
      icon: MousePointer,
      label: 'Button',
      description: 'Call-to-action button',
      action: () => {
        const text = prompt('Button text:');
        const url = prompt('Button URL:');
        if (text && url) {
          const buttonHtml = `<a href="${url}" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">${text}</a>`;
          editor.chain().focus().insertContent(buttonHtml).run();
        }
      }
    },
    {
      icon: MapPin,
      label: 'Map',
      description: 'Embed Google Maps',
      action: () => {
        const location = prompt('Enter location or Google Maps embed URL:');
        if (location) {
          const mapHtml = `<div class="map-embed"><p>📍 ${location}</p></div>`;
          editor.chain().focus().insertContent(mapHtml).run();
        }
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 max-w-sm max-h-96 overflow-y-auto"
    >
      <div className="px-4 py-3 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900">Add Content</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
      </div>
      
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left"
          >
            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-neutral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900 text-sm">{item.label}</p>
                {item.shortcut && (
                  <span className="text-xs text-neutral-400 font-mono">{item.shortcut}</span>
                )}
              </div>
              <p className="text-xs text-neutral-500 truncate">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = "Tell your story...",
  className = ""
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Create and configure lowlight instance
  const lowlight = createLowlight();
  lowlight.register('javascript', javascript);
  lowlight.register('typescript', typescript);
  lowlight.register('css', css);
  lowlight.register('html', html);
  lowlight.register('python', python);
  lowlight.register('json', json);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-700 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-sm max-w-full h-auto',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'rounded-lg overflow-hidden',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-neutral-900 text-green-400 p-4 rounded-lg overflow-x-auto',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-neutral-200',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-neutral-300 px-4 py-2 bg-neutral-50 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-neutral-300 px-4 py-2',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'task-item',
        },
        nested: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none p-8',
        style: isFullscreen ? 'min-height: calc(100vh - 120px);' : 'min-height: 500px;'
      },
    },
  });

  const handleAddContent = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setAddMenuPosition({
      x: rect.left + 40,
      y: rect.top + window.scrollY
    });
    setShowAddMenu(true);
  };

  const addMention = () => {
    const mention = prompt('Enter username to mention:');
    if (mention && editor) {
      const mentionHtml = `<span class="mention">@${mention}</span>`;
      editor.chain().focus().insertContent(mentionHtml).run();
    }
  };

  const addHashtag = () => {
    const hashtag = prompt('Enter hashtag:');
    if (hashtag && editor) {
      const hashtagHtml = `<span class="hashtag">#${hashtag}</span>`;
      editor.chain().focus().insertContent(hashtagHtml).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`tiptap-editor ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} ${className}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-neutral-900">Write your story</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={addMention}
              className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
              title="Add mention"
            >
              <AtSign className="w-4 h-4" />
              <span>Mention</span>
            </button>
            <button
              onClick={addHashtag}
              className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
              title="Add hashtag"
            >
              <Hash className="w-4 h-4" />
              <span>Hashtag</span>
            </button>
          </div>
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
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-8 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <>
            {/* Bubble Menu for text selection */}
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className="bg-neutral-900 text-white rounded-lg shadow-2xl px-2 py-1 flex items-center space-x-1"
            >
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded transition-colors ${
                  editor.isActive('bold') ? 'bg-white/20' : 'hover:bg-white/20'
                }`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded transition-colors ${
                  editor.isActive('italic') ? 'bg-white/20' : 'hover:bg-white/20'
                }`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded transition-colors ${
                  editor.isActive('strike') ? 'bg-white/20' : 'hover:bg-white/20'
                }`}
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded transition-colors ${
                  editor.isActive('code') ? 'bg-white/20' : 'hover:bg-white/20'
                }`}
              >
                <Code className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <button
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className="p-2 hover:bg-white/20 rounded transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </BubbleMenu>

            {/* Floating Menu for empty lines */}
            <FloatingMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className="flex items-center space-x-2"
            >
              <button
                onClick={handleAddContent}
                className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-neutral-600" />
              </button>
            </FloatingMenu>

            <EditorContent editor={editor} />
          </>
        )}
      </div>

      {/* Add Menu */}
      <AnimatePresence>
        {showAddMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowAddMenu(false)}
            />
            <div
              className="fixed z-50"
              style={{
                left: addMenuPosition.x,
                top: addMenuPosition.y
              }}
            >
              <AddMenu
                editor={editor}
                onClose={() => setShowAddMenu(false)}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style>{`
        .tiptap-editor .ProseMirror {
          outline: none;
        }
        
        .tiptap-editor .ProseMirror p {
          margin: 1rem 0;
          line-height: 1.7;
          font-size: 1.125rem;
        }
        
        .tiptap-editor .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .tiptap-editor .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem 0;
          line-height: 1.3;
        }
        
        .tiptap-editor .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          line-height: 1.4;
        }
        
        .tiptap-editor .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          font-size: 1.25rem;
          color: #6b7280;
          background: #f9fafb;
          padding: 1rem 1.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .tiptap-editor .ProseMirror pre {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          margin: 1.5rem 0;
        }
        
        .tiptap-editor .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        
        .tiptap-editor .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
        }
        
        .tiptap-editor .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }
        
        .tiptap-editor .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        
        .tiptap-editor .mention {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }
        
        .tiptap-editor .hashtag {
          background: #fef3c7;
          color: #92400e;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }
        
        .tiptap-editor .embed-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
        }
        
        .tiptap-editor .embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .tiptap-editor .bookmark-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1.5rem 0;
          background: #f9fafb;
        }
        
        .tiptap-editor .bookmark-card a {
          color: #1d4ed8;
          text-decoration: none;
        }
        
        .tiptap-editor .map-embed {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1.5rem 0;
          background: #f0fdf4;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default TipTapEditor;