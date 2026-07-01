'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/admin/empty-state';
import {
  getProductSections,
  assignProductToSections,
  getProductSectionAssignments,
  removeProductFromSection,
} from '@/actions/section-product-actions';
import { SECTION_TYPE_LABELS } from '@/constants/section-types';

interface ProductSectionManagerProps {
  productId: string;
}

interface Assignment {
  sectionId: string;
  sectionName: string;
  sectionType: string;
  position: 'first' | 'last' | number;
}

export function ProductSectionManager({ productId }: ProductSectionManagerProps) {
  const [allSections, setAllSections] = useState<{ id: string; name: string; type: string }[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [sectionsRes, assignmentsRes] = await Promise.all([
        getProductSections(),
        getProductSectionAssignments(productId),
      ]);

      if (sectionsRes.data) {
        setAllSections(sectionsRes.data);
      }

      if (assignmentsRes.data) {
        const currentAssignments: Assignment[] = (assignmentsRes.data || []).map(
          (a: { sectionId: string; position: 'first' | 'last' | number }) => {
            const section = (sectionsRes.data || []).find(
              (s: { id: string }) => s.id === a.sectionId,
            );
            return {
              sectionId: a.sectionId,
              sectionName: (section as { name?: string })?.name || '',
              sectionType: (section as { type?: string })?.type || '',
              position: a.position as 'first' | 'last' | number,
            };
          },
        );
        setAssignments(currentAssignments);
      }

      setLoading(false);
    }
    load();
  }, [productId]);

  const unassignedSections = allSections.filter(
    (s) => !assignments.find((a) => a.sectionId === s.id),
  );

  async function handleAdd(sectionId: string) {
    const section = allSections.find((s) => s.id === sectionId);
    if (!section) return;

    setSaving(true);
    const result = await assignProductToSections(productId, [{ sectionId, position: 'last' }]);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Added to "${section.name}"`);
      setAssignments((prev) => [
        ...prev,
        {
          sectionId,
          sectionName: section.name,
          sectionType: section.type,
          position: prev.length as number,
        },
      ]);
    }
  }

  async function handleRemove(sectionId: string) {
    const section = allSections.find((s) => s.id === sectionId);
    setSaving(true);
    const result = await removeProductFromSection(productId, sectionId);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Removed from "${section?.name}"`);
      setAssignments((prev) => prev.filter((a) => a.sectionId !== sectionId));
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading section assignments...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Assignments</CardTitle>
        <p className="text-muted-foreground text-sm">
          Manage which sections this product appears in.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments.length === 0 ? (
          <EmptyState
            title="Not assigned to any sections"
            description="This product is not manually assigned to any sections. It may still appear in sections based on automatic filters."
          />
        ) : (
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.sectionId}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{assignment.sectionName}</p>
                  <p className="text-muted-foreground text-xs">
                    {SECTION_TYPE_LABELS[assignment.sectionType] || assignment.sectionType}
                    {typeof assignment.position === 'number' && (
                      <> &middot; Position #{assignment.position + 1}</>
                    )}
                    {assignment.position === 'first' && <> &middot; First</>}
                    {assignment.position === 'last' && <> &middot; Last</>}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-8 w-8"
                  onClick={() => handleRemove(assignment.sectionId)}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {unassignedSections.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Add to section</p>
            <div className="flex flex-wrap gap-2">
              {unassignedSections.map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAdd(section.id)}
                  disabled={saving}
                >
                  + {section.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
