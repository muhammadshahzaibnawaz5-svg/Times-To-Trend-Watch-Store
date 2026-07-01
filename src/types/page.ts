import type { Database } from './database';

export type Page = Database['public']['Tables']['pages']['Row'];
export type PageInsert = Database['public']['Tables']['pages']['Insert'];
export type PageUpdate = Database['public']['Tables']['pages']['Update'];

export type PageTemplate = 'default' | 'full_width' | 'sidebar' | 'landing';

export type PageContentBlock = HeroBlock | TextBlock | ImageBlock | ColumnsBlock | CTABlock | FAQBlock;

export interface HeroBlock {
  id: string;
  type: 'hero';
  heading: string;
  subheading?: string;
  backgroundImage?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  imageUrl: string;
  caption?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ColumnsBlock {
  id: string;
  type: 'columns';
  columns: number;
  columnContents: { content: string }[];
}

export interface CTABlock {
  id: string;
  type: 'cta';
  heading: string;
  description?: string;
  buttonLabel: string;
  buttonUrl: string;
  backgroundColor?: string;
}

export interface FAQBlock {
  id: string;
  type: 'faq';
  items: { question: string; answer: string }[];
}
