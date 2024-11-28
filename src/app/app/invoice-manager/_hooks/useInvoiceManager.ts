// import { ChangeEvent, useEffect } from "react";
// import { IGlobalInvoice } from "../_types/types";
// import { defaultGlobalInvoice } from "../_templates/globalDummyData";
// import { handleInputChange, handleUpdateStateProperty } from "@/utils/miscelaneous";

// const useInvoiceManager = (
//   invoice: IGlobalInvoice,
//   setInvoice: React.Dispatch<React.SetStateAction<IGlobalInvoice>>
// ) => {
//   useEffect(() => {
//     // Recompute all dependent properties
//     const recomputeValues = () => {
//       // Compute the subtotal (sum of all line items' totals)
//       const subtotal = parseFloat(invoice.lineItems.reduce((sum, item) => {
//         const quantityTotal = item.quantity * item.unitPrice;
//         const discount = item.discountRate
//           ? (item.discountRate / 100) * quantityTotal
//           : 0;
//         const total = quantityTotal - discount;
//         return sum + total;
//       }, 0).toFixed(2));

//       // Compute total tax
//       const totalTax = (invoice.taxes && invoice?.taxes[0]?.rate)
//         ? invoice.taxes.reduce((sum, tax) => sum + parseFloat(String(tax.amount)), 0)
//         : parseFloat(String(invoice.totalTax));

//       // Compute total discount
//       const totalDiscount = (invoice.discounts && invoice.discounts?.[0]?.rate)
//         ? invoice.discounts.reduce((sum, discount) => sum + parseFloat(String(discount.amount)), 0)
//         : parseFloat(String(invoice.totalDiscount));

//       // Compute grand total
//       const grandTotal =
//         ((subtotal + totalTax) - totalDiscount + (invoice.adjustments || 0));

//       const lineItems = invoice.lineItems.map((x) => { return { ...x, total: parseFloat((x.quantity * x.unitPrice)?.toFixed(2))} })

//       // Update state with computed values
//       const dataToSet = {
//         ...invoice,
//         subtotal,
//         totalTax,
//         totalDiscount,
//         grandTotal,
//         lineItems
//       }

//       if (JSON.stringify(dataToSet) !== JSON.stringify(invoice)) {
//         setInvoice((prevInvoice) => ({
//           ...prevInvoice,
//           subtotal,
//           totalTax,
//           totalDiscount,
//           grandTotal,
//           lineItems
//         }));
//       }
//     };

//     recomputeValues();
//   }, [invoice, setInvoice]);

//   const insertLineItemAtIndex = (index: number) => {
//     setInvoice((prevInvoice) => {
//       const updatedLineItems = [...prevInvoice.lineItems];
//       updatedLineItems.splice(index, 0, { ...defaultGlobalInvoice.lineItems[0] });
//       return {
//         ...prevInvoice,
//         lineItems: updatedLineItems,
//       };
//     });
//   };

//   // Method to remove a line item at a specific index
//   const removeLineItemAtIndex = (index: number) => {
//     if (invoice?.lineItems?.length > 1) {
//       setInvoice((prevInvoice) => {
//         const updatedLineItems = [...prevInvoice.lineItems];
//         if (index >= 0 && index < updatedLineItems.length) {
//           updatedLineItems.splice(index, 1);
//         }
//         return {
//           ...prevInvoice,
//           lineItems: updatedLineItems,
//         };
//       });
//     }
//   };

//   const handleNumericInputBlur = (field: string, event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>): void => {
//     const value = event.target.value?.replace(/,/ig,"");
//     // Parse the value to a number to ensure it's valid, then format with two decimal places.
//     if (!isNaN(Number(value))) {
//       const formattedValue = !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : "0";
//       handleUpdateStateProperty(invoice, setInvoice, formattedValue, field );
//     } else {
//       console.error("Invalid input: Please enter a valid number.");
//     }
//   };


//   return {
//     insertLineItemAtIndex,
//     removeLineItemAtIndex,
//     handleNumericInputBlur
//   };
// };

// export default useInvoiceManager;

import { ChangeEvent, useEffect } from "react";
import { IGlobalInvoice } from "../_types/types";
import { defaultGlobalInvoice } from "../_templates/globalDummyData";
import { handleUpdateStateProperty } from "@/utils/miscelaneous";

