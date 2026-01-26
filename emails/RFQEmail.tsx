import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Locale } from '@/types';
import { RFQFormData } from '@/lib/forms/rfq-schema';

interface RFQEmailProps {
  formData: RFQFormData;
  locale: Locale;
}

/**
 * Email template for sales team when RFQ is submitted
 * Requirements: 19.1, 19.3, 19.5
 */
export function RFQEmail({ formData, locale }: RFQEmailProps) {
  const isEnglish = locale === 'en';

  return (
    <Html>
      <Head />
      <Preview>
        {isEnglish
          ? `New RFQ from ${formData.firstName} ${formData.lastName}`
          : `Nouvelle demande de devis de ${formData.firstName} ${formData.lastName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              {isEnglish ? 'New Quote Request' : 'Nouvelle Demande de Devis'}
            </Heading>
          </Section>

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish ? 'Contact Information' : 'Informations de Contact'}
            </Heading>
            <Text style={text}>
              <strong>{isEnglish ? 'Name:' : 'Nom:'}</strong>{' '}
              {formData.firstName} {formData.lastName}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {formData.email}
            </Text>
            <Text style={text}>
              <strong>{isEnglish ? 'Phone:' : 'Téléphone:'}</strong>{' '}
              {formData.phone}
            </Text>
            <Text style={text}>
              <strong>{isEnglish ? 'Company:' : 'Entreprise:'}</strong>{' '}
              {formData.company}
            </Text>
            <Text style={text}>
              <strong>{isEnglish ? 'Country:' : 'Pays:'}</strong>{' '}
              {formData.country}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Order Details */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish ? 'Order Details' : 'Détails de la Commande'}
            </Heading>
            <Text style={text}>
              <strong>{isEnglish ? 'Product ID:' : 'ID Produit:'}</strong>{' '}
              {formData.productId}
            </Text>
            <Text style={text}>
              <strong>{isEnglish ? 'Quantity:' : 'Quantité:'}</strong>{' '}
              {formData.quantity} {formData.quantityUnit.toUpperCase()}
            </Text>
            <Text style={text}>
              <strong>Incoterm:</strong> {formData.incoterm}
            </Text>
            <Text style={text}>
              <strong>
                {isEnglish ? 'Destination Port:' : 'Port de Destination:'}
              </strong>{' '}
              {formData.destinationPort}
            </Text>
            <Text style={text}>
              <strong>
                {isEnglish ? 'Target Date:' : 'Date Souhaitée:'}
              </strong>{' '}
              {formData.targetDate}
            </Text>
          </Section>

          {formData.message && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>
                  {isEnglish
                    ? 'Additional Requirements'
                    : 'Exigences Supplémentaires'}
                </Heading>
                <Text style={text}>{formData.message}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {isEnglish
                ? 'This is an automated message from the Afrexia website RFQ form.'
                : 'Ceci est un message automatique du formulaire de demande de devis Afrexia.'}
            </Text>
            <Text style={footerText}>
              {isEnglish
                ? 'Please respond to the customer within 24 hours.'
                : 'Veuillez répondre au client dans les 24 heures.'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

import { EMAIL_COLORS } from '@/lib/brand/colors';

// Styles with Afrexia branding
const main = {
  backgroundColor: EMAIL_COLORS.muted,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: EMAIL_COLORS.body,
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: EMAIL_COLORS.header,
  padding: '24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: EMAIL_COLORS.headerText,
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const section = {
  padding: '24px',
};

const h2 = {
  color: EMAIL_COLORS.footerText,
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: EMAIL_COLORS.bodyText,
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const hr = {
  borderColor: EMAIL_COLORS.border,
  margin: '0',
};

const footer = {
  padding: '24px',
  backgroundColor: EMAIL_COLORS.muted,
};

const footerText = {
  color: EMAIL_COLORS.mutedText,
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px',
};
