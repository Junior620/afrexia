import { render, screen } from '@testing-library/react';
import { ProcessComplianceSection } from '../ProcessComplianceSection';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock ScrollReveal to avoid GSAP issues in tests
vi.mock('@/components/animations/ScrollReveal', () => ({
  ScrollReveal: ({ children }: any) => <div>{children}</div>,
}));

describe('ProcessComplianceSection', () => {
  it('renders with French locale', () => {
    render(<ProcessComplianceSection locale="fr" />);
    
    expect(screen.getByText('Processus & Conformité')).toBeInTheDocument();
    expect(screen.getByText('Normes de Qualité')).toBeInTheDocument();
    expect(screen.getByText('Processus de Traçabilité')).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
  });

  it('renders with English locale', () => {
    render(<ProcessComplianceSection locale="en" />);
    
    expect(screen.getByText('Process & Compliance')).toBeInTheDocument();
    expect(screen.getByText('Quality Standards')).toBeInTheDocument();
    expect(screen.getByText('Traceability Process')).toBeInTheDocument();
    expect(screen.getByText('Certifications')).toBeInTheDocument();
  });

  it('renders all three sections', () => {
    const { container } = render(<ProcessComplianceSection locale="en" />);
    
    // Should have 3 sections in the grid
    const sections = container.querySelectorAll('.grid > div');
    expect(sections).toHaveLength(3);
  });

  it('renders quality standards items', () => {
    render(<ProcessComplianceSection locale="en" />);
    
    expect(screen.getByText(/Grading per ISO, USDA, ICO standards/i)).toBeInTheDocument();
    expect(screen.getByText(/Accredited laboratory testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Independent pre-shipment inspection/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete documentation and traceability/i)).toBeInTheDocument();
  });

  it('renders traceability process items', () => {
    render(<ProcessComplianceSection locale="en" />);
    
    expect(screen.getByText(/GPS geolocation of plots/i)).toBeInTheDocument();
    expect(screen.getByText(/Documented chain of custody/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuous satellite monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/Blockchain digital system/i)).toBeInTheDocument();
  });

  it('renders certifications items', () => {
    render(<ProcessComplianceSection locale="en" />);
    
    expect(screen.getByText(/EUDR Ready - Full compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/Organic & Fair Trade certified/i)).toBeInTheDocument();
    expect(screen.getByText(/Rainforest Alliance/i)).toBeInTheDocument();
    expect(screen.getByText(/ISO 9001 & ISO 22000/i)).toBeInTheDocument();
  });

  it('renders with Spanish locale', () => {
    render(<ProcessComplianceSection locale="es" />);
    
    expect(screen.getByText('Proceso y Conformidad')).toBeInTheDocument();
    expect(screen.getByText('Normas de Calidad')).toBeInTheDocument();
  });

  it('renders with German locale', () => {
    render(<ProcessComplianceSection locale="de" />);
    
    expect(screen.getByText('Prozess & Konformität')).toBeInTheDocument();
    expect(screen.getByText('Qualitätsstandards')).toBeInTheDocument();
  });

  it('renders with Russian locale', () => {
    render(<ProcessComplianceSection locale="ru" />);
    
    expect(screen.getByText('Процесс и Соответствие')).toBeInTheDocument();
    expect(screen.getByText('Стандарты Качества')).toBeInTheDocument();
  });

  it('falls back to English for unsupported locale', () => {
    // @ts-expect-error Testing fallback behavior
    render(<ProcessComplianceSection locale="unsupported" />);
    
    expect(screen.getByText('Process & Compliance')).toBeInTheDocument();
  });
});
