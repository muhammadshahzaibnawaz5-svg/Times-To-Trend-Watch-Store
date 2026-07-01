'use client';
import { useState } from 'react';
import { Plus, GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HeroBlockEditor,
  TextBlockEditor,
  ImageBlockEditor,
  ColumnsBlockEditor,
  CTABlockEditor,
  FAQBlockEditor,
} from './block-editors';
import type { PageContentBlock } from '@/types/page';
interface PageBuilderProps {
  blocks: PageContentBlock[];
  onBlocksChange: (blocks: PageContentBlock[]) => void;
}
const blockTypes = [
  { type: 'hero', label: 'Hero' },
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'columns', label: 'Columns' },
  { type: 'cta', label: 'CTA' },
  { type: 'faq', label: 'FAQ' },
] as const;
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
export function PageBuilder({ blocks, onBlocksChange }: PageBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  function addBlock(type: PageContentBlock['type']) {
    const newBlock = createDefaultBlock(type);
    onBlocksChange([...blocks, newBlock]);
    setIsAdding(false);
  }
  function removeBlock(index: number) {
    onBlocksChange(blocks.filter((_, i) => i !== index));
  }
  function moveBlock(index: number, direction: 'up' | 'down') {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onBlocksChange(newBlocks);
  }
  function updateBlock(index: number, block: PageContentBlock) {
    const newBlocks = [...blocks];
    newBlocks[index] = block;
    onBlocksChange(newBlocks);
  }
  return (
    <div className="space-y-4">
      {' '}
      {blocks.length === 0 && (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          {' '}
          <p className="mb-2 text-sm">No content blocks yet</p>{' '}
          <p className="mb-4 text-xs">Add a block to start building your page</p>{' '}
        </div>
      )}{' '}
      {blocks.map((block, index) => (
        <div key={block.id} className="group bg-card rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg">
          {' '}
          <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-2">
            {' '}
            <div className="flex items-center gap-2">
              {' '}
              <GripVertical className="text-muted-foreground h-4 w-4" />{' '}
              <span className="text-sm font-medium capitalize">{block.type} Block</span>{' '}
            </div>{' '}
            <div className="flex items-center gap-1">
              {' '}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={index === 0}
                onClick={() => moveBlock(index, 'up')}
              >
                {' '}
                <ChevronUp className="h-3 w-3" />{' '}
              </Button>{' '}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={index === blocks.length - 1}
                onClick={() => moveBlock(index, 'down')}
              >
                {' '}
                <ChevronDown className="h-3 w-3" />{' '}
              </Button>{' '}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-7 w-7"
                onClick={() => removeBlock(index)}
              >
                {' '}
                <Trash2 className="h-3 w-3" />{' '}
              </Button>{' '}
            </div>{' '}
          </div>{' '}
          <div className="p-4">
            {' '}
            <BlockEditor block={block} onChange={(updated) => updateBlock(index, updated)} />{' '}
          </div>{' '}
        </div>
      ))}{' '}
      {isAdding ? (
        <div className="flex flex-wrap gap-2 rounded-lg border border-dashed p-4">
          {' '}
          {blockTypes.map((bt) => (
            <Button key={bt.type} variant="outline" size="sm" onClick={() => addBlock(bt.type)}>
              {' '}
              {bt.label}{' '}
            </Button>
          ))}{' '}
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
            {' '}
            Cancel{' '}
          </Button>{' '}
        </div>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
          {' '}
          <Plus className="mr-2 h-4 w-4" /> Add Block{' '}
        </Button>
      )}{' '}
    </div>
  );
}
function BlockEditor({
  block,
  onChange,
}: {
  block: PageContentBlock;
  onChange: (block: PageContentBlock) => void;
}) {
  switch (block.type) {
    case 'hero':
      return <HeroBlockEditor block={block} onChange={onChange} />;
    case 'text':
      return <TextBlockEditor block={block} onChange={onChange} />;
    case 'image':
      return <ImageBlockEditor block={block} onChange={onChange} />;
    case 'columns':
      return <ColumnsBlockEditor block={block} onChange={onChange} />;
    case 'cta':
      return <CTABlockEditor block={block} onChange={onChange} />;
    case 'faq':
      return <FAQBlockEditor block={block} onChange={onChange} />;
    default:
      return <div className="text-muted-foreground text-sm">Unknown block type</div>;
  }
}
function createDefaultBlock(type: PageContentBlock['type']): PageContentBlock {
  const id = generateId();
  switch (type) {
    case 'hero':
      return {
        id,
        type: 'hero',
        heading: '',
        subheading: '',
        backgroundImage: '',
        ctaLabel: '',
        ctaUrl: '',
      };
    case 'text':
      return { id, type: 'text', content: '' };
    case 'image':
      return { id, type: 'image', imageUrl: '', caption: '', alignment: 'center' };
    case 'columns':
      return {
        id,
        type: 'columns',
        columns: 2,
        columnContents: [{ content: '' }, { content: '' }],
      };
    case 'cta':
      return {
        id,
        type: 'cta',
        heading: '',
        description: '',
        buttonLabel: '',
        buttonUrl: '',
        backgroundColor: '',
      };
    case 'faq':
      return { id, type: 'faq', items: [{ question: '', answer: '' }] };
  }
}
