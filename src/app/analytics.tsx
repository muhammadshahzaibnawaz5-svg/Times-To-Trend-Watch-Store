'use client';
import { useReportWebVitals } from 'next/web-vitals';
export function Analytics() {
  useReportWebVitals((metric) => {
    console.log('[web-vitals]', metric);
  });
  return null;
}
