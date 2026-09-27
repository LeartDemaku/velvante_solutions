import '@/app/globals.css';
import { AdminShell } from '@/components/admin/admin-shell';

export const metadata = {
  title: 'Velvante Solutions — Admin Workspace & CMS',
  description: 'Enterprise administration, lead CRM, and portfolio management platform',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[rgb(var(--color-background))] text-[rgb(var(--color-text))] antialiased min-h-screen">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
