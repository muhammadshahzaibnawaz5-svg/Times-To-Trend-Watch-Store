import type { Database } from './database';

export type Section = Database['public']['Tables']['sections']['Row'];
export type SectionInsert = Database['public']['Tables']['sections']['Insert'];
export type SectionUpdate = Database['public']['Tables']['sections']['Update'];

export type SectionSettings = Record<string, unknown>;
