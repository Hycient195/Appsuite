export interface IReceiptTrackerTableRow {
  date: string;
  receiptName: string;
  amount: string;
  receipt: string;
  paymentType: string;
  payerId: string;
}

export interface IReceiptTrackerPage {
  title: string;
  subTitle: string;
  rows: IReceiptTrackerTableRow[];
  totalAmount: string;
  totalSubTotal: string;
  receipt: string;
  rowsToAdd: number;
  imageUrl?: string;
}

export interface IBalanceSheetFile {
  id: string;
  name: string;
  size: number;
  mimeType: string
}