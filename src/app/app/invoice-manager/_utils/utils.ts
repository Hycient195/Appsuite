import { splitInThousand } from "@/utils/miscelaneous";
import { IGlobalInvoice } from "../_types/types";

export const formatInvoiceCurrency = (stateObject: IGlobalInvoice, amount: number): string => {
  return `${stateObject.metadata.currency.symbol}${splitInThousand(amount)}`;
};