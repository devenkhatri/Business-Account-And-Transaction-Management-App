import { AuthLayout } from '@/components/layout/auth-layout';

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}