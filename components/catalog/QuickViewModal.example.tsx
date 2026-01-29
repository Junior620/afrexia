/**
 * QuickViewModal Example Usage
 * 
 * This file demonstrates how to use the QuickViewModal component
 * in the product catalog page.
 */

'use client';

import React, { useState } from 'react';
import { QuickViewModal } from './QuickViewModal';
import { Product } from '@/types/product';

// Example product data
const exampleProduct: Product = {
  id: '1',
  slug: 'premium-cocoa-beans',
  name: 'Premium Cocoa Beans',
  subtitle: 'Single-origin cocoa from Côte d\'Ivoire',
  category: 'Cocoa',
  heroImage: {
    asset: {
      _ref: 'image-abc123-1200x800-jpg',
      _type: 'reference',
    },
  },
  availability: 'in-stock',
  origins: ['Côte d\'Ivoire', 'Ghana'],
  certifications: ['organic', 'fairtrade', 'rainforest'],
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
  packaging: 'Jute bags 60kg',
  grade: 'Grade I Premium',
  leadTime: '4-6 weeks',
  notes: 'Sourced from certified farms with full traceability. Available for immediate shipment.',
  tags: ['premium', 'single-origin', 'certified'],
  markets: ['EU', 'US', 'Asia'],
  updatedAt: '2024-01-15T10:00:00Z',
};

// Example translations
const exampleTranslations = {
  title: 'Quick View',
  close: 'Close',
  specifications: 'Specifications',
  certifications: 'Certifications',
  documents: 'Available Documents',
  requestQuote: 'Request a Quote',
  viewFullPage: 'View Full Product Page',
  availability: 'Availability',
  category: 'Category',
  origins: 'Origins',
  moq: 'Minimum Order Quantity',
  incoterms: 'Available Incoterms',
  packaging: 'Packaging',
  grade: 'Grade',
  leadTime: 'Lead Time',
  notes: 'Additional Notes',
  documentsLabels: {
    coa: 'Certificate of Analysis (COA)',
    specSheet: 'Technical Specification Sheet',
    chainOfCustody: 'Chain of Custody Documentation',
  },
  availabilityLabels: {
    inStock: 'In Stock',
    limited: 'Limited Stock',
    preOrder: 'Pre-order',
  },
};

/**
 * Example component showing QuickViewModal usage
 */
export function QuickViewModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleQuoteClick = () => {
    console.log('Quote button clicked for product:', exampleProduct.id);
    // In real implementation, this would open the RFQ drawer
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">QuickViewModal Example</h1>
      
      <button
        onClick={handleOpen}
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        Open Quick View Modal
      </button>

      <QuickViewModal
        product={exampleProduct}
        locale="en"
        translations={exampleTranslations}
        isOpen={isOpen}
        onClose={handleClose}
        onQuoteClick={handleQuoteClick}
      />

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-bold mb-2">Features Demonstrated:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Modal overlay with backdrop blur</li>
          <li>Product image, name, category, and availability</li>
          <li>Comprehensive specifications grid</li>
          <li>Certifications badges</li>
          <li>Available documents list</li>
          <li>Quote CTA and product page link</li>
          <li>Close button (top-right)</li>
          <li>ESC key support (press ESC to close)</li>
          <li>Overlay click to close</li>
          <li>Focus trap (Tab navigation stays within modal)</li>
          <li>Focus return to trigger element on close</li>
          <li>Body scroll lock when open</li>
          <li>Responsive design (mobile and desktop)</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold mb-2">Accessibility Features:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><code>role="dialog"</code> and <code>aria-modal="true"</code></li>
          <li><code>aria-labelledby</code> pointing to modal title</li>
          <li>Focus trap using <code>useFocusTrap</code> hook</li>
          <li>Focus returns to trigger element on close</li>
          <li>ESC key closes modal</li>
          <li>Overlay click closes modal</li>
          <li>All interactive elements keyboard accessible</li>
          <li>Visible focus indicators</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h2 className="font-bold mb-2">Integration Example:</h2>
        <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
{`// In your ProductCard component
const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

<ProductCard
  product={product}
  onQuickView={() => setQuickViewProduct(product)}
  // ... other props
/>

<QuickViewModal
  product={quickViewProduct}
  isOpen={!!quickViewProduct}
  onClose={() => setQuickViewProduct(null)}
  onQuoteClick={() => {
    // Open RFQ drawer with this product
    setQuickViewProduct(null);
    openRFQDrawer(quickViewProduct);
  }}
  // ... other props
/>`}
        </pre>
      </div>
    </div>
  );
}
