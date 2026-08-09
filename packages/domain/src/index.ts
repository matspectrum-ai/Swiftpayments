export type CommercialEnvironment = 'test' | 'live';

export type MoneyMinor = number & { readonly __brand: 'MoneyMinor' };
export type BasisPoints = number & { readonly __brand: 'BasisPoints' };

export const DOMAIN_FOUNDATION_VERSION = 1 as const;
