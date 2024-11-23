import { IGlobalInvoice } from "../_types/types";

export const comprehensiveInvoice: IGlobalInvoice = {
  metadata: {
    title: "",
    invoiceId: "INV-2024-00123",
    invoiceType: "Commercial",
    invoiceDate: "2024-11-03",
    exportDate: "2024-12-15",
    customerId: "CUSTP234",
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
    position: "Director",
    companyName: "Global Trade Co. Ltd.",
    companyBusinessType: "Innovations",
    addressDetails: {
      street: "123 Export Avenue",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    address: "New way drive Orleans",
    country: "United States of America",
    email: "contact@globaltrade.com",
    phone: "+1-555-0123",
    website: "https://www.globaltrade.com",
    VATNumber: "US123456789",
  },
  recipient: {
    fullName: "Tech Innovators Inc.",
    position: "Director",
    companyName: "Tech Innovators Inc.",
    addressDetails: {
      street: "456 Silicon Way",
      city: "San Francisco",
      state: "CA",
      postalCode: "94103",
      country: "USA",
    },
    address: "Safari Broadway drive",
    country: "Nigeria",
    email: "billing@techinnovators.com",
    phone: "+1-555-6789",
  },
  lineItems: [
    {
      id: "item1",
      title: "",
      description: "Custom Hardware Development",
      quantity: 10,
      unitPrice: 1500,
      taxRate: 7.5,
      discountRate: 5,
      total: 14250, // Computed
      billedPer: "HOUR"
    },
    {
      id: "item2",
      title: "",
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
  valueAddedTax: {
    rate: 0,
    amount: 0
  },
  appliedDiscount: {
    rate: 0,
    amount: 0
  },
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
      IFSCCode: "IFSC989NIK",
      gstin: "088786JNKJB",
      upi: "078787@icici",
    },
    dueDate: "2024-11-10",
  },
  recurrenceDetails: {
    recurrenceFrequency: "Monthly",
    startDate: "2024-11-01",
    autoRenewal: true,
  },
  branding: {
    logoUrl: "",
    qrCodeUrl: "",
    themeColor: {
      display: "#004080",
      primary: {
        base: "#004080"
      }
    },
    eSignatureUrl: "",
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
  templateId: "",
  metadata: {
    title: "",
    invoiceId: "",
    invoiceType: "Standard",
    invoiceDate: "",
    exportDate: "",
    customerId: "",
    status: "Draft",
    currency: {
      code: "USD",
      symbol: "$",
      name: "United States Dollar",
    },
    language: "",
    purchaseOrderNumber: "",
    customsDeclarationNumber: "",
    electronicInvoiceReference: "",
    airwayBillNo: "",
  },
  sender: {
    fullName: "",
    position: "",
    companyName: "",
    companyBusinessType: "",
    address: "",
    addressDetails: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
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
    addressDetails: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
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
      billedPer: "",
    },
  ],
  taxes: [
    {
      name: "",
      rate: 0,
      amount: 0, // Computed
    },
  ],
  discounts: [
    {
      description: "",
      rate: 0,
      amount: 0, // Computed
    },
  ],
  subtotal: 0,
  totalTax: 0,
  valueAddedTax: {
    rate: 0,
    amount: 0
  },
  appliedDiscount: {
    rate: 0,
    amount: 0
  },
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
      IFSCCode: "",
      gstin: "",
      upi: "",
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
    qrCodeUrl: "",
    themeColor: {
      display: "#004080",
      primary: {
        base: "#004080"
      },
    },
    // secondaryColor: "",
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