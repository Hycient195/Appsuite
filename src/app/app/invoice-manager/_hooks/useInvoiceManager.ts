import { ChangeEvent, useEffect } from "react";
import { IGlobalInvoice } from "../_types/types";
import { defaultGlobalInvoice } from "../_templates/globalDummyData";
import { handleInputChange, handleUpdateStateProperty } from "@/utils/miscelaneous";

const useInvoiceManager = (
  invoice: IGlobalInvoice,
  setInvoice: React.Dispatch<React.SetStateAction<IGlobalInvoice>>
) => {
  useEffect(() => {
    // Recompute all dependent properties
    const recomputeValues = () => {
      // Compute the subtotal (sum of all line items' totals)
      const subtotal = invoice.lineItems.reduce((sum, item) => {
        const quantityTotal = item.quantity * item.unitPrice;
        const discount = item.discountRate
          ? (item.discountRate / 100) * quantityTotal
          : 0;
        const total = quantityTotal - discount;
        return sum + total;
      }, 0);

      // Compute total tax
      const totalTax = invoice.taxes
        ? invoice.taxes.reduce((sum, tax) => sum + tax.amount, 0)
        : 0;

      // Compute total discount
      const totalDiscount = invoice.discounts
        ? invoice.discounts.reduce((sum, discount) => sum + discount.amount, 0)
        : 0;

      // Compute grand total
      const grandTotal =
        subtotal + totalTax - totalDiscount + (invoice.adjustments || 0);

      const lineItems = invoice.lineItems.map((x) => { return { ...x, total: parseFloat((x.quantity * x.unitPrice)?.toFixed(2))} })

      // Update state with computed values
      const dataToSet = {
        ...invoice,
        subtotal,
        totalTax,
        totalDiscount,
        grandTotal,
        lineItems
      }

      if (JSON.stringify(dataToSet) !== JSON.stringify(invoice)) {
        console.log("This is running")
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          subtotal,
          totalTax,
          totalDiscount,
          grandTotal,
          lineItems
        }));
      }
      
    };

    recomputeValues();
  }, [invoice, setInvoice]);

  const insertLineItemAtIndex = (index: number) => {
    setInvoice((prevInvoice) => {
      const updatedLineItems = [...prevInvoice.lineItems];
      updatedLineItems.splice(index, 0, { ...defaultGlobalInvoice.lineItems[0] });
      return {
        ...prevInvoice,
        lineItems: updatedLineItems,
      };
    });
  };

  // Method to remove a line item at a specific index
  const removeLineItemAtIndex = (index: number) => {
    if (invoice?.lineItems?.length > 1) {
      setInvoice((prevInvoice) => {
        const updatedLineItems = [...prevInvoice.lineItems];
        if (index >= 0 && index < updatedLineItems.length) {
          updatedLineItems.splice(index, 1);
        }
        return {
          ...prevInvoice,
          lineItems: updatedLineItems,
        };
      });
    }
  };

  const handleNumericInputBlur = (field: string, event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value?.replace(/,/ig,"");
    // Parse the value to a number to ensure it's valid, then format with two decimal places.
    if (!isNaN(Number(value))) {
      const formattedValue = !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : "0";
      handleUpdateStateProperty(invoice, setInvoice, formattedValue, field );
    } else {
      console.error("Invalid input: Please enter a valid number.");
    }
  };


  return {
    insertLineItemAtIndex,
    removeLineItemAtIndex,
    handleNumericInputBlur
  };
};

export default useInvoiceManager;