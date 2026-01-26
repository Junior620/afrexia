# Afrexia Website

Premium B2B website for Afrexia - Leading exporter of African agricultural commodities.

## Tech Stack

- **Framework**: Next.js 15+ (App Router, React Server Components)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+ with shadcn/ui
- **CMS**: Sanity.io
- **Animations**: GSAP, Framer Motion, Lenis
- **Maps**: Mapbox GL JS
- **Forms**: React Hook Form + Zod
- **Email**: Resend + React Email
- **Analytics**: Plausible, Google Analytics 4, Vercel Analytics
- **Monitoring**: Sentry
- **Testing**: Vitest, fast-check, Playwright, jest-axe

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Sanity account and project
- Resend account for email
- Mapbox account for maps
- reCAPTCHA v3 keys

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

**Code Quality:**
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

**Testing:**
- `npm run test` - Run unit tests in watch mode
- `npm run test:run` - Run unit tests once
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:pbt` - Run property-based tests
- `npm run test:all` - Run all tests
- `npm run test:kv` - Test Vercel KV connection

**Analysis:**
- `npm run analyze` - Analyze bundle size
- `npm run lighthouse` - Run Lighthouse CI

## Project Structure

```
afrexia-website/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── sanity/           # Sanity client and queries
│   ├── i18n/             # Internationalization
│   └── ...
├── sanity/                # Sanity CMS configuration
├── public/                # Static assets
└── tests/                 # Test files
```

## Environment Variables

See `.env.example` for all required environment variables.

For production deployment, see `.env.production.template` and the [Deployment Guide](docs/DEPLOYMENT.md).

## Deployment

This project is configured for deployment on Vercel. See the comprehensive [Deployment Guide](docs/DEPLOYMENT.md) for:

- Environment setup
- Custom domain configuration
- Vercel KV setup for rate limiting
- Sanity webhook configuration
- Monitoring and analytics setup
- Production checklist

### Quick Deploy

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

For detailed instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - Complete deployment instructions
- [Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md) - Pre-launch checklist
- [CMS Documentation](docs/cms/README.md) - Content management guide

## License

Proprietary - Afrexia
