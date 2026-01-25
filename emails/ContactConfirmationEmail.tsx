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
import { ContactFormData } from '@/lib/forms/contact-schema';

interface ContactConfirmationEmailProps {
  formData: ContactFormData;
  locale: Locale;
}

/**
 * Confirmation email template for customers after contact form submission
 * Requirements: 19.2, 19.5
 */
export function ContactConfirmationEmail({
  formData,
  locale,
}: ContactConfirmationEmailProps) {
  const isEnglish = locale === 'en';

  return (
    <Html>
      <Head />
      <Preview>
        {isEnglish
          ? 'Your message has been received'
          : 'Votre message a été reçu'}
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
              {isEnglish ? `Dear ${formData.name},` : `Cher(e) ${formData.name},`}
            </Heading>
            <Text style={text}>
              {isEnglish
                ? 'Thank you for contacting Afrexia. We have received your message and our team will review it shortly.'
                : "Merci de nous avoir contactés. Nous avons bien reçu votre message et notre équipe l'examinera sous peu."}
            </Text>
            <Text style={text}>
              {isEnglish
                ? 'We will respond to your inquiry within 24-48 hours.'
                : 'Nous répondrons à votre demande dans les 24 à 48 heures.'}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Message Summary */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish ? 'Message Summary' : 'Résumé du Message'}
            </Heading>
            <Text style={text}>
              <strong>{isEnglish ? 'Subject:' : 'Sujet:'}</strong>{' '}
              {formData.subject}
            </Text>
            <Text style={text}>
              <strong>Message:</strong>
            </Text>
            <Text style={messageText}>{formData.message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish ? 'Need Immediate Assistance?' : "Besoin d'Aide Immédiate?"}
            </Heading>
            <Text style={text}>
              {isEnglish
                ? 'If your inquiry is urgent, please contact us directly:'
                : 'Si votre demande est urgente, contactez-nous directement:'}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> contact@afrexia.com
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

// Styles with Afrexia branding
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#194424',
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
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
  color: '#194424',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const h3 = {
  color: '#194424',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const messageText = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '12px 0',
  padding: '16px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
};

const footer = {
  padding: '24px',
  backgroundColor: '#E9EBE5',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#194424',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 0 8px',
};
