import { z } from 'zod';

/**
 * Contact Form Validation Schema with multilingual support
 * Validates all fields for the Contact form
 * Requirements: 14.1, 14.2, 14.4, 14.5
 */

// Phone number validation (international format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

/**
 * Get localized error messages
 */
export const getContactErrorMessages = (locale: string = 'en') => {
  const messages = {
    fr: {
      name: {
        min: 'Le nom doit contenir au moins 2 caractères',
        max: 'Le nom ne doit pas dépasser 100 caractères',
        invalid: 'Le nom contient des caractères invalides',
      },
      email: {
        invalid: 'Veuillez saisir une adresse email valide',
        max: "L'email ne doit pas dépasser 100 caractères",
      },
      phone: {
        invalid: 'Veuillez saisir un numéro de téléphone valide (ex: +237XXXXXXXXX)',
        min: 'Le numéro de téléphone est trop court',
        max: 'Le numéro de téléphone est trop long',
      },
      company: {
        max: "Le nom de l'entreprise ne doit pas dépasser 100 caractères",
      },
      subject: {
        min: 'Le sujet doit contenir au moins 3 caractères',
        max: 'Le sujet ne doit pas dépasser 200 caractères',
      },
      message: {
        min: 'Le message doit contenir au moins 10 caractères',
        max: 'Le message ne doit pas dépasser 2000 caractères',
      },
      product: {
        required: 'Veuillez sélectionner un produit',
      },
      volume: {
        max: 'Le volume ne doit pas dépasser 100 caractères',
      },
      destination: {
        max: 'La destination ne doit pas dépasser 100 caractères',
      },
    },
    en: {
      name: {
        min: 'Name must be at least 2 characters',
        max: 'Name must not exceed 100 characters',
        invalid: 'Name contains invalid characters',
      },
      email: {
        invalid: 'Please enter a valid email address',
        max: 'Email must not exceed 100 characters',
      },
      phone: {
        invalid: 'Please enter a valid phone number (e.g., +237XXXXXXXXX)',
        min: 'Phone number is too short',
        max: 'Phone number is too long',
      },
      company: {
        max: 'Company name must not exceed 100 characters',
      },
      subject: {
        min: 'Subject must be at least 3 characters',
        max: 'Subject must not exceed 200 characters',
      },
      message: {
        min: 'Message must be at least 10 characters',
        max: 'Message must not exceed 2000 characters',
      },
      product: {
        required: 'Please select a product',
      },
      volume: {
        max: 'Volume must not exceed 100 characters',
      },
      destination: {
        max: 'Destination must not exceed 100 characters',
      },
    },
    es: {
      name: {
        min: 'El nombre debe tener al menos 2 caracteres',
        max: 'El nombre no debe exceder 100 caracteres',
        invalid: 'El nombre contiene caracteres inválidos',
      },
      email: {
        invalid: 'Por favor ingrese una dirección de correo válida',
        max: 'El correo no debe exceder 100 caracteres',
      },
      phone: {
        invalid: 'Por favor ingrese un número de teléfono válido (ej: +237XXXXXXXXX)',
        min: 'El número de teléfono es demasiado corto',
        max: 'El número de teléfono es demasiado largo',
      },
      company: {
        max: 'El nombre de la empresa no debe exceder 100 caracteres',
      },
      subject: {
        min: 'El asunto debe tener al menos 3 caracteres',
        max: 'El asunto no debe exceder 200 caracteres',
      },
      message: {
        min: 'El mensaje debe tener al menos 10 caracteres',
        max: 'El mensaje no debe exceder 2000 caracteres',
      },
      product: {
        required: 'Por favor seleccione un producto',
      },
      volume: {
        max: 'El volumen no debe exceder 100 caracteres',
      },
      destination: {
        max: 'El destino no debe exceder 100 caracteres',
      },
    },
    de: {
      name: {
        min: 'Der Name muss mindestens 2 Zeichen lang sein',
        max: 'Der Name darf 100 Zeichen nicht überschreiten',
        invalid: 'Der Name enthält ungültige Zeichen',
      },
      email: {
        invalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        max: 'Die E-Mail darf 100 Zeichen nicht überschreiten',
      },
      phone: {
        invalid: 'Bitte geben Sie eine gültige Telefonnummer ein (z.B.: +237XXXXXXXXX)',
        min: 'Die Telefonnummer ist zu kurz',
        max: 'Die Telefonnummer ist zu lang',
      },
      company: {
        max: 'Der Firmenname darf 100 Zeichen nicht überschreiten',
      },
      subject: {
        min: 'Der Betreff muss mindestens 3 Zeichen lang sein',
        max: 'Der Betreff darf 200 Zeichen nicht überschreiten',
      },
      message: {
        min: 'Die Nachricht muss mindestens 10 Zeichen lang sein',
        max: 'Die Nachricht darf 2000 Zeichen nicht überschreiten',
      },
      product: {
        required: 'Bitte wählen Sie ein Produkt aus',
      },
      volume: {
        max: 'Das Volumen darf 100 Zeichen nicht überschreiten',
      },
      destination: {
        max: 'Das Ziel darf 100 Zeichen nicht überschreiten',
      },
    },
    ru: {
      name: {
        min: 'Имя должно содержать не менее 2 символов',
        max: 'Имя не должно превышать 100 символов',
        invalid: 'Имя содержит недопустимые символы',
      },
      email: {
        invalid: 'Пожалуйста, введите действительный адрес электронной почты',
        max: 'Электронная почта не должна превышать 100 символов',
      },
      phone: {
        invalid: 'Пожалуйста, введите действительный номер телефона (например: +237XXXXXXXXX)',
        min: 'Номер телефона слишком короткий',
        max: 'Номер телефона слишком длинный',
      },
      company: {
        max: 'Название компании не должно превышать 100 символов',
      },
      subject: {
        min: 'Тема должна содержать не менее 3 символов',
        max: 'Тема не должна превышать 200 символов',
      },
      message: {
        min: 'Сообщение должно содержать не менее 10 символов',
        max: 'Сообщение не должно превышать 2000 символов',
      },
      product: {
        required: 'Пожалуйста, выберите продукт',
      },
      volume: {
        max: 'Объем не должен превышать 100 символов',
      },
      destination: {
        max: 'Пункт назначения не должен превышать 100 символов',
      },
    },
  };

  return messages[locale as keyof typeof messages] || messages.en;
};

