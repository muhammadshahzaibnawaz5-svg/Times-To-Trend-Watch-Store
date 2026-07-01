import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { HeroSectionClient } from './hero-section-client';
type HeroProps = {
  title?: string;
  subtitle?: string;
  sectionId?: string;
  backgroundImage?: string;
};
export async function HeroSection({ title, subtitle, sectionId, backgroundImage }: HeroProps) {
  const supabase = await createServerClient();
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if ((!banners || banners.length === 0) && !title && !backgroundImage) return null;
  return (
    <HeroSectionClient
      banners={banners || []}
      sectionTitle={title}
      sectionSubtitle={subtitle}
      backgroundImage={backgroundImage}
    />
  );
}
