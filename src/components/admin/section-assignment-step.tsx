'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SECTION_TYPE_LABELS } from '@/constants/section-types';
import { getProductSections } from '@/actions/section-product-actions';
import type { SectionAssignment } from '@/actions/section-product-actions';

interface SectionOption {
  id: string;
  name: string;
  type: string;
  label: string;
  position: 'first' | 'last' | null;
}

interface SectionAssignmentStepProps {
  onAssignmentsChange: (
    assignments: { sectionId: string; position: 'first' | 'last' }[],
  ) => void;
  onComplete: () => void;
  onSkip: () => void;
  loading?: boolean;
}

export function SectionAssignmentStep({
  onAssignmentsChange,
  onComplete,
  onSkip,
  loading,
}: SectionAssignmentStepProps) {
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    getProductSections().then((result) => {
      if (result.data) {
        setSections(
          result.data.map(
            (s: { id: string; name: string; type: string }) => ({
              id: s.id,
              name: s.name,
              type: s.type,
              label: SECTION_TYPE_LABELS[s.type] || s.type,
              position: null,
            }),
          ),
        );
      }
      setLoadingSections(false);
    });
  }, []);

  function setPosition(sectionId: string, position: 'first' | 'last') {
    setSections((prev) => {
      const updated = prev.map((s) =>
        s.id === sectionId
          ? { ...s, position: s.position === position ? null : position }
          : s,
      );
      const assignments = updated
        .filter((s) => s.position !== null)
        .map((s) => ({ sectionId: s.id, position: s.position! }));
      onAssignmentsChange(assignments);
      return updated;
    });
  }

  function handleComplete() {
    const assignments = sections
      .filter((s) => s.position !== null)
      .map((s) => ({ sectionId: s.id, position: s.position! }));
    onAssignmentsChange(assignments);
    onComplete();
  }

  if (loadingSections) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sections...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const assignedCount = sections.filter((s) => s.position !== null).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Assign to Sections</span>
          {assignedCount > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              {assignedCount} section
              {assignedCount !== 1 ? 's' : ''} selected
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which sections this product should appear in, and whether it
          should show first or last.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No product sections available. Create a product section first (e.g.,
            Featured Products, New Arrivals).
          </div>
        ) : (
          <div className="space-y-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className={cn(
                  'rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md',
                  section.position
                    ? 'border-primary/50 bg-primary/5'
                    : 'bg-card',
                )}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{section.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {section.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant={
                        section.position === 'first' ? 'default' : 'outline'
                      }
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setPosition(section.id, 'first')}
                    >
                      <ChevronUp className="mr-1 h-3 w-3" />
                      First
                    </Button>
                    <Button
                      variant={
                        section.position === 'last' ? 'default' : 'outline'
                      }
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setPosition(section.id, 'last')}
                    >
                      <ChevronDown className="mr-1 h-3 w-3" />
                      Last
                    </Button>
                    {section.position && (
                      <div className="ml-1 rounded-full bg-primary/20 p-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onSkip} disabled={loading}>
            {assignedCount > 0
              ? 'Skip (saved assignments will stay)'
              : 'Skip'}
          </Button>
          <Button
            onClick={handleComplete}
            disabled={loading || sections.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : assignedCount > 0 ? (
              `Save & Finish (${assignedCount} section${assignedCount !== 1 ? 's' : ''})`
            ) : (
              'Continue Without Assignment'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