/**
 * Create Contact Form Schema with localized messages
 */
export const createContactFormSchema = (locale: string = 'en') => {
  const msg = getContactErrorMessages(locale);

  return z.object({
    // Contact Information
    name: z
      .string()
      .trim()
      .min(2, msg.name.min)
      .max(100, msg.name.max)
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, msg.name.invalid),

    email: z
      .string()
      .email(msg.email.invalid)
      .max(100, msg.email.max)
      .toLowerCase(),

    phone: z
      .string()
      .regex(phoneRegex, msg.phone.invalid)
      .min(8, msg.phone.min)
      .max(20, msg.phone.max)
      .optional()
      .or(z.literal('')),

    company: z
      .string()
      .trim()
      .max(100, msg.company.max)
      .optional()
      .or(z.literal('')),

    // Subject type (B2B oriented)
    subjectType: z.enum([
      'quote',
      'documentation',
      'logistics',
      'partnership',
      'other',
    ]),

    subject: z
      .string()
      .trim()
      .min(3, msg.subject.min)
      .max(200, msg.subject.max),

    message: z
      .string()
      .trim()
      .min(10, msg.message.min)
      .max(2000, msg.message.max),

    // B2B specific fields (optional)
    product: z
      .string()
      .trim()
      .max(100)
      .optional()
      .or(z.literal('')),

    volume: z
      .string()
      .trim()
      .max(100, msg.volume.max)
      .optional()
      .or(z.literal('')),

    destination: z
      .string()
      .trim()
      .max(100, msg.destination.max)
      .optional()
      .or(z.literal('')),

    // NDA request
    ndaRequested: z.boolean().optional(),

    // reCAPTCHA token (added by client)
    recaptchaToken: z.string().optional(),
  });
};

// Default schema for backward compatibility
export const contactFormSchema = createContactFormSchema('en');

/**
 * Type inference from schema
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;
