Form State Preservation with Consent

This module implements opt-in form draft saving with:
- User consent requirement
- 30-minute expiration
- Automatic PII exclusion
- Clear on successful submit

Requirements: 14.1, 14.2, 14.3, 14.4, 14.5

Usage Example:

import { useFormStatePreservation } from '@/hooks/useFormStatePreservation';
import { FormDraftConsent } from '@/components/forms/FormDraftConsent';

function MyForm() {
  const {
    hasConsent,
    grantConsent,
    revokeConsent,
    hasDraft,
    draftTimeRemaining,
    loadDraft,
    clearDraft,
  } = useFormStatePreservation({
    formId: 'my-form',
    locale: 'fr'
  });

  // Load draft on mount
  useEffect(() => {
    if (hasConsent) {
      const draft = loadDraft();
      if (draft) {
        // Restore form values
      }
    }
  }, [hasConsent]);

  // Clear draft on successful submit
  const onSubmit = async (data) => {
    // ... submit logic
    clearDraft(); // Clear after success
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormDraftConsent
        hasConsent={hasConsent}
        hasDraft={hasDraft}
        draftTimeRemaining={draftTimeRemaining}
        onGrantConsent={grantConsent}
        onRevokeConsent={revokeConsent}
        locale={locale}
      />
      {/* form fields */}
    </form>
  );
}

PII Fields Automatically Filtered:
- name, firstName, lastName, fullName
- email, contactEmail
- phone, phoneNumber, tel
- password, confirmPassword
- creditCard, cardNumber, cvv
- ssn, passport, license, nationalId
- Any field matching these patterns (case-insensitive)

Features:
- Consent stored in sessionStorage (cleared on tab close)
- Drafts expire after 30 minutes
- PII fields automatically excluded
- Clear draft on successful form submission
- Visual indicator showing draft status and time remaining
- Supports multiple forms with separate consent/drafts
