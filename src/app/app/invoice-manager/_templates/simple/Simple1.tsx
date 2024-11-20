import React, { ChangeEvent, useEffect } from "react";
import { comprehensiveInvoice } from "../globalDummyData";
import { IGlobalInvoice } from "../../_types/types";
import useInvoiceManager from "../../_hooks/useInvoiceManager";
import { useThemeContext } from "../../_contexts/themeContext";
import { ResponsiveTextInput } from "@/sharedComponents/FormInputs";
import { handleInputChange, splitInThousand } from "@/utils/miscelaneous";
import PageImage from "@/sharedComponents/PageImage";

interface InvoiceProps {
  templateId: string;
  stateObject: IGlobalInvoice;
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>;
  controls?: ReturnType<typeof useInvoiceManager>;
  isLoggedIn?: boolean;
  fileId? : string
  isPreview?: boolean
}

const Simple1: React.FC<InvoiceProps> = ({ templateId, setStateObject, stateObject, controls, isLoggedIn = false, fileId, isPreview }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, stateObject, setStateObject);

  const {
    metadata,
    sender,
    recipient,
    lineItems,
    subtotal,
    totalTax,
    grandTotal,
    paymentDetails,
    notes,
  } = comprehensiveInvoice;

  const themes = [
    {
      display: "rgb(228 228 231)",
      primary: {
        base: "rgb(228 228 231)",
        lightest: "rgb(244 244 245 / 0.1)"
      }
    },
    {
      display: " rgb(226 232 240)",
      primary: {
        base: "rgb(226 232 240)"
      }
    },
  ]

  const { registerTemplate, getSelectedTheme } = useThemeContext();

  useEffect(() => {
    registerTemplate(templateId, themes);
  }, [templateId, themes]);

  const templateThemeColor = isPreview ? getSelectedTheme(templateId) : stateObject?.branding?.themeColor;

  return (
    
    <div className="p-[clamp(16px,6%,80px)] max-w-screen-lg mx-auto bg-white shadow-lg">
    {/* Header */}
    <header className="flex justify-between items-center mb-8">
      <ResponsiveTextInput
        onChange={handleChange}
        name="metadata?.title"
        placeholder="[  ]"
        value={stateObject.metadata?.title || "INVOICE"}
        className="text-4xl font-bold"
      />
      <div className="text-right">
        <ResponsiveTextInput
          onChange={handleChange}
          name="sender.companyName"
          placeholder="[ company name ]"
          value={stateObject.sender.companyName}
          className="text-xl font-semibold h-9 min-w-[200px]"
        />
        {/* <ResponsiveTextInput
          onChange={handleChange}
          name=""
          placeholder="[  ]"
          value={stateObject.sender.address}
        /> */}
      </div>
    </header>

    {/* Bill To & Invoice Details */}
    <section className="mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold text-lg">Bill To:</h3>
          <ResponsiveTextInput
            onChange={handleChange}
            name="recipient.fullName"
            placeholder="[ recipient name ]"
            value={stateObject.recipient.fullName}
            className="font-semibold"
          />
          <ResponsiveTextInput
            onChange={handleChange}
            name="recipient.address"
            placeholder="[ recipient address ]"
            value={stateObject.recipient.address}
          />
        </div>
        <div className="text-left ml-auto w-full max-w-[280px] ">
          <h3 className="font-bold text-lg">Invoice Details:</h3>
          <p className="flex">
            <span className="font-semibold">Invoice Date: </span>
            <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceDate"
              placeholder="[ date ]"
              value={stateObject.metadata.invoiceDate}
            />
          </p>
          <p className="flex">
            <span className="font-semibold">Due Date: </span>
            <ResponsiveTextInput
              onChange={handleChange}
              name="paymentDetails.dueDate"
              placeholder="[ date ]"
              value={stateObject.paymentDetails.dueDate}
            />
          </p>
          <p className="flex">
            <span className="font-semibold">Invoice No: </span>
            <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceId"
              placeholder="[  ]"
              value={stateObject.metadata.invoiceId}
            />
          </p>
        </div>
      </div>
    </section>

    {/* Line Items Table */}
    <table className="w-full table-auto border-collapse  border-gray-300 mb-8">
      <thead>
        <tr style={{ backgroundColor: templateThemeColor?.primary?.base}} className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Item Descriptions</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
          <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody  style={{ backgroundColor: templateThemeColor?.primary?.lightest}}>
        {stateObject.lineItems.map((item, index) => (
          <tr className="border-t" key={`line-items-${index}`}>
            <td className=" px-4 py-2">
              <div className="flex flex-col gap-1">
                <ResponsiveTextInput
                  onChange={handleChange}
                  name={`lineItems.${index}.title`}
                  placeholder="[ item title ]"
                  value={item.title}
                  className="bg-transparent"
                />
                <ResponsiveTextInput
                  onChange={handleChange}
                  name={`lineItems.${index}.description`}
                  placeholder="[ item description ]"
                  value={item.description}
                  className={`text-xs bg-transparent text-zinc-500 ${!item?.description && "noExport"}`}
                />
              </div>
             
            </td>
            <td className=" px-4 py-2 text-right">
              <ResponsiveTextInput
                onChange={handleChange}
                name={`lineItems.${index}.unitPrice`}
                placeholder="[  ]"
                value={item.unitPrice.toString()}
                className="text-right bg-transparent"
                onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)}
              />
            </td>
            <td className=" px-4 py-2 text-right">
              <ResponsiveTextInput
                onChange={handleChange}
                name={`lineItems.${index}.quantity`}
                placeholder="[  ]"
                value={item.quantity.toString()}
                className="text-right bg-transparent"
                onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.quantity`, e)}
              />
            </td>
            <td className=" relative border-gray-300 px-4 py-2 text-right">
              {stateObject.metadata.currency.symbol} {splitInThousand(item.total.toFixed(2))}
              <div className="absolute  h-full w-12 -right-1 top-0 translate-x-12 flex gap-1 items-center noExport">
                <button onClick={() => controls?.removeLineItemAtIndex(index)} className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                <button onClick={() => controls?.insertLineItemAtIndex(index+1)} className="h-5 w-5 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Totals */}
    <section className="text-right mb-8">
      <p>
        <span className="font-semibold">Sub Total: </span>
        {stateObject.metadata.currency.symbol} {stateObject.subtotal.toFixed(2)}
      </p>
      <p>
        <span className="font-semibold">VAT: </span>
        {stateObject.metadata.currency.symbol} {stateObject.totalTax.toFixed(2)}
      </p>
      <p className="text-xl font-bold">
        <span className="font-semibold">GRAND TOTAL: </span>
        {stateObject.metadata.currency.symbol} {stateObject.grandTotal.toFixed(2)}
      </p>
    </section>

    {/* Payment Info */}
    <section className="mb-8">
      <h3 className="font-bold text-lg">Payment Info:</h3>
      <ResponsiveTextInput
        onChange={handleChange}
        name=""
        placeholder="[  ]"
        value={stateObject.paymentDetails.bankDetails?.accountNumber || ""}
      />
      <ResponsiveTextInput
        onChange={handleChange}
        name=""
        placeholder="[  ]"
        value={stateObject.paymentDetails.bankDetails?.accountName || ""}
      />
      <ResponsiveTextInput
        onChange={handleChange}
        name=""
        placeholder="[  ]"
        value={stateObject.paymentDetails.bankDetails?.bankName || ""}
      />
    </section>

    {/* Notes */}
    <section>
      <h3 className="font-bold text-lg">Terms & Conditions:</h3>
      <ResponsiveTextInput
        onChange={handleChange}
        name=""
        placeholder="[  ]"
        value={stateObject.notes?.termsAndConditions || ""}
        // multiline
      />
    </section>

    <footer className="text-right flex flex-col items-end gap-4 mt-8">
      <p className="font-semibold">Signature</p>
      <div className="border-t border-gray-300 mt-1 w-1/4 ml-auto"></div>

      <PageImage placeholder="Add/drop Signature" height={100} width={200} fileId={fileId} formData={stateObject} setFormData={setStateObject} isLoggedIn={isLoggedIn} imageProperty={stateObject?.branding?.eSignatureUrl as string} propertyKey="branding.eSignatureUrl" />

    </footer>
  </div>
  );
};

export default Simple1;