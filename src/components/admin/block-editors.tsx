'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/shared/image-upload';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Plus, Trash2 } from 'lucide-react';
import type {
  HeroBlock,
  TextBlock,
  ImageBlock,
  ColumnsBlock,
  CTABlock,
  FAQBlock,
} from '@/types/page';
interface HeroBlockEditorProps {
  block: HeroBlock;
  onChange: (block: HeroBlock) => void;
}
export function HeroBlockEditor({ block, onChange }: HeroBlockEditorProps) {
  return (
    <div className="space-y-3">
      {' '}
      <div>
        {' '}
        <Label>Heading</Label>{' '}
        <Input
          value={block.heading}
          onChange={(e) => onChange({ ...block, heading: e.target.value })}
          placeholder="Hero heading text"
        />{' '}
      </div>{' '}
      <div>
        {' '}
        <Label>Subheading</Label>{' '}
        <Input
          value={block.subheading || ''}
          onChange={(e) => onChange({ ...block, subheading: e.target.value })}
          placeholder="Subheading text"
        />{' '}
      </div>{' '}
      <div>
        {' '}
        <Label>Background Image</Label>{' '}
        <ImageUpload
          bucket="pages"
          existingUrls={block.backgroundImage ? [block.backgroundImage] : []}
          onImagesChange={(urls) => onChange({ ...block, backgroundImage: urls[0] || '' })}
          maxFiles={1}
        />{' '}
      </div>{' '}
      <div className="grid grid-cols-2 gap-3">
        {' '}
        <div>
          {' '}
          <Label>CTA Label</Label>{' '}
          <Input
            value={block.ctaLabel || ''}
            onChange={(e) => onChange({ ...block, ctaLabel: e.target.value })}
            placeholder="Shop Now"
          />{' '}
        </div>{' '}
        <div>
          {' '}
          <Label>CTA URL</Label>{' '}
          <Input
            value={block.ctaUrl || ''}
            onChange={(e) => onChange({ ...block, ctaUrl: e.target.value })}
            placeholder="/products"
          />{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}
interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (block: TextBlock) => void;
}
export function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  return (
    <div>
      {' '}
      <Label>Content</Label>{' '}
      <RichTextEditor
        value={block.content}
        onChange={(content) => onChange({ ...block, content })}
        placeholder="Enter text content..."
      />{' '}
    </div>
  );
}
interface ImageBlockEditorProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}
export function ImageBlockEditor({ block, onChange }: ImageBlockEditorProps) {
  return (
    <div className="space-y-3">
      {' '}
      <div>
        {' '}
        <Label>Image</Label>{' '}
        <ImageUpload
          bucket="pages"
          existingUrls={block.imageUrl ? [block.imageUrl] : []}
          onImagesChange={(urls) => onChange({ ...block, imageUrl: urls[0] || '' })}
          maxFiles={1}
        />{' '}
      </div>{' '}
      <div>
        {' '}
        <Label>Caption</Label>{' '}
        <Input
          value={block.caption || ''}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="Image caption"
        />{' '}
      </div>{' '}
      <div>
        {' '}
        <Label>Alignment</Label>{' '}
        <Select
          value={block.alignment}
          onValueChange={(value) =>
            onChange({ ...block, alignment: value as 'left' | 'center' | 'right' })
          }
        >
          {' '}
          <SelectTrigger>
            {' '}
            <SelectValue />{' '}
          </SelectTrigger>{' '}
          <SelectContent>
            {' '}
            <SelectItem value="left">Left</SelectItem>{' '}
            <SelectItem value="center">Center</SelectItem>{' '}
            <SelectItem value="right">Right</SelectItem>{' '}
          </SelectContent>{' '}
        </Select>{' '}
      </div>{' '}
    </div>
  );
}
interface ColumnsBlockEditorProps {
  block: ColumnsBlock;
  onChange: (block: ColumnsBlock) => void;
}
export function ColumnsBlockEditor({ block, onChange }: ColumnsBlockEditorProps) {
  function updateColumnContent(index: number, content: string) {
    const contents = [...block.columnContents];
    contents[index] = { ...contents[index], content };
    onChange({ ...block, columnContents: contents });
  }
  function addColumn() {
    if (block.columnContents.length >= 3) return;
    onChange({
      ...block,
      columns: block.columnContents.length + 1,
      columnContents: [...block.columnContents, { content: '' }],
    });
  }
  function removeColumn(index: number) {
    if (block.columnContents.length <= 2) return;
    const contents = block.columnContents.filter((_, i) => i !== index);
    onChange({ ...block, columns: contents.length, columnContents: contents });
  }
  return (
    <div className="space-y-3">
      {' '}
      <div className="flex items-center justify-between">
        {' '}
        <Label>Columns ({block.columnContents.length})</Label>{' '}
        {block.columnContents.length < 3 && (
          <Button variant="outline" size="sm" onClick={addColumn}>
            {' '}
            <Plus className="mr-1 h-3 w-3" /> Add Column{' '}
          </Button>
        )}{' '}
      </div>{' '}
      <div
        className={`grid gap-3 ${block.columnContents.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
      >
        {' '}
        {block.columnContents.map((col, idx) => (
          <div key={idx} className="space-y-2">
            {' '}
            <div className="flex items-center justify-between">
              {' '}
              <span className="text-muted-foreground text-xs font-medium">
                Column {idx + 1}
              </span>{' '}
              {block.columnContents.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => removeColumn(idx)}
                >
                  {' '}
                  <Trash2 className="h-3 w-3" />{' '}
                </Button>
              )}{' '}
            </div>{' '}
            <Textarea
              value={col.content}
              onChange={(e) => updateColumnContent(idx, e.target.value)}
              rows={4}
              placeholder={`Column ${idx + 1} content...`}
            />{' '}
          </div>
        ))}{' '}
      </div>{' '}
    </div>
  );
}
interface CTABlockEditorProps {
  block: CTABlock;
  onChange: (block: CTABlock) => void;
}
export function CTABlockEditor({ block, onChange }: CTABlockEditorProps) {
  return (
    <div className="space-y-3">
      {' '}
      <div>
        {' '}
        <Label>Heading</Label>{' '}
        <Input
          value={block.heading}
          onChange={(e) => onChange({ ...block, heading: e.target.value })}
          placeholder="CTA heading"
        />{' '}
      </div>{' '}
      <div>
        {' '}
        <Label>Description</Label>{' '}
        <Textarea
          value={block.description || ''}
          onChange={(e) => onChange({ ...block, description: e.target.value })}
          rows={2}
          placeholder="Short description"
        />{' '}
      </div>{' '}
      <div className="grid grid-cols-2 gap-3">
        {' '}
        <div>
          {' '}
          <Label>Button Label</Label>{' '}
          <Input
            value={block.buttonLabel}
            onChange={(e) => onChange({ ...block, buttonLabel: e.target.value })}
            placeholder="Get Started"
          />{' '}
        </div>{' '}
        <div>
          {' '}
          <Label>Button URL</Label>{' '}
          <Input
            value={block.buttonUrl}
            onChange={(e) => onChange({ ...block, buttonUrl: e.target.value })}
            placeholder="/signup"
          />{' '}
        </div>{' '}
      </div>{' '}
      <div>
        {' '}
        <Label>Background Color</Label>{' '}
        <Input
          value={block.backgroundColor || ''}
          onChange={(e) => onChange({ ...block, backgroundColor: e.target.value })}
          placeholder="#f8f9fa"
        />{' '}
      </div>{' '}
    </div>
  );
}
interface FAQBlockEditorProps {
  block: FAQBlock;
  onChange: (block: FAQBlock) => void;
}
export function FAQBlockEditor({ block, onChange }: FAQBlockEditorProps) {
  function updateItem(index: number, field: 'question' | 'answer', value: string) {
    const items = [...block.items];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...block, items });
  }
  function addItem() {
    onChange({ ...block, items: [...block.items, { question: '', answer: '' }] });
  }
  function removeItem(index: number) {
    if (block.items.length <= 1) return;
    onChange({ ...block, items: block.items.filter((_, i) => i !== index) });
  }
  return (
    <div className="space-y-4">
      {' '}
      {block.items.map((item, idx) => (
        <div key={idx} className="space-y-2 rounded-md border p-3">
          {' '}
          <div className="flex items-center justify-between">
            {' '}
            <span className="text-muted-foreground text-xs font-medium">Item {idx + 1}</span>{' '}
            {block.items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => removeItem(idx)}
              >
                {' '}
                <Trash2 className="h-3 w-3" />{' '}
              </Button>
            )}{' '}
          </div>{' '}
          <Input
            value={item.question}
            onChange={(e) => updateItem(idx, 'question', e.target.value)}
            placeholder="Question"
          />{' '}
          <Textarea
            value={item.answer}
            onChange={(e) => updateItem(idx, 'answer', e.target.value)}
            rows={2}
            placeholder="Answer"
          />{' '}
        </div>
      ))}{' '}
      <Button variant="outline" size="sm" onClick={addItem}>
        {' '}
        <Plus className="mr-1 h-3 w-3" /> Add FAQ Item{' '}
      </Button>{' '}
    </div>
  );
}
