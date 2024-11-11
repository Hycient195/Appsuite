export interface IRow {
  date: string;
  receiptName: string;
  amount: string;
  subTotal: string;
  receipt: string;
}

export interface IPage {
  title: string;
  subTitle: string;
  rows: IRow[];
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