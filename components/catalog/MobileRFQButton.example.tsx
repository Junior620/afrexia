'use client';

import React, { useState } from 'react';
import { MobileRFQButton } from './MobileRFQButton';
import { RFQDrawer } from './RFQDrawer';
import { Product } from '@/types/product';

/**
 * Example usage of MobileRFQButton with RFQDrawer
 * 
 * This example demonstrates:
 * 1. Managing RFQ cart state
 * 2. Opening/closing the RFQ drawer from mobile button
 * 3. Displaying cart count badge
 * 4. Handling product selection and removal
 */
export default function MobileRFQButtonExample() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Example product data
  const exampleProduct: Product = {
    id: '1',
    slug: 'premium-cocoa',
    name: 'Premium Cocoa Beans',
    subtitle: 'Single Origin - Côte d\'Ivoire',
    category: 'cocoa',
    heroImage: {
      asset: {
        _ref: 'image-abc123',
        _type: 'reference',
      },
    },
    availability: 'in-stock',
    origins: ['Côte d\'Ivoire'],
    certifications: ['EUDR', 'Organic', 'Fair Trade'],
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
    grade: 'Grade I',
    leadTime: '4-6 weeks',
    tags: ['premium', 'single-origin', 'sustainable'],
    markets: ['Europe', 'North America'],
    updatedAt: '2024-01-15',
  };

  // Translations
  const mobileButtonTranslations = {
    requestQuote: 'Request Quote',
    itemsInCart: 'items in cart',
  };

  const drawerTranslations = {
    title: 'Request a Quote',
    close: 'Close',
    selectedProducts: 'Selected Products',
    addMore: 'Add More Products',
    removeProduct: 'Remove',
    contactInfo: 'Contact Information',
    orderDetails: 'Order Details',
    additionalNotes: 'Additional Notes',
    fields: {
      name: 'Full Name',
      namePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: 'john@company.com',
      company: 'Company',
      companyPlaceholder: 'Your Company Ltd',
      phone: 'Phone',
      phonePlaceholder: '+1 234 567 8900',
      quantity: 'Quantity',
      quantityPlaceholder: '500',
      unit: 'kg',
      deliveryLocation: 'Delivery Location',
      deliveryLocationPlaceholder: 'Port of Rotterdam, Netherlands',
      incoterm: 'Incoterm',
      incotermPlaceholder: 'Select incoterm',
      notes: 'Notes',
      notesPlaceholder: 'Any specific requirements or questions...',
    },
    trustElements: {
      response24h: '24h response time',
      ndaAvailable: 'NDA available on request',
      secureData: 'Your data is secure',
    },
    submit: 'Send Request',
    submitting: 'Sending...',
    success: 'Success!',
    successMessage: 'Your quote request has been sent. We\'ll respond within 24 hours.',
    error: 'Error',
    errorMessage: 'Failed to send request. Please try again.',
    emptyCart: 'No products selected',
    emptyCartMessage: 'Add products to your cart to request a quote.',
  };

  // Add product to cart
  const handleAddProduct = () => {
    if (!selectedProducts.find(p => p.id === exampleProduct.id)) {
      setSelectedProducts([...selectedProducts, exampleProduct]);
    }
  };

  // Remove product from cart
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Handle RFQ submission
  const handleSubmit = async (data: any) => {
    console.log('RFQ submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Clear cart after successful submission
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mobile RFQ Button Example</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Product Catalog</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to add a product to your RFQ cart. 
            The mobile sticky button will appear at the bottom of the screen on mobile devices.
          </p>
          
          <button
            onClick={handleAddProduct}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Add Product to Cart
          </button>

          {selectedProducts.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">
                {selectedProducts.length} product(s) in cart
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Sticky bottom bar visible only on mobile (< 768px)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Cart count badge shows number of selected products</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Opens RFQ drawer when clicked</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Minimum 44x44px touch target for accessibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Smooth animations and transitions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>iOS safe area support</span>
            </li>
          </ul>
        </div>

        {/* Add some spacing at bottom for mobile button */}
        <div className="h-24 md:h-0" />
      </div>

      {/* Mobile RFQ Button - Only visible on mobile */}
      <MobileRFQButton
        cartCount={selectedProducts.length}
        onClick={() => setIsDrawerOpen(true)}
        translations={mobileButtonTranslations}
      />

      {/* RFQ Drawer */}
      <RFQDrawer
        selectedProducts={selectedProducts}
        locale="en"
        translations={drawerTranslations}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        onRemoveProduct={handleRemoveProduct}
      />
    </div>
  );
}
