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
    eSignatureUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIHEhIQBxAWFhETGBgTFxMVFxcWFxgVGBcXGRUbFxkhHSggGBolHRgVITIiJyktLjouFx8zODctPSotLi4BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKkBKgMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcCBAUBAwj/xABKEAABAwMDAQUDCAUICAcAAAABAAIDBAURBhIhMQcTQVFhIjJxFBUjM0JygZFSYoKxwRYkQ5KhstHSFzVEc4OiwtM0VFVjhJOU/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALxREQEREBERAREQEREBERAREQERa1xr47ZG+aueGRsG5zj0A/ifRBsoo1pLW1Lqx0rLZ3gdFgkSM25a4kAjBPkeDg+ikqAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIPCVTmtrsNWS1HePLbVbuZXNIBqKnoyNjunLiGjy5Pi1THtBuE1R3VrsZxVVm7dJziGmbgSyEjkHkNHxOOcKNXCzw3CqpNP2puKSkAqasjA3kABrXY6uduBP38j3UHd7HrF800LZpmgS1f0zsZ4Z/RN55xtO7Hm8qdrGNgjADAABwAOgHgB6LJAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFp3a4x2mGSor3bYoml7neg8vMnoB5lbig96cNXVzaBozSURZPVH7L5usEHqB77h04AQfC01Zs1LVXzUQxNUASNjON0cH+zU4J6OOQT+s70W52YWZ9HTuq7nzV1zvlMpxggP5YznkAA5x4FxHguXqYjWFzgtkZzTUmKqq/Rc8YEcR8/e5Hk8+LeLGAx0QeoiICIiAiIgIiICIiAiIgIvCcLFkof7hBx5HKDNERAREQEREBERAREQEREBERAREQEREBEXhOEHD1nfDYaYvpmb6iRzYII/wBOd/DB8By4+jSuDXSjs6tb3lwdVOyXSHnvqyXlzz5jOTj9FmFnp4nVlbJcX80lKX09GOoe/O2onHnyNjT5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vPx992XfhldxBp2i2x2iGOnowRHE0Mbk5OAPE+JW4iICIiAiIgIiICjGu9Gw6uh2T+zMzJilAyWk9Q4faYcDI9MjBCk6IKOptUXXs5Ip9QQ97TDDWOc47Q0YAEUwHTH2XjPwUV1DfptZ1zqi2NlcctbDHHkyRtHTGwna7dudkeJ9F+miM9ViyJsf1YA+Awgq7TGgaipiEN8HyaizvdRxP3STvdgudVzD3jx0acYwOMKzqOkZRMbFSMayNg2tY0ANaB0AHgvsiDwhV/q3swguR+UWE/Japp3hzMiMvznJA9x3X2m+fIKsFEFFW3WtfYrlFHrCZwjjHcytPulhzslwOHclp3gctBHmrrraCK4gNromSNB3APa14B8wCOq1rhp6lucsc9wp2SSxe45wzjnPTocHkZ6Houl0QV32sVJpqaC12VrWy1sgibGwBoEYILzgDhu4sB9HOPgpnp20MsdNDS03uxNDc4xud9px9XOyfxUSsY/lLeKqscQYbePkUI4I748zv9CPd+BU/QRWr7O7bW1D6qspt8rzvduklLC49SWbtv4YwpDQUEVuYI6CNkbB0axoaPyC2UQMIiICIiAiIgLnXKxUt1/1lTRSf7yNrj+ZC6KII+NEW0ci3U3/ANLP8Ftwaaoqf6ijp2/CGMfwXVRB8YKVlP8AUMa37rQP3L7IiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLi6yvY09R1FU7kxs9gecjvZjH9YhdpQbVuNQXCitnWOL+f1A82sO2Bh+LySR5AIOv2f2Q2Ghgil+tcO9lJ5Jmk9p+T4kcN/ZCkSBEBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQeOOOqhXZzH84vrro/n5ZM5sRP8A5aDMcWB4AkOP5Le7Sbi+30EooeaictpYR4mSY7Bj4AuP4Lt2S3NtFPDTU/uQsbGPXaAM/j1/FBuoiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIUENux+ebvS0wyY6GN1bJ5d6/MVOD6gGR35KZKtLFqKms3zncbo/wClqKt8LI24dK9tP9FCxjepPDj+0prpuSpnh729NDJZCXiEc90w42MLvtOA5J83EdAEHWREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBH6bRlBS1LqyClYKhxLt/Jw4kkua0na1xJPIGeVIAMdERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k=",
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