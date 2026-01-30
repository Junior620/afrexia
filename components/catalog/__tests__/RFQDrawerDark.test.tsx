/**
 * RFQDrawerDark Component Tests
 * 
 * Tests for the dark premium RFQ drawer component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RFQDrawerDark } from '../RFQDrawerDark';
import { Product } from '@/types/product';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({
  trackRFQSubmission: vi.fn(),
}));

// Mock Sanity image URL helper
vi.mock('@/lib/sanity/image-url', () => ({
  getThumbnailImageUrl: vi.fn(() => '/test-image.jpg'),
}));

const mockProduct: Product = {
  id: 'test-product-1',
  slug: 'test-product',
  name: 'Cacao Premium Côte d\'Ivoire',
  subtitle: 'Fèves fermentées grade A',
  category: 'Cacao',
  heroImage: {
    asset: {
      _ref: 'image-abc123-800x600-jpg',
      _type: 'reference',
    },
  },
  availability: 'in-stock',
  origins: ['Côte d\'Ivoire'],
  certifications: ['organic', 'fairtrade'],
  eudrReady: true,
  qaAvailable: true,
  documents: {
    coa: true,
    specSheet: true,
    chainOfCustody: true,
  },
  moq: {
    value: 500,
    unit: 'kg',
  },
  incoterms: ['FOB', 'CIF', 'DAP'],
  tags: ['premium', 'organic'],
  markets: ['EU', 'US'],
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockTranslations = {
  title: 'Demander un devis',
  close: 'Fermer',
  productLabel: 'Produit sélectionné',
  fields: {
    quantity: 'Quantité',
    quantityPlaceholder: 'Entrez la quantité',
    incoterm: 'Incoterm',
    incotermPlaceholder: 'Sélectionner un incoterm',
    destination: 'Destination/Port',
    destinationPlaceholder: 'Ville, Pays',
    email: 'Email',
    emailPlaceholder: 'votre@email.com',
    company: 'Société',
    companyPlaceholder: 'Nom de votre société',
    notes: 'Notes additionnelles',
    notesPlaceholder: 'Informations complémentaires',
  },
  trustElements: {
    response24h: 'Réponse sous 24h',
    ndaAvailable: 'NDA disponible sur demande',
  },
  submit: 'Envoyer la demande',
  submitting: 'Envoi en cours...',
  success: 'Succès',
  successMessage: 'Demande envoyée avec succès !',
  error: 'Erreur',
  errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
};

describe('RFQDrawerDark', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Demander un devis')).toBeInTheDocument();
  });

  it('displays pre-filled product information', () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();
    expect(screen.getByText('Fèves fermentées grade A')).toBeInTheDocument();
    // MOQ appears twice in the drawer, so use getAllByText
    expect(screen.getAllByText(/MOQ: 500 kg/).length).toBeGreaterThan(0);
  });

  it('displays trust elements', () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Réponse sous 24h')).toBeInTheDocument();
    expect(screen.getByText('NDA disponible sur demande')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const closeButton = screen.getByLabelText('Fermer');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const { container } = render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const overlay = container.querySelector('.fixed.inset-0.bg-black\\/60');
    expect(overlay).toBeInTheDocument();
    
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('validates required fields before submission', async () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    // Should not call onSubmit with empty required fields
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Should show validation errors (check for the actual error message)
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in required fields
    const emailInput = screen.getByPlaceholderText('votre@email.com');
    const companyInput = screen.getByPlaceholderText('Nom de votre société');
    const destinationInput = screen.getByPlaceholderText('Ville, Pays');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(companyInput, { target: { value: 'Test Company' } });
    fireEvent.change(destinationInput, { target: { value: 'Paris, France' } });

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    // Check submitted data structure
    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.contact.email).toBe('test@example.com');
    expect(submittedData.contact.company).toBe('Test Company');
    expect(submittedData.delivery.location).toBe('Paris, France');
    expect(submittedData.products[0].id).toBe(mockProduct.id);
  });

  it('displays loading state during submission', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
      target: { value: 'Paris, France' },
    });

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Envoi en cours...')).toBeInTheDocument();
    });
  });

  it('displays success message after successful submission', async () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
      target: { value: 'Paris, France' },
    });

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Succès')).toBeInTheDocument();
      expect(screen.getByText('Demande envoyée avec succès !')).toBeInTheDocument();
    });
  });

  it('displays error message on submission failure', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
      target: { value: 'Paris, France' },
    });

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Une erreur est survenue. Veuillez réessayer.')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const emailInput = screen.getByPlaceholderText('votre@email.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    // Fill other required fields
    fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
      target: { value: 'Paris, France' },
    });

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates minimum quantity against MOQ', async () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const quantityInput = screen.getByLabelText(/Quantité/i);
    fireEvent.change(quantityInput, { target: { value: '100' } });
    fireEvent.blur(quantityInput);

    // Fill other required fields
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nom de votre société'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ville, Pays'), {
      target: { value: 'Paris, France' },
    });

    const submitButton = screen.getByText('Envoyer la demande');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Minimum 500 kg/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(
      <RFQDrawerDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'rfq-drawer-dark-title');

    // Check required field indicators
    const requiredFields = screen.getAllByText('*');
    expect(requiredFields.length).toBeGreaterThan(0);
  });
});
