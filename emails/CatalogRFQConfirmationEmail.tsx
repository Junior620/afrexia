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
import { CatalogRFQFormData } from '@/lib/forms/catalog-rfq-schema';

interface CatalogRFQConfirmationEmailProps {
  formData: CatalogRFQFormData;
  locale: Locale;
}

/**
 * Confirmation email template for customers after catalog RFQ submission
 * Requirements: 4.9
 */
export function CatalogRFQConfirmationEmail({
  formData,
  locale,
}: CatalogRFQConfirmationEmailProps) {
  const isEnglish = locale === 'en';
  const isFrench = locale === 'fr';

  return (
    <Html>
      <Head />
      <Preview>
        {isEnglish
          ? 'Your quote request has been received'
          : isFrench
          ? 'Votre demande de devis a été reçue'
          : 'Su solicitud de cotización ha sido recibida'}
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
                ? `Dear ${formData.contact.name},`
                : isFrench
                ? `Cher(e) ${formData.contact.name},`
                : `Estimado(a) ${formData.contact.name},`}
            </Heading>
            <Text style={text}>
              {isEnglish
                ? 'Thank you for your interest in Afrexia. We have received your multi-product quote request and our team will review it shortly.'
                : isFrench
                ? "Merci de votre intérêt pour Afrexia. Nous avons bien reçu votre demande de devis multi-produits et notre équipe l'examinera sous peu."
                : 'Gracias por su interés en Afrexia. Hemos recibido su solicitud de cotización de múltiples productos y nuestro equipo la revisará en breve.'}
            </Text>
            <Text style={text}>
              {isEnglish
                ? 'We will contact you within 24-48 hours with a customized quote based on your requirements.'
                : isFrench
                ? 'Nous vous contacterons dans les 24 à 48 heures avec un devis personnalisé basé sur vos besoins.'
                : 'Nos pondremos en contacto con usted dentro de 24-48 horas con una cotización personalizada según sus requisitos.'}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Request Summary */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish
                ? 'Request Summary'
                : isFrench
                ? 'Résumé de la Demande'
                : 'Resumen de la Solicitud'}
            </Heading>
            <Text style={text}>
              <strong>
                {isEnglish
                  ? 'Products:'
                  : isFrench
                  ? 'Produits:'
                  : 'Productos:'}
              </strong>{' '}
              {formData.products.length}{' '}
              {isEnglish ? 'items' : isFrench ? 'articles' : 'artículos'}
            </Text>
            <Text style={text}>
              <strong>
                {isEnglish
                  ? 'Delivery Location:'
                  : isFrench
                  ? 'Lieu de Livraison:'
                  : 'Ubicación de Entrega:'}
              </strong>{' '}
              {formData.delivery.location}
            </Text>
            {formData.delivery.incoterm && (
              <Text style={text}>
                <strong>Incoterm:</strong> {formData.delivery.incoterm}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Products List */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish
                ? 'Products in Your Request'
                : isFrench
                ? 'Produits dans Votre Demande'
                : 'Productos en Su Solicitud'}
            </Heading>
            {formData.products.map((product, index) => (
              <Text key={index} style={productText}>
                {index + 1}. {product.id} - {product.quantity} {product.unit}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h3}>
              {isEnglish
                ? 'Need Help?'
                : isFrench
                ? "Besoin d'Aide?"
                : '¿Necesita Ayuda?'}
            </Heading>
            <Text style={text}>
              {isEnglish
                ? 'If you have any questions or need to modify your request, please contact us:'
                : isFrench
                ? 'Si vous avez des questions ou souhaitez modifier votre demande, contactez-nous:'
                : 'Si tiene alguna pregunta o necesita modificar su solicitud, contáctenos:'}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> sales@afrexia.com
            </Text>
            <Text style={text}>
              <strong>
                {isEnglish ? 'Phone:' : isFrench ? 'Téléphone:' : 'Teléfono:'}
              </strong>{' '}
              +237 XXX XXX XXX
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {isEnglish
                ? 'Your trusted partner for African agricultural commodities'
                : isFrench
                ? 'Votre partenaire de confiance pour les commodités agricoles africaines'
                : 'Su socio de confianza para productos agrícolas africanos'}
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Afrexia.{' '}
              {isEnglish
                ? 'All rights reserved.'
                : isFrench
                ? 'Tous droits réservés.'
                : 'Todos los derechos reservados.'}
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

const productText = {
  color: EMAIL_COLORS.bodyText,
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
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