const useInvoiceManager = (
  invoice: IGlobalInvoice,
  setInvoice: React.Dispatch<React.SetStateAction<IGlobalInvoice>>
) => {
  useEffect(() => {
    // Recompute all dependent properties
    const recomputeValues = () => {
      // Compute the subtotal (sum of all line items' totals)
      const subtotal = parseFloat(
        invoice.lineItems
          .reduce((sum, item) => {
            const quantityTotal = item.quantity * item.unitPrice;
            const discount = item.discountRate
              ? (item.discountRate / 100) * quantityTotal
              : 0;
            const total = quantityTotal - discount;
            return sum + total;
          }, 0)
          .toFixed(2)
      );

      // Compute total tax
      const totalTax = invoice?.taxes?.[0]?.amount ? invoice?.taxes?.reduce(
        (sum, tax) => sum + parseFloat(String(tax.amount)),
        0
      ) : parseFloat(String(invoice.totalTax));

      // Compute total discount
      const totalDiscount = invoice.discounts[0].amount ? invoice.discounts?.reduce(
        (sum, discount) => sum + parseFloat(String(discount.amount)),
        0
      ) : parseFloat(String(invoice.totalDiscount));

      // Compute VAT amount dynamically if VAT rate is present
      // const vatAmount = parseFloat(
      //   (subtotal * (invoice.valueAddedTax.rate / 100)).toFixed(2)
      // );

      // Update VAT rate if VAT amount changes (two-way synchronization)
      // const vatRate = invoice.valueAddedTax.amount
      //   ? parseFloat(
      //       ((invoice.valueAddedTax.amount / subtotal) * 100).toFixed(2)
      //     )
      //   : invoice.valueAddedTax.rate;

      // Compute grand total
      // const grandTotal =
      //   subtotal + vatAmount + totalTax - totalDiscount + (invoice.adjustments || 0);
      const grandTotal =
        subtotal + invoice.valueAddedTax.amount + totalTax - totalDiscount + (invoice.adjustments || 0);

      const lineItems = invoice.lineItems.map((x) => ({
        ...x,
        total: parseFloat((x.quantity * x.unitPrice).toFixed(2)),
      }));

      const dataToSet = {
        ...invoice,
        subtotal,
        totalTax,
        totalDiscount,
        grandTotal,
        // valueAddedTax: { rate: vatRate, amount: vatAmount },
        lineItems,
      }

      // console.log(vatAmount)

      // Update state with computed values
      if (JSON.stringify(dataToSet) !== JSON.stringify(invoice)) {
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          subtotal,
          totalTax,
          totalDiscount,
          grandTotal,
          // valueAddedTax: { rate: vatRate, amount: vatAmount },
          lineItems,
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

  /* ================== */
  /** Discounts Section */
  /* ================== */

  const updateDiscount = (index: number, field: "rate" | "amount", value: (number|string)) => {
    setInvoice((prevInvoice) => {
      const updatedDiscounts = [...(prevInvoice.discounts || [])];
      const discountToUpdate = { ...updatedDiscounts[index] };

      const cleanedValue = typeof value === "number" ?
        !isNaN(parseFloat(String(value))) ?
          parseFloat(String(value))
          : 0
        : !isNaN(parseFloat(value)) ?
          parseFloat(value?.replace(/,/,""))
          : 0

      if (field === "rate") {
        discountToUpdate.rate = cleanedValue;
        discountToUpdate.amount = parseFloat(
          ((cleanedValue / 100) * prevInvoice.subtotal).toFixed(2)
        );
      } else if (field === "amount") {
        discountToUpdate.amount = cleanedValue;
        discountToUpdate.rate = parseFloat(
          ((cleanedValue / prevInvoice.subtotal) * 100).toFixed(2)
        );
      }

      updatedDiscounts[index] = discountToUpdate;

      return {
        ...prevInvoice,
        discounts: updatedDiscounts,
      };
    });
  };


  const insertDiscountAtIndex = (index: number) => {
    setInvoice((prevInvoice) => {
      const updatedDiscountItems = [...prevInvoice.discounts];
      updatedDiscountItems.splice(index, 0, { ...defaultGlobalInvoice.discounts[0] });
      return {
        ...prevInvoice,
        discounts: updatedDiscountItems,
      };
    });
  };

  const removeDiscountAtIndex = (index: number) => {
    if (invoice?.discounts?.length > 1) {
      setInvoice((prevInvoice) => {
        const updatedDiscountItems = [...prevInvoice.discounts];
        if (index >= 0 && index < updatedDiscountItems.length) {
          updatedDiscountItems.splice(index, 1);
        }
        return {
          ...prevInvoice,
          discounts: updatedDiscountItems,
        };
      });
    }
  };

  const handleNumericInputBlur = (
    field: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const value = event.target.value?.replace(/,/g, "");
    if (!isNaN(Number(value))) {
      const formattedValue = !isNaN(parseFloat(value))
        ? parseFloat(value).toFixed(2)
        : "0";
      handleUpdateStateProperty(invoice, setInvoice, formattedValue, field);
    } else {
      console.error("Invalid input: Please enter a valid number.");
    }
  };

  const updateVat = (field: "rate" | "amount", value: number|string) => {
    setInvoice((prevInvoice) => {
      const newVat = { ...prevInvoice.valueAddedTax };

      const cleanedValue = typeof value === "number" ?
        !isNaN(parseFloat(String(value))) ?
          parseFloat(String(value))
          : 0
        : !isNaN(parseFloat(value)) ?
          parseFloat(value?.replace(/,/,""))
          : 0

      console.log(value)
      console.log(prevInvoice.subtotal)
      if (field === "rate") {
        newVat.rate =  cleanedValue;
        newVat.amount = parseFloat(
          (prevInvoice.subtotal * (cleanedValue / 100)).toFixed(2)
        );
      } else if (field === "amount") {
        newVat.amount = cleanedValue;
        newVat.rate = parseFloat(
          ((cleanedValue / prevInvoice.subtotal) * 100).toFixed(2)
        );
      }
      console.log(newVat)
      return {
        ...prevInvoice,
        valueAddedTax: newVat,
      };
    });
  };

  return {
    insertLineItemAtIndex,
    removeLineItemAtIndex,
    handleNumericInputBlur,
    updateVat, // Expose updateVat for manual updates
    insertDiscountAtIndex,
    removeDiscountAtIndex,
    updateDiscount
  };
};

export default useInvoiceManager;