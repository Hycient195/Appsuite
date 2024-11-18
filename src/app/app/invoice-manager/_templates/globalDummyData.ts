import { IGlobalInvoice } from "../_types/types";

export const comprehensiveInvoice: IGlobalInvoice = {
  metadata: {
    invoiceId: "INV-2024-00123",
    invoiceType: "Commercial",
    invoiceDate: "2024-11-03",
    exportDate: "2024-12-15",
    status: "Sent",
    currency: {
      code: "USD",
      symbol: "$",
      name: "United States Dollar",
    },
    language: "en",
    purchaseOrderNumber: "PO-2024-54321",
    customsDeclarationNumber: "CD-2024-98765",
    airwayBillNo: "000231"
  },
  sender: {
    fullName: "Global Trade Co.",
    companyName: "Global Trade Co. Ltd.",
    // address: {
    //   street: "123 Export Avenue",
    //   city: "New York",
    //   state: "NY",
    //   postalCode: "10001",
    //   country: "USA",
    // },
    address: "New way drive Orleans",
    country: "United States of America",
    email: "contact@globaltrade.com",
    phone: "+1-555-0123",
    website: "https://www.globaltrade.com",
    VATNumber: "US123456789",
  },
  recipient: {
    fullName: "Tech Innovators Inc.",
    companyName: "Tech Innovators Inc.",
    // address: {
    //   street: "456 Silicon Way",
    //   city: "San Francisco",
    //   state: "CA",
    //   postalCode: "94103",
    //   country: "USA",
    // },
    address: "Safari Broadway drive",
    country: "Nigeria",
    email: "billing@techinnovators.com",
    phone: "+1-555-6789",
  },
  lineItems: [
    {
      id: "item1",
      description: "Custom Hardware Development",
      quantity: 10,
      unitPrice: 1500,
      taxRate: 7.5,
      discountRate: 5,
      total: 14250, // Computed
    },
    {
      id: "item2",
      description: "Annual Maintenance Contract",
      quantity: 1,
      unitPrice: 2000,
      total: 2000, // Computed
    },
  ],
  taxes: [
    {
      name: "Sales Tax",
      rate: 7.5,
      amount: 1237.5, // Computed
    },
  ],
  discounts: [
    {
      description: "Loyalty Discount",
      rate: 5,
      amount: 712.5, // Computed
    },
  ],
  subtotal: 16250, // Computed
  totalTax: 1237.5, // Computed
  totalDiscount: 712.5, // Computed
  adjustments: 50, // Additional fee
  grandTotal: 16775, // Computed
  totalWeight: {
    amount: 70,
    unit: "KG"
  },
  shipmentTerms: "DDU",
  paymentDetails: {
    method: "Bank Transfer",
    bankDetails: {
      accountName: "Global Trade Co.",
      accountNumber: "987654321",
      bankName: "International Bank",
      swiftCode: "INTL12345",
    },
    dueDate: "2024-11-10",
  },
  recurrenceDetails: {
    recurrenceFrequency: "Monthly",
    startDate: "2024-11-01",
    autoRenewal: true,
  },
  branding: {
    logoUrl: "https://www.globaltrade.com/logo.png",
    themeColor: "#004080",
    eSignatureUrl: "https://www.globaltrade.com/signature.png",
  },
  notes: {
    termsAndConditions:
      "Payment is due within 7 days. Late payments incur a 1% monthly fee.",
    refundPolicy: "Refunds only allowed within 14 days of payment.",
    footerMessage: "Thank you for doing business with us!",
    specialInstructions: "Include invoice number in all correspondence.",
  },
};

export const defaultGlobalInvoice: IGlobalInvoice = {
  fileName: "",
  templateName: "",
  metadata: {
    invoiceId: "",
    invoiceType: "Standard",
    invoiceDate: "",
    exportDate: "",
    status: "Draft",
    currency: {
      code: "",
      symbol: "",
      name: "",
    },
    language: "",
    purchaseOrderNumber: "",
    customsDeclarationNumber: "",
    electronicInvoiceReference: "",
    airwayBillNo: "",
  },
  sender: {
    fullName: "",
    companyName: "",
    address: "",
    email: "",
    country: "",
    phone: "",
    website: "",
    taxIdentificationNumber: "",
    VATNumber: "",
  },
  recipient: {
    fullName: "",
    companyName: "",
    address: "",
    email: "",
    country: "",
    phone: "",
    website: "",
    taxIdentificationNumber: "",
    VATNumber: "",
  },
  lineItems: [
    {
      id: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      taxRate: 0,
      discountRate: 0,
      hoursBilled: 0,
      ratePerHour: 0,
      total: 0,
    },
  ],
  taxes: [],
  discounts: [],
  subtotal: 0,
  totalTax: 0,
  totalWeight: {
    amount: 0,
    unit: "KG",
  },
  shipmentTerms: "",
  totalDiscount: 0,
  adjustments: 0,
  grandTotal: 0,
  paymentDetails: {
    method: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      swiftCode: "",
      IBAN: "",
    },
    transactionId: "",
    paidDate: "",
    paymentTerms: "",
    dueDate: "",
    retainageAmount: 0,
  },
  recurrenceDetails: {
    recurrenceFrequency: "Monthly",
    startDate: "",
    endDate: "",
    autoRenewal: false,
  },
  branding: {
    logoUrl: "",
    themeColor: "",
    secondaryColor: "",
    fontFamily: "",
    backgroundImageUrl: "",
    watermarkText: "",
    eSignatureUrl: "",
  },
  notes: {
    termsAndConditions: "",
    footerMessage: "",
    specialInstructions: "",
    refundPolicy: "",
    dueReminder: "",
  },
};