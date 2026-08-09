import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { colors, typography } from '@swiftpay/ui';

export const metadata: Metadata = {
  title: 'Swiftpayments — Merchant',
  description: 'Merchant dashboard for Swiftpayments.',
};

const styles = {
  html: {
    colorScheme: 'light',
  },
  body: {
    margin: 0,
    fontFamily: typography.fontFamily.sans,
    backgroundColor: colors.neutral[50],
    color: colors.neutral[900],
  },
} as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={styles.html}>
      <body style={styles.body}>{children}</body>
    </html>
  );
}
