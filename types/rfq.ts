/**
 * RFQ (Request for Quote) Type Definitions
 * 
 * Data models for the RFQ workflow including form data, products, contact info, and delivery details.
 */

/**
 * RFQ Product
 * Represents a product in an RFQ request with quantity
 */
export interface RFQProduct {
  id: string;
  quantity: number;
  unit: string; // e.g., 'kg', 'tons', 'bags'
}

/**
 * Contact Info
 * Contact information for the person submitting the RFQ
 */
export interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

/**
 * Delivery Info
 * Delivery details for the RFQ
 */
export interface DeliveryInfo {
  location: string; // Delivery destination
  incoterm?: string; // Preferred Incoterm (e.g., 'FOB', 'CIF', 'DAP')
}

/**
 * RFQ Form Data
 * Complete form data for an RFQ submission
 */
export interface RFQFormData {
  products: RFQProduct[];
  contact: ContactInfo;
  delivery: DeliveryInfo;
  notes: string; // Additional requirements or questions
}

/**
 * RFQ Validation Errors
 * Validation error messages for RFQ form fields
 */
export interface RFQValidationErrors {
  'contact.name'?: string;
  'contact.email'?: string;
  'contact.company'?: string;
  'contact.phone'?: string;
  'delivery.location'?: string;
  'delivery.incoterm'?: string;
  products?: string;
  [key: string]: string | undefined; // Allow dynamic product quantity errors
}

/**
 * RFQ Submission Response
 * Response from the RFQ submission API
 */
export interface RFQSubmissionResponse {
  success: boolean;
  message: string;
  requestId?: string; // Unique identifier for the RFQ request
  error?: string;
}
