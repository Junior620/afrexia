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

interface CatalogRFQEmailProps {
  formData: CatalogRFQFormData;
  locale: Locale;
}

/**
 * Email template for sales team when catalog RFQ is submitted
 * Requirements: 4.9
 */
export function CatalogRFQEmail({ formData, locale }: CatalogRFQEmailProps) {
  const isEnglish = locale === 'en';
  const isFrench = locale === 'fr';

  return (
    <Html>
      <Head />
      <Preview>
        {isEnglish
          ? `New Multi-Product RFQ from ${formData.contact.name}`
          : isFrench
          ? `Nouvelle demande de devis multi-produits de ${formData.contact.name}`
          : `Nueva solicitud de cotización de ${formData.contact.name}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>
              {isEnglish
                ? 'New Multi-Product Quote Request'
                : isFrench
                ? 'Nouvelle Demande de Devis Multi-Produits'
                : 'Nueva Solicitud de Cotización Multi-Producto'}
            </Heading>
          </Section>

          {/* Contact Information */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish
                ? 'Contact Information'
                : isFrench
                ? 'Informations de Contact'
                : 'Información de Contacto'}
            </Heading>
            <Text style={text}>
              <strong>{isEnglish ? 'Name:' : isFrench ? 'Nom:' : 'Nombre:'}</strong>{' '}
              {formData.contact.name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {formData.contact.email}
            </Text>
            <Text style={text}>
              <strong>
                {isEnglish ? 'Phone:' : isFrench ? 'Téléphone:' : 'Teléfono:'}
              </strong>{' '}
              {formData.contact.phone}
            </Text>
            <Text style={text}>
              <strong>
                {isEnglish ? 'Company:' : isFrench ? 'Entreprise:' : 'Empresa:'}
              </strong>{' '}
              {formData.contact.company}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Delivery Details */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish
                ? 'Delivery Details'
                : isFrench
                ? 'Détails de Livraison'
                : 'Detalles de Entrega'}
            </Heading>
            <Text style={text}>
              <strong>
                {isEnglish ? 'Location:' : isFrench ? 'Lieu:' : 'Ubicación:'}
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

          {/* Products */}
          <Section style={section}>
            <Heading style={h2}>
              {isEnglish
                ? `Products Requested (${formData.products.length})`
                : isFrench
                ? `Produits Demandés (${formData.products.length})`
                : `Productos Solicitados (${formData.products.length})`}
            </Heading>
            {formData.products.map((product, index) => (
              <Text key={index} style={productText}>
                {index + 1}. <strong>{isEnglish ? 'Product ID:' : isFrench ? 'ID Produit:' : 'ID Producto:'}</strong> {product.id}
                <br />
                {'   '}
                <strong>{isEnglish ? 'Quantity:' : isFrench ? 'Quantité:' : 'Cantidad:'}</strong>{' '}
                {product.quantity} {product.unit}
              </Text>
            ))}
          </Section>

          {formData.notes && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>
                  {isEnglish
                    ? 'Additional Notes'
                    : isFrench
                    ? 'Notes Supplémentaires'
                    : 'Notas Adicionales'}
                </Heading>
                <Text style={text}>{formData.notes}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {isEnglish
                ? 'This is an automated message from the Afrexia product catalog RFQ form.'
                : isFrench
                ? 'Ceci est un message automatique du formulaire de demande de devis du catalogue Afrexia.'
                : 'Este es un mensaje automatizado del formulario de solicitud de cotización del catálogo Afrexia.'}
            </Text>
            <Text style={footerText}>
              {isEnglish
                ? 'Please respond to the customer within 24 hours.'
                : isFrench
                ? 'Veuillez répondre au client dans les 24 heures.'
                : 'Por favor responda al cliente dentro de 24 horas.'}
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

const productText = {
  color: EMAIL_COLORS.bodyText,
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '12px',
  backgroundColor: EMAIL_COLORS.muted,
  borderRadius: '4px',
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
