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

interface ContactEmailProps {
  formData: ContactFormData;
  locale: Locale;
}

/**
 * Email template for team when contact form is submitted
 * Requirements: 19.2, 19.5
 */
export function ContactEmail({ formData, locale }: ContactEmailProps) {
  const isEnglish = locale === 'en';

  return (
    <Html>
      <Head />
      <Preview>
        {isEnglish
          ? `New contact message from ${formData.name}`
          : `Nouveau message de contact de ${formData.name}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              {isEnglish ? 'New Contact Message' : 'Nouveau Message de Contact'}
            </Heading>
          </Section>

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish ? 'Contact Information' : 'Informations de Contact'}
            </Heading>
            <Text style={text}>
              <strong>{isEnglish ? 'Name:' : 'Nom:'}</strong> {formData.name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {formData.email}
            </Text>
            {formData.phone && (
              <Text style={text}>
                <strong>{isEnglish ? 'Phone:' : 'Téléphone:'}</strong>{' '}
                {formData.phone}
              </Text>
            )}
            {formData.company && (
              <Text style={text}>
                <strong>{isEnglish ? 'Company:' : 'Entreprise:'}</strong>{' '}
                {formData.company}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Message Details */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish ? 'Subject' : 'Sujet'}
            </Heading>
            <Text style={text}>{formData.subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Message</Heading>
            <Text style={messageText}>{formData.message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {isEnglish
                ? 'This is an automated message from the Afrexia website contact form.'
                : 'Ceci est un message automatique du formulaire de contact Afrexia.'}
            </Text>
            <Text style={footerText}>
              {isEnglish
                ? 'Please respond to the sender within 24 hours.'
                : "Veuillez répondre à l'expéditeur dans les 24 heures."}
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
  padding: '24px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const section = {
  padding: '24px',
};

const h2 = {
  color: '#194424',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const messageText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
};

const footer = {
  padding: '24px',
  backgroundColor: '#f6f9fc',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px',
};
