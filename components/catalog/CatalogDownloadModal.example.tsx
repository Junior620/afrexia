/**
 * CatalogDownloadModal Example Usage
 * 
 * This file demonstrates how to use the CatalogDownloadModal component
 * in the product catalog page.
 */

'use client';

import React, { useState } from 'react';
import { CatalogDownloadModal, LeadData } from './CatalogDownloadModal';

export default function CatalogDownloadModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  // Example translations (English)
  const translations = {
    title: 'Download Our Catalog',
    subtitle: 'Receive our complete PDF catalog with all our products and specifications',
    close: 'Close',
    fields: {
      name: 'Full Name',
      namePlaceholder: 'John Smith',
      email: 'Business Email',
      emailPlaceholder: 'john.smith@company.com',
      company: 'Company',
      companyPlaceholder: 'Your company name',
      country: 'Country',
      countryPlaceholder: 'Select a country',
    },
    privacyMessage: 'Your data is protected and will never be shared with third parties',
    download: 'Download Catalog',
    downloading: 'Downloading...',
    success: 'Catalog Downloaded Successfully',
    error: 'Error Downloading Catalog',
  };

  // Example submit handler
  const handleSubmit = async (data: LeadData): Promise<string> => {
    console.log('Lead data submitted:', data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real implementation, this would:
    // 1. Send lead data to your CRM or database
    // 2. Track the download event in analytics
    // 3. Return the actual PDF download URL from your API

    // For demo purposes, return a placeholder URL
    return '/path/to/catalog.pdf';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">CatalogDownloadModal Example</h1>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Download PDF Catalog
      </button>

      {/* Modal */}
      <CatalogDownloadModal
        locale="en"
        translations={translations}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Usage Instructions</h2>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">1. Import the component:</h3>
            <pre className="bg-white p-3 rounded border overflow-x-auto">
              <code>{`import { CatalogDownloadModal } from '@/components/catalog';`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Manage modal state:</h3>
            <pre className="bg-white p-3 rounded border overflow-x-auto">
              <code>{`const [isOpen, setIsOpen] = useState(false);`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Implement submit handler:</h3>
            <pre className="bg-white p-3 rounded border overflow-x-auto">
              <code>{`const handleSubmit = async (data: LeadData) => {
  // Send to API
  const response = await fetch('/api/catalog-download', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  const { downloadUrl } = await response.json();
  return downloadUrl;
};`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Render the modal:</h3>
            <pre className="bg-white p-3 rounded border overflow-x-auto">
              <code>{`<CatalogDownloadModal
  locale="en"
  translations={translations}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
/>`}</code>
            </pre>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
            <li>Lead capture form with validation</li>
            <li>Required fields: name, email, company, country</li>
            <li>Email format validation</li>
            <li>Searchable country dropdown</li>
            <li>Privacy message display</li>
            <li>Loading state during submission</li>
            <li>Success/error feedback</li>
            <li>Automatic download trigger</li>
            <li>Focus trap and keyboard navigation</li>
            <li>ESC key and overlay click to close</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
