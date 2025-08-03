import { AuthLayout } from '@/components/layout/auth-layout';

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}