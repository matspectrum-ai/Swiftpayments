export const colors = {
  primary: {
    50: '#e6f7ef',
    100: '#c8eddc',
    200: '#96dcbd',
    300: '#5fc89c',
    400: '#2fb37d',
    500: '#12a765',
    600: '#0d8c54',
    700: '#0b7044',
    800: '#0a5736',
    900: '#08452c',
  },
  neutral: {
    0: '#ffffff',
    50: '#f7f8fa',
    100: '#edeff3',
    200: '#dcdfe6',
    300: '#c2c7d1',
    400: '#9aa2b0',
    500: '#7a8293',
    600: '#5f6778',
    700: '#4a5160',
    800: '#32363f',
    900: '#1c1f26',
    950: '#101216',
  },
  semantic: {
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#2563eb',
  },
} as const;

export type ColorToken = typeof colors;
