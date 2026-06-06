import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vault - Authenticator',
  robots: {
    index: false,
    follow: false,
  }
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
