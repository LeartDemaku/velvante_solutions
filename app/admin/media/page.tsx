'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Media Manager</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">Upload, manage, and store images for projects and articles.</p>
      </div>

      <Card className="p-12 text-center border-dashed border-2 border-[rgb(var(--color-border))] space-y-4 bg-[rgb(var(--color-surface))]">
        <UploadCloud className="mx-auto text-[rgb(var(--color-accent-light))]" size={48} />
        <div>
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">Upload Media Files</h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Drag & drop files here or click to browse (PNG, JPG, WebP, SVG)</p>
        </div>
        <Button size="sm" leftIcon={<UploadCloud size={14} />}>
          Choose Files
        </Button>
      </Card>
    </div>
  );
}
