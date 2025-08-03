import { AuthLayout } from '@/components/layout/auth-layout';

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}