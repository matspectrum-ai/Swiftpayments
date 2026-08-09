import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Swiftpayments — Checkout',
  description: 'Hosted checkout for Swiftpayments.',
};

const styles = {
  html: { colorScheme: 'light' },
  body: { margin: 0, fontFamily: 'system-ui, sans-serif' },
} as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={styles.html}>
      <body style={styles.body}>{children}</body>
    </html>
  );
}
