import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#194424',
          dark: '#0F2916',
          light: '#2D6B3F',
        },
        secondary: {
          DEFAULT: '#337A49',
          dark: '#265A36',
          light: '#4A9A62',
        },
        accent: {
          DEFAULT: '#655E2C',
          dark: '#4A441F',
          light: '#8A7F3D',
        },
        sand: {
          DEFAULT: '#F4EAD5',
          dark: '#E8D5B7',
          light: '#FAF3E8',
        },
        light: '#E9EBE5',
        support: '#80996F',
        neutral: '#B0BCA4',
        
        // Semantic colors mapped to brand palette
        success: {
          DEFAULT: '#337A49', // secondary
          light: '#E8F5E9',
          dark: '#194424',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#655E2C', // accent
          light: '#FFF9E6',
          dark: '#4A441F',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#80996F', // support
          light: '#F1F5EE',
          dark: '#556A47',
          foreground: '#ffffff',
        },
        
        // shadcn/ui colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
