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
    // Custom breakpoints for responsive design
    // Requirements: 1.1 from responsive-intelligent-navigation/requirements.md
    screens: {
      'sm': '640px',   // mobile breakpoint
      'md': '768px',   // tablet breakpoint
      'lg': '1024px',  // desktop breakpoint
      'xl': '1280px',  // large desktop breakpoint
      '2xl': '1536px',
    },
    // Container configuration with responsive max-widths and padding
    // Requirements: 1.3, 1.4 from responsive-intelligent-navigation/requirements.md
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',    // 16px mobile
        sm: '1.5rem',       // 24px tablet
        lg: '2rem',         // 32px desktop and above
      },
      screens: {
        sm: '720px',        // 640px + 2*24px padding = 688px content
        md: '960px',        // 768px + 2*32px padding = 832px content
        lg: '1200px',       // 1024px + 2*32px padding = 1088px content
        xl: '1200px',       // max 1200px
        '2xl': '1200px',
      },
    },
    extend: {
      // Responsive spacing scale for grid gaps
      // Requirements: 1.6 from responsive-intelligent-navigation/requirements.md
      spacing: {
        'grid-gap-mobile': '1rem',      // 16px
        'grid-gap-tablet': '1.5rem',    // 24px
        'grid-gap-desktop': '2rem',     // 32px
      },
      // Responsive font sizes with fluid scaling using clamp()
      // Requirements: 2.1, 2.2, 2.3, 2.6, 2.7 from responsive-intelligent-navigation/requirements.md
      fontSize: {
        // Base font sizes with fluid scaling
        'base': ['clamp(0.875rem, 0.8rem + 0.3125vw, 1rem)', { lineHeight: '1.5' }],  // 14px -> 16px
        'base-mobile': ['0.875rem', { lineHeight: '1.5' }],  // 14px
        'base-desktop': ['1rem', { lineHeight: '1.5' }],     // 16px
        
        // Heading scale with fluid sizing using clamp()
        // Maintains hierarchy: h1 > h2 > h3 > h4 > h5 > h6
        // Line height: 1.2 for all headings
        // Letter spacing: -0.02em (mobile) to -0.03em (desktop)
        'h1': ['clamp(2rem, 1.5rem + 2vw, 3rem)', { lineHeight: '1.2', letterSpacing: 'clamp(-0.03em, -0.025em, -0.02em)', fontWeight: '700' }],      // 32px -> 48px
        'h2': ['clamp(1.5rem, 1.25rem + 1vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: 'clamp(-0.03em, -0.025em, -0.02em)', fontWeight: '700' }],  // 24px -> 36px
        'h3': ['clamp(1.25rem, 1.125rem + 0.5vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: 'clamp(-0.03em, -0.025em, -0.02em)', fontWeight: '600' }],  // 20px -> 28px
        'h4': ['clamp(1.125rem, 1.0625rem + 0.25vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: 'clamp(-0.03em, -0.025em, -0.02em)', fontWeight: '600' }],  // 18px -> 24px
        'h5': ['clamp(1rem, 0.9375rem + 0.25vw, 1.25rem)', { lineHeight: '1.2', letterSpacing: 'clamp(-0.03em, -0.025em, -0.02em)', fontWeight: '600' }],  // 16px -> 20px
        'h6': ['clamp(0.875rem, 0.875rem + 0.125vw, 1rem)', { lineHeight: '1.2', letterSpacing: 'clamp(-0.03em, -0.025em, -0.02em)', fontWeight: '600' }],  // 14px -> 16px
        
        // Legacy heading scale - mobile (for backwards compatibility)
        'h1-mobile': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],      // 32px
        'h2-mobile': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],    // 24px
        'h3-mobile': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],   // 20px
        'h4-mobile': ['1.125rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],  // 18px
        'h5-mobile': ['1rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],      // 16px
        'h6-mobile': ['0.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],  // 14px
        
        // Legacy heading scale - desktop (for backwards compatibility)
        'h1-desktop': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],     // 48px
        'h2-desktop': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],  // 36px
        'h3-desktop': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],  // 28px
        'h4-desktop': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],   // 24px
        'h5-desktop': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],  // 20px
        'h6-desktop': ['1rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],     // 16px
        
        // Minimum text size enforcement (14px minimum)
        // Requirements: 2.5 from responsive-intelligent-navigation/requirements.md
        'sm': ['max(0.875rem, 14px)', { lineHeight: '1.5' }],
        'xs': ['max(0.75rem, 14px)', { lineHeight: '1.5' }],
      },
      // Grid column configurations
      // Requirements: 17.1, 17.2, 17.3, 17.4, 17.5 from responsive-intelligent-navigation/requirements.md
      gridTemplateColumns: {
        'mobile': 'repeat(4, minmax(0, 1fr))',
        'tablet': 'repeat(8, minmax(0, 1fr))',
        'desktop': 'repeat(12, minmax(0, 1fr))',
      },
      // Responsive grid column spanning utilities
      // Enables precise control over column spans at each breakpoint
      gridColumn: {
        // Mobile (4 columns)
        'span-1-mobile': 'span 1 / span 1',
        'span-2-mobile': 'span 2 / span 2',
        'span-3-mobile': 'span 3 / span 3',
        'span-4-mobile': 'span 4 / span 4',
        // Tablet (8 columns)
        'span-1-tablet': 'span 1 / span 1',
        'span-2-tablet': 'span 2 / span 2',
        'span-3-tablet': 'span 3 / span 3',
        'span-4-tablet': 'span 4 / span 4',
        'span-5-tablet': 'span 5 / span 5',
        'span-6-tablet': 'span 6 / span 6',
        'span-7-tablet': 'span 7 / span 7',
        'span-8-tablet': 'span 8 / span 8',
        // Desktop (12 columns)
        'span-1-desktop': 'span 1 / span 1',
        'span-2-desktop': 'span 2 / span 2',
        'span-3-desktop': 'span 3 / span 3',
        'span-4-desktop': 'span 4 / span 4',
        'span-5-desktop': 'span 5 / span 5',
        'span-6-desktop': 'span 6 / span 6',
        'span-7-desktop': 'span 7 / span 7',
        'span-8-desktop': 'span 8 / span 8',
        'span-9-desktop': 'span 9 / span 9',
        'span-10-desktop': 'span 10 / span 10',
        'span-11-desktop': 'span 11 / span 11',
        'span-12-desktop': 'span 12 / span 12',
      },
      // Responsive gap utilities for consistent spacing
      // Requirements: 1.6, 17.4 from responsive-intelligent-navigation/requirements.md
      gap: {
        'grid-mobile': '1rem',      // 16px
        'grid-tablet': '1.5rem',    // 24px
        'grid-desktop': '2rem',     // 32px
      },
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
          DEFAULT: '#F5E6D3',
          dark: '#E8D5B7',
          light: '#FAF3E8',
        },
        light: '#E9EBE5',
        support: '#80996F',
        neutral: '#B0BCA4',
        
        // Dark mode specific colors - Catalog Dark Premium Redesign
        'dark-bg': {
          primary: '#0A1410',      // Charcoal très foncé
          secondary: '#1A2820',    // Dark green charcoal
          tertiary: '#141D18',     // Variation pour cards
        },
        'dark-text': {
          primary: '#E8F5E9',      // Ivory/light green
          secondary: '#B0D4B8',    // Muted light green
          muted: '#80996F',        // Support green
        },
        'dark-border': {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',  // Subtle border
          hover: 'rgba(255, 255, 255, 0.2)',    // Hover state
        },
        
        // Dark mode brand color variants
        'dark-primary': '#4A9A62',   // Dark green (CTAs)
        'dark-secondary': '#4A9A62', // Using same as primary for better contrast
        'dark-accent': '#A89858',    // Gold (hover, links)
        'dark-sand': '#5A7268',      // Further lightened for 3:1 contrast
        'dark-support': '#9AB08A',   // Support color
        
        // Partner section specific colors
        // These colors are used exclusively in the SCPB Partner Section component
        // to maintain consistent typography and visual hierarchy.
        // - primary: Main heading and value text (#EDEDED)
        // - secondary: Body text, subtitles, and labels (rgba(237, 237, 237, 0.72))
        // Requirements: 6.1, 6.2 from .kiro/specs/scpb-partner-section/requirements.md
        'partner-text': {
          primary: '#EDEDED',
          secondary: 'rgba(237, 237, 237, 0.72)',
        },
        
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
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
