import React, { ChangeEvent, useEffect } from "react";
import { comprehensiveInvoice } from "../globalDummyData";
import { IGlobalInvoice } from "../../_types/types";
import useInvoiceManager from "../../_hooks/useInvoiceManager";
import { useThemeContext } from "../../_contexts/themeContext";
import { ResponsiveTextInput } from "@/sharedComponents/FormInputs";
import { handleInputChange, splitInThousand } from "@/utils/miscelaneous";
import PageImage from "@/sharedComponents/PageImage";
import DocumentPage from "../../_components/DocumentPage";

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

  const themes = [
    {
      display: "rgb(228 228 231)",
      primary: {
        base: "rgb(228 228 231)",
        lightest: "rgb(244 244 245 / 0.2)"
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

  // const templateThemeColor = isPreview ? getSelectedTheme(templateId) : stateObject?.branding?.themeColor;
  const templateThemeColor =  getSelectedTheme(templateId)

  return (
    
    <div className="p-[clamp(16px,4%,80px)] bg-white">
    {/* Header */}
    <header className="flex justify-between items-start mb-8">
      <div className="">

        <ResponsiveTextInput
          onChange={handleChange}
          name="metadata?.title"
          placeholder="[  ]"
          value={stateObject.metadata?.title || "INVOICE"}
          className="text-5xl text-zinc-700 font-bold"
        />
        {/* <PageImage width={80} placeholder="Add/drop Logo" fileId={fileId} formData={stateObject} setFormData={setStateObject} isLoggedIn={isLoggedIn} imageProperty={stateObject?.branding?.logoUrl as string} propertyKey="branding.logoUrl" /> */}
      </div>
      
      <div className="text-right flex flex-col  w-full max-w-[340px]">
        <ResponsiveTextInput
          onChange={handleChange}
          name="sender.companyName"
          placeholder="[ brand name ]"
          value={stateObject.sender.companyName}
          className="text-2xl text-zinc-800 font-semibold h- min-w-[200px]"
        />
        <ResponsiveTextInput
          onChange={handleChange}
          name="sender.address"
          placeholder="[ brand address ]"
          value={stateObject.sender.address}
          className="text-zinc-600"
        />
      </div>
    </header>

    {/* Bill To & Invoice Details */}
    <section className="mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div >
          <h3 className="font-bold text-zinc-500 text-lg">BILL TO:</h3>
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
            className="text-zinc-600"
          />
        </div>
        <div className="text-left text-zinc-800 ml-auto w-full max-w-[340px] ">
          <h3 className="font-bold text-lg">Invoice Details:</h3>
          <p className="flex items-center gap-1">
            <span className="font-semibold">Invoice Date: </span>
            <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceDate"
              placeholder="[ date ]"
              value={stateObject.metadata.invoiceDate}
            />
          </p>
          <p className="flex items-center gap-1">
            <span className="font-semibold">Due Date: </span>
            <ResponsiveTextInput
              onChange={handleChange}
              name="paymentDetails.dueDate"
              placeholder="[ date ]"
              value={stateObject.paymentDetails.dueDate}
            />
          </p>
          <p className="flex items-center gap-1">
            <span className="font-semibold">Invoice No: </span>
            <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceId"
              placeholder="[ IN***** ]"
              value={stateObject.metadata.invoiceId}
            />
          </p>
        </div>
      </div>
    </section>

    {/* Line Items Table */}
    <table className="w-full table-auto border-collapse  border-gray-300 mb-8">
      <thead className="">
        <tr style={{ backgroundColor: templateThemeColor?.primary?.base}} className="bg-gray-100">
          <th className=" border-gray-300 px-4 py-5 text-left">Item Descriptions</th>
          <th className=" border-gray-300 px-4 py-5 text-right">Unit Price</th>
          <th className=" border-gray-300 px-4 py-5 text-right">Qty</th>
          <th className=" border-gray-300 px-4 py-5 text-right">Amount</th>
        </tr>
      </thead>
      <tbody  style={{ backgroundColor: templateThemeColor?.primary?.lightest}}>
        {stateObject.lineItems.map((item, index) => (
          <tr className="border-b" key={`line-items-${index}`}>
            <td className=" px-4 py-2">
              <div className="flex flex-col">
                <ResponsiveTextInput
                  onChange={handleChange}
                  name={`lineItems.${index}.title`}
                  placeholder="[ item title ]"
                  value={item.title}
                  className="bg-transparent text-lg font-medium"
                />
                <ResponsiveTextInput
                  onChange={handleChange}
                  name={`lineItems.${index}.description`}
                  placeholder="[ item description ]"
                  value={item.description}
                  className={`text-sm bg-transparent text-zinc-500 ${!item?.description && "noExport"}`}
                />
              </div>
             
            </td>
            <td className=" px-4 py-2 text-right">
              <ResponsiveTextInput
                onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
                name={`lineItems.${index}.unitPrice`}
                placeholder="[  ]"
                value={splitInThousand(item.unitPrice)}
                className="text-right bg-transparent"
                onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)}
              />
            </td>
            <td className=" px-4 py-2 text-right">
              <ResponsiveTextInput
                onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
                name={`lineItems.${index}.quantity`}
                placeholder="[  ]"
                value={splitInThousand(item.quantity)}
                className="text-right bg-transparent"
                onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.quantity`, e)}
              />
            </td>
            <td className=" relative border-gray-300 px-4 py-2 text-right">
              {stateObject.metadata.currency.symbol} {splitInThousand(item.total)}
              <div className="absolute  h-full w-12 -right-1 top-0 translate-x-12 flex gap-1 items-center noExport">
                <button onClick={() => controls?.removeLineItemAtIndex(index)} className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                <button onClick={() => controls?.insertLineItemAtIndex(index+1)} className="h-5 w-5 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
              </div>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={3} className="text-right bg-white pt-3 text-zinc-700 font-medium">Sub Total: </td>
          <td className="text-right bg-white pt-3 font-bold px-4">{stateObject.metadata.currency.symbol} {splitInThousand(stateObject.subtotal)}</td>
        </tr>
        {
          stateObject?.discounts?.map((discount, discountIndex) => (
            <tr key={`discount-item-${discountIndex}`}>
              <td colSpan={3} className="text-right bg-white py-1 font-medium text-zinc-700">
                <div className="flex flex-row gap-1 items-center w-full justify-end">
                  {/* Discount: */}
                  <ResponsiveTextInput placeholder="[ discount type ]" onChange={handleChange} name={`discounts.${discountIndex}.description`} value={discount?.description} className="text-right text-zinc-500" />:
                  <ResponsiveTextInput type="number" max={100} placeholder="[ disc ]"  onChange={(e) => controls?.updateDiscount(discountIndex, "rate", e.target.value)} name={`discounts.${discountIndex}.rate`} value={discount?.rate} className="text-right" />%
                </div>
              </td>
              <td className="text-right relative bg-white py-1 font-bold">
                <div className="flex flex-row gap-1 items-center justify-end">
                  {stateObject.metadata.currency.symbol}
                  <ResponsiveTextInput placeholder="[amount]" onChange={(e) => controls?.updateDiscount(discountIndex, "amount", e.target.value)} name={`discounts.${discountIndex}.amount`} value={splitInThousand(discount?.amount)} className="text-right px-4" />
                </div>
                <div className="absolute  h-full w-12 -right-1 top-0 translate-x-12 flex gap-1 items-center noExport">
                  <button onClick={() => controls?.removeDiscountAtIndex(discountIndex)} className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                  <button onClick={() => controls?.insertDiscountAtIndex(discountIndex+1)} className="h-5 w-5 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
                </div>
              </td>
            </tr>
          ))
        }
         
          <tr>
            <td colSpan={3} className="text-right bg-white py-1 font-medium text-zinc-700">
              <div className="flex flex-row gap-1 items-center justify-end">
                VAT:
                <ResponsiveTextInput type="number" max={100} placeholder="[ vat ] !min-w-[20px]" onChange={(e) => controls?.updateVat("rate", e.target.value)} name="valueAddedTax.rate" value={stateObject?.valueAddedTax?.rate} className="text-right " />%
              </div>
            </td>
            <td className="text-right bg-white py-1 font-bold">
              <div className="flex flex-row gap-1 items-center justify-end">
                {stateObject.metadata.currency.symbol}
                {/* {stateObject?.valueAddedTax?.amount} */}
                <ResponsiveTextInput placeholder="[amount]" onChange={(e) => controls?.updateVat("amount", e.target.value)} name="valueAddedTax.amount" value={splitInThousand(stateObject?.valueAddedTax?.amount)} className="text-right px-4" />
              </div>
            </td>
          </tr>
          <tr className="text-right bg-white py-1 text-2xl font-bold border-t-2 border-t-zinc-500">
            <td colSpan={3} className="text-right bg-white py-1 font-semibold text-zinc-700">GRAND TOTAL: </td>
            <td className="text-right bg-white py-1 font-bold break-keep min-w-max px-4">{stateObject.metadata.currency.symbol}{splitInThousand(stateObject.grandTotal)}</td>
            
          </tr>
      </tbody>
    </table>

    {/* Payment Info */}
    <section className="mb-8 table w-max">
      <h3 className="font-semibold mb-2 text-zinc-800 text-xl">Payment Info:</h3>
      <div className=" table-row ">
        <p className="text-zinc-500 font-medium table-cell">Bank:</p>
        <ResponsiveTextInput
          onChange={handleChange}
          name="paymentDetails.bankDetails.bankName"
          placeholder="[ bank ]"
          value={stateObject.paymentDetails.bankDetails?.bankName || ""}
          className="table-cell pl-2 font-medium text-zinc-900"
        />
      </div>
      <div className=" table-row ">
        <p className="text-zinc-500 font-medium table-cell">A/C Name:</p>
        <ResponsiveTextInput
          onChange={handleChange}
          name="paymentDetails.bankDetails.accountName"
          placeholder="[ account name ]"
          value={stateObject.paymentDetails.bankDetails?.accountName || ""}
          className="table-cell pl-2 font-medium text-zinc-900"
        />
      </div>
      <div className=" table-row ">
        <p className="text-zinc-500 font-medium table-cell">Account Number:</p>
        <ResponsiveTextInput
          onChange={handleChange}
          name="paymentDetails.bankDetails.accountNumber"
          placeholder="[ account number ]"
          value={stateObject.paymentDetails.bankDetails?.accountNumber || ""}
          className="table-cell pl-2 font-medium text-zinc-900"
        />
      </div>
      <div className={`table-row ${!stateObject.paymentDetails.bankDetails?.swiftCode && "noExport"}`}>
        <p className="text-zinc-500 font-medium table-cell">Swift Code:</p>
        <ResponsiveTextInput
          onChange={handleChange}
          name="paymentDetails.bankDetails.swiftCode"
          placeholder="[ swift code ]"
          value={stateObject.paymentDetails.bankDetails?.swiftCode || ""}
          className="table-cell pl-2 font-medium text-zinc-900"
        />
      </div>
      <div className={`table-row ${!stateObject.paymentDetails.bankDetails?.IBAN && "noExport"}`}>
        <p className="text-zinc-500 font-medium table-cell">IBAN:</p>
        <ResponsiveTextInput
          onChange={handleChange}
          name="paymentDetails.bankDetails.IBAN"
          placeholder="[ IBAN ]"
          value={stateObject.paymentDetails.bankDetails?.IBAN || ""}
          className="table-cell pl-2 font-medium text-zinc-900"
        />
      </div>
    </section>

    {/* Notes */}
    <section>
      <h3 className="font-bold text-lg">Terms & Conditions:</h3>
      <ResponsiveTextInput
        onChange={handleChange}
        name="notes.termsAndConditions"
        placeholder="[ terms and conditions ]"
        value={stateObject.notes?.termsAndConditions || ""}
        className="text-zinc-700 text-justify"
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