import { colors, spacing, typography } from '@swiftpay/ui';

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: spacing[3],
    padding: spacing[6],
    textAlign: 'center',
  },
  badge: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[700],
    backgroundColor: colors.primary[50],
    border: `1px solid ${colors.primary[200]}`,
    borderRadius: '999px',
    padding: `${spacing[1]} ${spacing[3]}`,
  },
  title: {
    margin: 0,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },
  subtitle: {
    margin: 0,
    fontSize: typography.fontSize.md,
    color: colors.neutral[500],
  },
} as const;

export default function HomePage() {
  return (
    <main style={styles.main}>
      <p style={styles.badge}>Foundation shell</p>
      <h1 style={styles.title}>Merchant dashboard</h1>
      <p style={styles.subtitle}>Swiftpayments — Pix payments platform.</p>
    </main>
  );
}
