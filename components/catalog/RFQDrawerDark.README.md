# RFQDrawerDark Component

Dark premium drawer component for submitting quote requests with pre-filled product information.

## Features

- **Dark Premium Design**: Consistent with catalog dark theme using glass effects and dark green/gold accents
- **Responsive Layout**: 480px width on desktop, full width on mobile
- **Slide Animation**: Smooth slide-in from right with backdrop overlay
- **Pre-filled Product**: Product information is read-only and pre-populated
- **Form Validation**: Real-time validation with clear error messages
- **Trust Elements**: Displays "24h response" and "NDA available" reassurance
- **Loading States**: Visual feedback during form submission
- **Success/Error Handling**: Clear messaging for submission outcomes
- **Analytics Tracking**: Automatic event tracking for RFQ submissions
- **Accessibility**: WCAG AA compliant with keyboard navigation and ARIA labels

## Requirements

Implements requirements from catalog-dark-premium-redesign spec:
- **5.1-5.9**: RFQ workflow enhancement
- **8.3, 8.5**: Analytics tracking

## Usage

```tsx
import { RFQDrawerDark } from '@/components/catalog/RFQDrawerDark';
import { Product } from '@/types/product';

function ProductCatalog() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleQuoteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (data: RFQFormData) => {
    const response = await fetch('/api/rfq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit RFQ');
    }
  };

  return (
    <>
      <button onClick={() => handleQuoteClick(product)}>
        Request Quote
      </button>

      {selectedProduct && (
        <RFQDrawerDark
          product={selectedProduct}
          locale="en"
          translations={translations}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
