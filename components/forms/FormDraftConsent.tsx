/**
 * Form Draft Consent Component
 * 
 * Displays opt-in UI for form draft saving with:
 * - Clear consent request
 * - Draft status indicator
 * - Time remaining display
 * - Revoke option
 * 
 * Requirements: 14.1, 14.2
 */

'use client';

import { Save, Clock, X } from 'lucide-react';

interface FormDraftConsentProps {
  hasConsent: boolean;
  hasDraft: boolean;
  draftTimeRemaining: string | null;
  onGrantConsent: () => void;
  onRevokeConsent: () => void;
  locale?: string;
}

export function FormDraftConsent({
  hasConsent,
  hasDraft,
  draftTimeRemaining,
  onGrantConsent,
  onRevokeConsent,
  locale = 'en',
}: FormDraftConsentProps) {
  const content = {
    fr: {
      consentTitle: 'Sauvegarder votre brouillon ?',
      consentMessage: 'Nous pouvons sauvegarder votre progression (hors données personnelles) pendant 30 minutes.',
      consentButton: 'Activer la sauvegarde automatique',
      draftSaved: 'Brouillon sauvegardé',
      expiresIn: 'Expire dans',
      revokeButton: 'Désactiver',
      privacyNote: 'Vos données personnelles (nom, email, téléphone) ne sont jamais sauvegardées.',
    },
    en: {
      consentTitle: 'Save your draft?',
      consentMessage: 'We can save your progress (excluding personal data) for 30 minutes.',
      consentButton: 'Enable auto-save',
      draftSaved: 'Draft saved',
      expiresIn: 'Expires in',
      revokeButton: 'Disable',
      privacyNote: 'Your personal data (name, email, phone) is never saved.',
    },
  };

  const t = content[locale as keyof typeof content] || content.en;

  // Show consent request if no consent granted
  if (!hasConsent) {
    return (
      <div className="rounded-lg border border-[rgba(74,154,98,0.3)] bg-[#0F1814]/50 p-4">
        <div className="flex items-start gap-3">
          <Save className="w-5 h-5 text-[#4A9A62] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#E8F5E9] mb-1">
              {t.consentTitle}
            </h4>
            <p className="text-sm text-[#C5D9C0] mb-3">
              {t.consentMessage}
            </p>
            <button
              type="button"
              onClick={onGrantConsent}
              className="text-sm font-medium text-[#4A9A62] hover:text-[#3d8251] underline"
            >
              {t.consentButton}
            </button>
            <p className="text-xs text-[#80996F] mt-2">
              {t.privacyNote}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show draft status if consent granted
  return (
    <div className="rounded-lg border border-[rgba(74,154,98,0.2)] bg-[#0F1814]/30 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasDraft ? (
            <>
              <Save className="w-4 h-4 text-[#4A9A62]" />
              <span className="text-sm text-[#C5D9C0]">
                {t.draftSaved}
              </span>
              {draftTimeRemaining && (
                <>
                  <Clock className="w-4 h-4 text-[#80996F] ml-2" />
                  <span className="text-xs text-[#80996F]">
                    {t.expiresIn} {draftTimeRemaining}
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#80996F]" />
              <span className="text-sm text-[#80996F]">
                {locale === 'fr' ? 'Sauvegarde automatique activée' : 'Auto-save enabled'}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onRevokeConsent}
          className="flex items-center gap-1 text-xs text-[#80996F] hover:text-[#C5D9C0] transition-colors"
          title={t.revokeButton}
        >
          <X className="w-3 h-3" />
          <span>{t.revokeButton}</span>
        </button>
      </div>
    </div>
  );
}
