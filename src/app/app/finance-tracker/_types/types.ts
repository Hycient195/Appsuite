export interface IRow {
  date: string;
  narration: string;
  category: string;
  credit: string;
  debit: string;
  balance: string;
}

export interface IBalanceSheetPage {
  title: string;
  subTitle: string;
  rows: IRow[];
  totalCredit: string;
  totalDebit: string;
  finalBalance: string;
  rowsToAdd: number;
  imageUrl?: string;
  templateLayout?: "CLASSIC" | "MODERN"
  pageCategoryTotal?: { debit: Record<string, number>, credit: Record<string, number> }; // Add this line
}

export interface IBalanceSheetFile {
  id: string;
  name: string;
  size: number;
  mimeType: string
}

export interface IFinanceTrackerDocument {
  templateLayout?: "CLASSIC" | "MODERN";
  filename: string;
  description?: string;
  currentPage?: number;
  categories?: { debit: string[], credit: string[]};
  pages?: IBalanceSheetPage[]
}