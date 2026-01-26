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

interface RFQConfirmationEmailProps {
  formData: RFQFormData;
  locale: Locale;
}

/**
 * Confirmation email template for customers after RFQ submission
 * Requirements: 19.1, 19.3, 19.5
 */
export function RFQConfirmationEmail({
  formData,
  locale,
}: RFQConfirmationEmailProps) {
  const isEnglish = locale === 'en';

  return (
    <Html>
      <Head />
      <Preview>
        {isEnglish
          ? 'Your quote request has been received'
          : 'Votre demande de devis a été reçue'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Afrexia</Heading>
          </Section>

          {/* Main Content */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish
                ? `Dear ${formData.firstName} ${formData.lastName},`
                : `Cher(e) ${formData.firstName} ${formData.lastName},`}
            </Heading>
            <Text style={text}>
              {isEnglish
                ? 'Thank you for your interest in Afrexia. We have received your quote request and our team will review it shortly.'
                : "Merci de votre intérêt pour Afrexia. Nous avons bien reçu votre demande de devis et notre équipe l'examinera sous peu."}
            </Text>
            <Text style={text}>
              {isEnglish
                ? 'We will contact you within 24-48 hours with a customized quote based on your requirements.'
                : 'Nous vous contacterons dans les 24 à 48 heures avec un devis personnalisé basé sur vos besoins.'}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Request Summary */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish ? 'Request Summary' : 'Résumé de la Demande'}
            </Heading>
            <Text style={text}>
              <strong>{isEnglish ? 'Product:' : 'Produit:'}</strong>{' '}
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
                {isEnglish ? 'Destination:' : 'Destination:'}
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

          <Hr style={hr} />

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish ? 'Need Help?' : "Besoin d'Aide?"}
            </Heading>
            <Text style={text}>
              {isEnglish
                ? 'If you have any questions or need to modify your request, please contact us:'
                : 'Si vous avez des questions ou souhaitez modifier votre demande, contactez-nous:'}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> sales@afrexia.com
            </Text>
            <Text style={text}>
              <strong>{isEnglish ? 'Phone:' : 'Téléphone:'}</strong> +237 XXX
              XXX XXX
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {isEnglish
                ? 'Your trusted partner for African agricultural commodities'
                : 'Votre partenaire de confiance pour les commodités agricoles africaines'}
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Afrexia.{' '}
              {isEnglish ? 'All rights reserved.' : 'Tous droits réservés.'}
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
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: EMAIL_COLORS.headerText,
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
  letterSpacing: '1px',
};

const section = {
  padding: '24px',
};

const h2 = {
  color: EMAIL_COLORS.footerText,
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const h3 = {
  color: EMAIL_COLORS.footerText,
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const text = {
  color: EMAIL_COLORS.bodyText,
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const hr = {
  borderColor: EMAIL_COLORS.border,
  margin: '0',
};

const footer = {
  padding: '24px',
  backgroundColor: EMAIL_COLORS.footer,
  textAlign: 'center' as const,
};

const footerText = {
  color: EMAIL_COLORS.footerText,
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 0 8px',
};
