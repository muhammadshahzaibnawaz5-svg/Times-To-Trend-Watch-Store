'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      if (onChange) {
        onChange(editorRef.current?.innerHTML || '');
      }
    },
    [onChange],
  );
  function handleBold() {
    execCommand('bold');
  }
  function handleItalic() {
    execCommand('italic');
  }
  function handleHeading(level: 'h2' | 'h3') {
    document.execCommand('formatBlock', false, level === 'h2' ? '<h2>' : '<h3>');
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  }
  function handleBulletList() {
    execCommand('insertUnorderedList');
  }
  function handleOrderedList() {
    execCommand('insertOrderedList');
  }
  function handleLink() {
    if (showLinkInput && linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setShowLinkInput(true);
      }
    }
  }
  function handleUndo() {
    execCommand('undo');
  }
  function handleRedo() {
    execCommand('redo');
  }
  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }
  return (
    <div className="overflow-hidden rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {' '}
      <div className="bg-muted/30 flex flex-wrap items-center gap-0.5 border-b p-1">
        {' '}
        <EditorButton onClick={handleBold} title="Bold (Ctrl+B)">
          {' '}
          <Bold className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <EditorButton onClick={handleItalic} title="Italic (Ctrl+I)">
          {' '}
          <Italic className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <Separator orientation="vertical" className="mx-1 h-6" />{' '}
        <EditorButton onClick={() => handleHeading('h2')} title="Heading 2">
          {' '}
          <Heading2 className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <EditorButton onClick={() => handleHeading('h3')} title="Heading 3">
          {' '}
          <Heading3 className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <Separator orientation="vertical" className="mx-1 h-6" />{' '}
        <EditorButton onClick={handleBulletList} title="Bullet List">
          {' '}
          <List className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <EditorButton onClick={handleOrderedList} title="Ordered List">
          {' '}
          <ListOrdered className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <Separator orientation="vertical" className="mx-1 h-6" />{' '}
        <EditorButton onClick={handleLink} title="Insert Link">
          {' '}
          <Link className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <Separator orientation="vertical" className="mx-1 h-6" />{' '}
        <EditorButton onClick={handleUndo} title="Undo (Ctrl+Z)">
          {' '}
          <Undo className="h-4 w-4" />{' '}
        </EditorButton>{' '}
        <EditorButton onClick={handleRedo} title="Redo (Ctrl+Y)">
          {' '}
          <Redo className="h-4 w-4" />{' '}
        </EditorButton>{' '}
      </div>{' '}
      {showLinkInput && (
        <div className="flex items-center gap-2 border-b p-2">
          {' '}
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL..."
            className="h-8 text-sm"
            autoFocus
          />{' '}
          <Button size="sm" onClick={handleLink}>
            Apply
          </Button>{' '}
          <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>
            Cancel
          </Button>{' '}
        </div>
      )}{' '}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="prose prose-sm max-w-none px-4 py-3 focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />{' '}
    </div>
  );
}
function EditorButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-md',
      )}
    >
      {' '}
      {children}{' '}
    </button>
  );
}
