/**
 * Example: Form State Preservation with Consent
 * 
 * This example shows how to integrate form state preservation
 * with consent into a React form using react-hook-form.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useFormStatePreservation } from '@/hooks/useFormStatePreservation';
import { FormDraftConsent } from '@/components/forms/FormDraftConsent';

interface ExampleFormData {
  // PII fields (will be filtered out automatically)
  name: string;
  email: string;
  phone: string;
  
  // Non-PII fields (will be preserved)
  subject: string;
  message: string;
  product: string;
  volume: string;
  destination: string;
}

export function ExampleFormWithDraftSaving() {
  const locale = 'fr'; // or 'en'
  
  // Initialize form state preservation
  const {
    hasConsent,
    grantConsent,
    revokeConsent,
    hasDraft,
    draftTimeRemaining,
    loadDraft,
    clearDraft,
  } = useFormStatePreservation<ExampleFormData>({
    formId: 'example-form',
    locale,
  });

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExampleFormData>();

  // Load draft on mount if consent is granted
  useEffect(() => {
    if (hasConsent) {
      const draft = loadDraft();
      if (draft) {
        // Restore non-PII fields from draft
        Object.entries(draft).forEach(([key, value]) => {
          if (value !== undefined) {
            setValue(key as keyof ExampleFormData, value);
          }
        });
      }
    }
  }, [hasConsent, loadDraft, setValue]);

  // Auto-save draft when form changes (if consent granted)
  useEffect(() => {
    if (!hasConsent) return;

    const subscription = watch((formData) => {
      // The service automatically filters PII fields
      // We can pass all data and it handles the filtering
      // Only non-PII fields will be saved
    });

    return () => subscription.unsubscribe();
  }, [watch, hasConsent]);

  // Handle form submission
  const onSubmit = async (data: ExampleFormData) => {
    try {
      // Submit form data
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      // Clear draft on successful submit (Requirement 14.5)
      clearDraft();

      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Your draft is still saved.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Draft Consent Component */}
      <FormDraftConsent
        hasConsent={hasConsent}
        hasDraft={hasDraft}
        draftTimeRemaining={draftTimeRemaining}
        onGrantConsent={grantConsent}
        onRevokeConsent={revokeConsent}
        locale={locale}
      />

      {/* PII Fields - Will NOT be saved in draft */}
      <div>
        <label>Name (PII - not saved)</label>
        <input type="text" {...register('name')} />
      </div>

      <div>
        <label>Email (PII - not saved)</label>
        <input type="email" {...register('email')} />
      </div>

      <div>
        <label>Phone (PII - not saved)</label>
        <input type="tel" {...register('phone')} />
      </div>

      {/* Non-PII Fields - WILL be saved in draft */}
      <div>
        <label>Subject (saved in draft)</label>
        <input type="text" {...register('subject')} />
      </div>

      <div>
        <label>Message (saved in draft)</label>
        <textarea {...register('message')} rows={4} />
      </div>

      <div>
        <label>Product (saved in draft)</label>
        <input type="text" {...register('product')} />
      </div>

      <div>
        <label>Volume (saved in draft)</label>
        <input type="text" {...register('volume')} />
      </div>

      <div>
        <label>Destination (saved in draft)</label>
        <input type="text" {...register('destination')} />
      </div>

      <button type="submit">
        Submit Form
      </button>
    </form>
  );
}
