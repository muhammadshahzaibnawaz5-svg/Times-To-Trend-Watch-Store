'use client';
import { useState } from 'react';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MenuItem } from '@/types/menu';
interface MenuBuilderProps {
  items: MenuItem[];
  onItemsChange: (items: MenuItem[]) => void;
}
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
function createMenuItem(): MenuItem {
  return { id: generateId(), label: '', url: '', children: [] };
}
export function MenuBuilder({ items, onItemsChange }: MenuBuilderProps) {
  function updateItem(index: number, field: keyof MenuItem, value: string) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onItemsChange(newItems);
  }
  function removeItem(index: number) {
    onItemsChange(items.filter((_, i) => i !== index));
  }
  function addChild(parentIndex: number) {
    const newItems = [...items];
    newItems[parentIndex] = {
      ...newItems[parentIndex],
      children: [...newItems[parentIndex].children, createMenuItem()],
    };
    onItemsChange(newItems);
  }
  function updateChild(
    parentIndex: number,
    childIndex: number,
    field: keyof MenuItem,
    value: string,
  ) {
    const newItems = [...items];
    newItems[parentIndex].children[childIndex] = {
      ...newItems[parentIndex].children[childIndex],
      [field]: value,
    };
    onItemsChange(newItems);
  }
  function removeChild(parentIndex: number, childIndex: number) {
    const newItems = [...items];
    newItems[parentIndex].children = newItems[parentIndex].children.filter(
      (_, i) => i !== childIndex,
    );
    onItemsChange(newItems);
  }
  function moveItem(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onItemsChange(newItems);
  }
  function addItem() {
    onItemsChange([...items, createMenuItem()]);
  }
  return (
    <div className="space-y-4">
      {' '}
      {items.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">
          {' '}
          No menu items yet. Click below to add one.{' '}
        </p>
      )}{' '}
      {items.map((item, index) => (
        <MenuItemRow
          key={item.id}
          item={item}
          index={index}
          isFirst={index === 0}
          isLast={index === items.length - 1}
          onUpdate={(field, value) => updateItem(index, field, value)}
          onRemove={() => removeItem(index)}
          onMoveUp={() => moveItem(index, 'up')}
          onMoveDown={() => moveItem(index, 'down')}
          onAddChild={() => addChild(index)}
          onUpdateChild={(childIndex, field, value) => updateChild(index, childIndex, field, value)}
          onRemoveChild={(childIndex) => removeChild(index, childIndex)}
        />
      ))}{' '}
      <Button variant="outline" className="w-full" onClick={addItem}>
        {' '}
        <Plus className="mr-2 h-4 w-4" /> Add Menu Item{' '}
      </Button>{' '}
    </div>
  );
}
interface MenuItemRowProps {
  item: MenuItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (field: keyof MenuItem, value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddChild: () => void;
  onUpdateChild: (childIndex: number, field: keyof MenuItem, value: string) => void;
  onRemoveChild: (childIndex: number) => void;
}
function MenuItemRow({
  item,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddChild,
  onUpdateChild,
  onRemoveChild,
}: MenuItemRowProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="bg-card rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg">
      {' '}
      <div className="bg-muted/30 flex items-center gap-2 border-b px-3 py-2">
        {' '}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground cursor-pointer rounded-full"
        >
          {' '}
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}{' '}
        </button>{' '}
        <GripVertical className="text-muted-foreground h-4 w-4" />{' '}
        <span className="text-muted-foreground flex-1 text-sm">
          {' '}
          {item.label || <span className="italic">Empty item</span>}{' '}
        </span>{' '}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={isFirst}
          onClick={onMoveUp}
        >
          {' '}
          â†‘{' '}
        </Button>{' '}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={isLast}
          onClick={onMoveDown}
        >
          {' '}
          â†“{' '}
        </Button>{' '}
        <Button variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={onRemove}>
          {' '}
          <Trash2 className="h-3 w-3" />{' '}
        </Button>{' '}
      </div>{' '}
      {expanded && (
        <div className="space-y-3 p-3">
          {' '}
          <div className="grid grid-cols-2 gap-3">
            {' '}
            <div>
              {' '}
              <Label className="text-xs">Label</Label>{' '}
              <Input
                value={item.label}
                onChange={(e) => onUpdate('label', e.target.value)}
                placeholder="Menu label"
                className="h-8 text-sm"
              />{' '}
            </div>{' '}
            <div>
              {' '}
              <Label className="text-xs">URL</Label>{' '}
              <Input
                value={item.url}
                onChange={(e) => onUpdate('url', e.target.value)}
                placeholder="/path"
                className="h-8 text-sm"
              />{' '}
            </div>{' '}
          </div>{' '}
          {item.children.length > 0 && (
            <div className="ml-4 space-y-2 border-l-2 pl-3">
              {' '}
              {item.children.map((child, childIndex) => (
                <div key={child.id} className="flex items-center gap-2 rounded-md border p-2">
                  {' '}
                  <Input
                    value={child.label}
                    onChange={(e) => onUpdateChild(childIndex, 'label', e.target.value)}
                    placeholder="Child label"
                    className="h-7 text-xs"
                  />{' '}
                  <Input
                    value={child.url}
                    onChange={(e) => onUpdateChild(childIndex, 'url', e.target.value)}
                    placeholder="/path"
                    className="h-7 text-xs"
                  />{' '}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => onRemoveChild(childIndex)}
                  >
                    {' '}
                    <Trash2 className="h-3 w-3" />{' '}
                  </Button>{' '}
                </div>
              ))}{' '}
            </div>
          )}{' '}
          <Button variant="outline" size="sm" onClick={onAddChild}>
            {' '}
            <Plus className="mr-1 h-3 w-3" /> Add Child{' '}
          </Button>{' '}
        </div>
      )}{' '}
    </div>
  );
}
