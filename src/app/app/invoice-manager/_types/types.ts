export interface ITemplateThemeColor {
  display?: string;
  primary?: {
    darkest?: string,
    darker?: string,
    base?: string,
    lighter?: string
    lightest?: string
  };
  secondary?: {
    darkest?: string,
    darker?: string,
    base?: string,
    lighter?: string
    lightest?: string
  };
  tertiary?: {
    darkest?: string,
    darker?: string,
    base?: string,
    lighter?: string
    lightest?: string
  };
}

export type Currency = {
  code: string; // Currency code (e.g., "USD", "EUR")
  symbol: string; // Currency symbol (e.g., "$", "€")
  name: string; // Full currency name (e.g., "United States Dollar")
};

export type Address = {
  street: string;
  city: string;
  state?: string; // Optional state/region
  postalCode: string;
  country: string;
};

export type ContactInfo = {
  fullName: string;
  companyName?: string; // Optional for individuals
  // address: Address;
  address: string;
  email: string;
  country?: string;
  phone?: string; // Optional
  website?: string; // Optional
  taxIdentificationNumber?: string; // For commercial invoices
  VATNumber?: string; // For businesses under VAT schemes
};

export type LineItem = {
  id: string; // Unique identifier for tracking
  title?: string;
  description: string; // Product or service description
  quantity: number; // Quantity sold/provided
  unitPrice: number; // Price per unit
  taxRate?: number; // Optional tax rate for this item
  discountRate?: number; // Optional discount rate
  hoursBilled?: number; // For timesheet invoices
  ratePerHour?: number; // Hourly rate for timesheet invoices
  total: number; // Computed total for this line item
};

export type TaxDetail = {
  name: string; // e.g., "Sales Tax", "VAT"
  rate: number; // Percentage (e.g., 7.5 for 7.5%)
  amount: number; // Computed tax amount
};

export type DiscountDetail = {
  description?: string; // e.g., "Seasonal Discount"
  rate: number; // Percentage (e.g., 10 for 10%)
  amount: number; // Computed discount amount
};

export type PaymentDetails = {
  method:
    | "Bank Transfer"
    | "Credit Card"
    | "PayPal"
    | "Cash"
    | "Cryptocurrency"
    | string; // Payment method
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode?: string; // Optional
    IBAN?: string; // Optional
  };
  transactionId?: string; // Optional for online payments
  paidDate?: string; // ISO 8601 format (if applicable)
  paymentTerms?: string; // e.g., "Net 30", "Due on receipt"
  dueDate?: string; // ISO 8601 format
  retainageAmount?: number; // Amount retained for retainer invoices
};

export type RecurrenceDetails = {
  recurrenceFrequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
  startDate: string; // ISO 8601 format
  endDate?: string; // Optional for finite recurrence
  autoRenewal?: boolean; // Whether the invoice recurs indefinitely
};

export type InvoiceMetadata = {
  title?: string;
  invoiceId: string; // Unique invoice identifier
  invoiceType:
    | "Standard"
    | "Commercial"
    | "Pro-Forma"
    | "Past-Due"
    | "Retainer"
    | "Interim"
    | "Timesheet"
    | "Recurring"
    | "Credit"
    | "Debit"
    | "Mixed"
    | "Final"
    | "E-Invoice";
  invoiceDate: string; // ISO 8601 format
  exportDate?: string;
  status:
    | "Draft"
    | "Sent"
    | "Paid"
    | "Partially Paid"
    | "Overdue"
    | "Cancelled";
  currency: Currency;
  language: string; // e.g., "en", "fr", "es"
  purchaseOrderNumber?: string; // For commercial/pro-forma invoices
  customsDeclarationNumber?: string; // For commercial invoices
  electronicInvoiceReference?: string; // For e-invoices
  airwayBillNo?: string;
};

export type Branding = {
  logoUrl?: string; // URL of the company logo
  themeColor?: {
    display: string;
    primary?: {
      darkest?: string,
      darker?: string,
      base?: string,
      lighter?: string
      lightest?: string
    };
    secondary?: {
      darkest?: string,
      darker?: string,
      base?: string,
      lighter?: string
      lightest?: string
    };
    tertiary?: {
      darkest?: string,
      darker?: string,
      base?: string,
      lighter?: string
      lightest?: string
    };
  }; // Primary theme color
  // secondaryColor?: string; // Optional secondary color
  fontFamily?: string; // Font family for styling
  backgroundImageUrl?: string; // Optional background for invoice
  watermarkText?: string; // Optional watermark text
  eSignatureUrl?: string; // URL for an electronic signature
};

export type AdditionalNotes = {
  termsAndConditions?: string; // Terms and conditions
  footerMessage?: string; // Footer message
  specialInstructions?: string; // Any other special instructions
  refundPolicy?: string; // Refund policy for credit/debit invoices
  dueReminder?: string; // Reminder for overdue invoices
};

export interface IGlobalInvoice {
  fileName?: string;
  templateId?: string;
  metadata: InvoiceMetadata;
  sender: ContactInfo;
  recipient: ContactInfo;
  lineItems: LineItem[];
  taxes?: TaxDetail[];
  discounts?: DiscountDetail[];
  subtotal: number; // Total amount before taxes and discounts
  totalTax: number; // Computed total tax amount
  totalWeight?: {
    amount: number;
    unit: "KG"|"LBS"
  }
  shipmentTerms: string;
  totalDiscount: number; // Computed total discount amount
  adjustments?: number; // Miscellaneous adjustments (e.g., extra fees)
  grandTotal: number; // Total after taxes, discounts, and adjustments
  paymentDetails: PaymentDetails;
  recurrenceDetails?: RecurrenceDetails; // For recurring invoices
  branding?: Branding;
  notes?: AdditionalNotes;
};

