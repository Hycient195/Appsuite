import React, { ChangeEvent, useEffect, useState } from "react";
import { IGlobalInvoice, ITemplateThemeColor } from "../../_types/types";
import { currencyMap, handleInputChange, splitInThousand } from "@/utils/miscelaneous";
import useInvoiceManager from "../../_hooks/useInvoiceManager";
import PageImage from "@/sharedComponents/PageImage";
import { FormSelect, ResponsiveTextInput } from "@/sharedComponents/FormInputs";
import { useThemeContext } from "../../_contexts/themeContext";

interface IProps {
  templateId: string;
  stateObject: IGlobalInvoice;
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>;
  controls?: ReturnType<typeof useInvoiceManager>;
  isLoggedIn?: boolean;
  fileId? : string
  themeColorPicker?: React.ReactElement
  isPreview?: boolean
  handleThemeColor?: (themeColors: ITemplateThemeColor, setThemeColor: React.Dispatch<React.SetStateAction<ITemplateThemeColor>>) => void
}

const Commercial1: React.FC<IProps> = ({ templateId, setStateObject, stateObject, controls, isLoggedIn = false, fileId, isPreview }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, stateObject, setStateObject);

  const themes = [
    {
      display: "rgb(234 179 8 / 0.2)",
      primary: {
        base: "rgb(234 179 8 / 0.2)"
      }
    },
    {
      display: "rgb(234 179 180 / 0.2)",
      primary: {
        base: "rgb(234 179 180 / 0.2)"
      }
    },
    {
      display: "rgb(110 231 183 / 0.4)",
      primary: {
        base: "rgb(110 231 183 / 0.4)"
      }
    },
  ]

  const { registerTemplate, getSelectedTheme } = useThemeContext();

  useEffect(() => {
    registerTemplate(templateId, themes);
  }, [templateId, themes]);

  const templateThemeColor = isPreview ? getSelectedTheme(templateId) : stateObject?.branding?.themeColor;
  // const templateThemeColor = getSelectedTheme(templateId);

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-4 mb-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-start justify-between gap-3 w-full">

            {/* <figure className="h-[70px] aspect-square w-[70px] bg-zinc-100 rounded-lg"></figure> */}
            <div className="">
              <PageImage width={80} placeholder="Add/drop Logo" fileId={fileId} formData={stateObject} setFormData={setStateObject} isLoggedIn={isLoggedIn} imageProperty={stateObject?.branding?.logoUrl as string} propertyKey="branding.logoUrl" />
            </div>
            
            <div className="text-right flex flex-col gap-2">
              <ResponsiveTextInput
                name="sender.companyName"
                value={stateObject?.sender?.companyName || ""}
                onChange={handleChange}
                placeholder="[ company name ]"
                className="focus:outline-none border-none max-w-[400px] min-h-[30px] min-w-[300px] text-2xl font-semibold text-right"
                type="text"
              />
              <ResponsiveTextInput
                name="sender.address"
                value={stateObject?.sender?.address || ""}
                onChange={handleChange}
                placeholder="[ company address ]"
                className="focus:outline-none border-none max-w-[400px] text-sm text-right"
                type="text"
              />
            </div>
          </div>
          <h1 className="text-4xl font-semibold">Commercial Invoice</h1>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="gap-4 mb-10 w-full">
        <div className="flex flex-row [&>*]:basis-1/4 justify-between w-full [&>*]:flex [&>*]:flex-col text-sm">
          <div>
            <span className="text-zinc-500">AIRWAY BILL NO.</span>{" "}
            <input
              name="metadata.airwayBillNo"
              value={stateObject?.metadata?.airwayBillNo || ""}
              onChange={handleChange}
              placeholder="[ airway bill number ]"
              className="focus:outline-none border-none w-full font-semibold"
              type="text"
            />
          </div>
          <div>
            <span className="text-zinc-500">INVOICE NO.</span>{" "}
            <input
              name="metadata.invoiceId"
              value={stateObject?.metadata?.invoiceId || ""}
              onChange={handleChange}
              placeholder="[ invoice no ]"
              className="focus:outline-none border-none w-full font-semibold"
              type="text"
            />
          </div>
          <div>
            <span className="text-zinc-500">INVOICE DATE</span>{" "}
            <input
              name="metadata.invoiceDate"
              value={stateObject?.metadata?.invoiceDate || ""}
              onChange={handleChange}
              placeholder="[ invoice date ]"
              onFocus={(e) => e.target.type = "date"}
              onBlur={(e) => e.target.type = "text"}
              className="focus:outline-none border-none w-full font-semibold min-h-6"
              // type="date"
            />
          </div>
          <div>
            <span className="text-zinc-500">DATE OF EXPORT</span>{" "}
            <input
              name="metadata.exportDate"
              value={stateObject?.metadata?.exportDate || ""}
              onChange={handleChange}
              placeholder="[ date of export ]"
              onFocus={(e) => e.target.type = "date"}
              onBlur={(e) => e.target.type = "text"}
              className="focus:outline-none border-none w-full font-semibold "
              // type="date"
            />
          </div>
        </div>
      </div>

      {/* Exporter / Consignee */}
      <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
        {/* Exporter */}
        <table>
          <thead>
            <tr>
              <td
                style={{ backgroundColor: templateThemeColor?.primary?.base}}
                colSpan={2}
                className=" py-2.5 px-3 font-semibold tracking-wide"
              >
                EXPORTER / SHIPPER
              </td>
            </tr>
          </thead>
          <tbody className="[&>*>*]:py- grid grid-cols-[1fr_1.3fr] mt-3 gap-4">
            {[
              { label: "COMPANY NAME:", field: "sender.companyName" },
              { label: "ADDRESS:", field: "sender.address" },
              { label: "CONTACT NAME:", field: "sender.fullName" },
              { label: "PHONE:", field: "sender.phone" },
              { label: "EMAIL:", field: "sender.email" },
              { label: "COUNTRY OF EXPORT:", field: "sender.country" },
            ].map(({ label, field }) => (
              <React.Fragment key={field}>
                <td className="text-zinc-500 pl-3">{label}</td>
                <td>
                  <ResponsiveTextInput
                    name={field}
                    // @ts-ignore
                    value={stateObject?.[field.split(".")[0] as keyof IGlobalInvoice]?.[field.split(".")[1] as any] || ""}
                    onChange={handleChange}
                    placeholder={`[ ${label?.toLowerCase()} ]`}
                    // className="focus:outline-none border-none w-full !min-h-2 !h-full bg-test"
                    className=""
                    type="text"
                  />
                </td>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {/* Consignee */}
        <table>
          <thead>
            <tr>
              <td
                style={{ backgroundColor: templateThemeColor?.primary?.base}}
                colSpan={2}
                className="py-2.5 px-3 font-semibold tracking-wide"
              >
                SHIP TO / CONSIGNEE
              </td>
            </tr>
          </thead>
          <tbody className="grid grid-cols-[1fr_1.3fr] mt-3 gap-4">
            {[
              { label: "COMPANY NAME:", field: "recipient.companyName" },
              { label: "ADDRESS:", field: "recipient.address" },
              { label: "CONTACT NAME:", field: "recipient.fullName" },
              { label: "PHONE:", field: "recipient.phone" },
              { label: "EMAIL:", field: "recipient.email" },
              { label: "COUNTRY OF DESTINATION:", field: "recipient.country" },
            ].map(({ label, field }) => (
              <React.Fragment key={field}>
                <td className="text-zinc-500 pl-3">{label}</td>
                <td>
                  <ResponsiveTextInput
                    name={field}
                    // @ts-ignore
                    value={stateObject?.[field.split(".")[0]]?.[field.split(".")[1]] || ""}
                    onChange={handleChange}
                    placeholder={`[ ${label?.toLowerCase()} ]`}
                    // className="focus:outline-none border-none !min-h-2 !h-3 w-full"
                    className=""
                    type="text"
                  />
                </td>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <section className="w-ful  grid">
      <table cellPadding={10} className="w-full text-left border-collapse mb-8">
        <thead style={{ backgroundColor: templateThemeColor?.primary?.base}} className="">
          <tr className="border-b">
            <th className="py-3.5">Product</th>
            <th className="py-3.5 text-center">Qty</th>
            <th className="py-3.5 text-right">Unit Price</th>
            <th className="py-3.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {stateObject?.lineItems.map((product, index) => (
            <tr key={index} className="border-b">
              <td className="py-3.5 font-semibold">
                <div className="relativ">
                  <ResponsiveTextInput placeholder="[ product name ]" value={product?.title} name={`lineItems.${index}.title`} onChange={(e) => handleInputChange(e, stateObject, setStateObject)} />
                </div>
              </td>
              <td className="py-3.5 text-center">
                <ResponsiveTextInput className="text-center" name={`lineItems.${index}.quantity`} value={splitInThousand(product.quantity)} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} />
              </td>
              <td className="py-3.5 text-center">
                <ResponsiveTextInput className="text-right" name={`lineItems.${index}.unitPrice`} value={splitInThousand(product.unitPrice)} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)} />
              </td>
              <td className="py-3.5 text-right font-semibold relative ">
                <div className=" text-right">
                  <span className="w-max text-right">
                    {currencyMap[stateObject.metadata?.currency?.code as keyof typeof currencyMap]}
                    {splitInThousand(product.total?.toFixed(2))}
                  </span>
                  <div className="absolute h-full w-12 right-0 top-0 translate-x-12 flex gap-1 items-center noExport">
                    <button onClick={() => controls?.removeLineItemAtIndex(index)} className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                    <button onClick={() => controls?.insertLineItemAtIndex(index+1)} className="h-5 w-5 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          <tr className="">
            <td colSpan={3} className="py-2.5 text-zinc-500 text-right">Sub Total:</td>
            <td className="py-2.5 font-bold text-right">
              {currencyMap[stateObject.metadata?.currency?.code as keyof typeof currencyMap]}
              {splitInThousand(stateObject?.subtotal)}
            </td>
          </tr>
          <tr className="">
            <td colSpan={3} className="py-2.5 text-zinc-500 text-right">Discount:</td>
            <td className="py-2.5 font-bold text-right">
              <div className="flex flex-row justify-end">
                {currencyMap[stateObject.metadata?.currency?.code as keyof typeof currencyMap]}
                <ResponsiveTextInput className="!min-w-0 text-right" name="totalDiscount" value={splitInThousand(stateObject?.totalDiscount)} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} />
              </div>
            </td>
          </tr>
          <tr className="border-b-2 border-b-black">
            <td colSpan={3} className="py-2.5 text-zinc-500 text-right">Tax:</td>
            <td className="py-2.5 font-bold text-right">
              <div className="flex flex-row justify-end">
                {currencyMap[stateObject.metadata?.currency?.code as keyof typeof currencyMap]}
                <ResponsiveTextInput className="!min-w-0 text-right" name="totalTax" value={splitInThousand(stateObject?.totalTax)} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} />
              </div>
            </td>
          </tr>
          <tr className="">
            <td colSpan={3} className="py-3.5 text-zinc-700 text-right">Total Value:</td>
            <td className="py-3.5 font-semibold text-right text-2xl">
              {currencyMap[stateObject.metadata?.currency?.code as keyof typeof currencyMap]}
              {splitInThousand(stateObject?.grandTotal?.toFixed(2))}
            </td>
          </tr>
        </tbody>
      </table>
      </section>

      {/* Summary */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex flex-col gap-4 max-w-[300px]">
          <div className="">
            <p className=" px-2.5 py-2" style={{ backgroundColor: templateThemeColor?.primary?.base}}>Total Weight</p>
            <div className="px-2.5 py-2 font-semibold flex flex-row items-center">
              <ResponsiveTextInput placeholder="[ weight ]" name="totalWeight.amount" value={splitInThousand(stateObject?.totalWeight?.amount as number)} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} />
              <FormSelect name="totalWeight.unit" inputClassName="[&_*]:!font-bold &_*]:!ring-none !bg-transparent !border-none [&>*>*]:!hidden [&_*]:!text-black !ring-none !outline-none [&_*]:!outline-none [&_*]:m-0 [&_*]:!p-0 [&]:blur:!border-none [&_*]:!border-none" value={stateObject?.totalWeight?.unit} options={[ { text: "KG", value: "KG" }, { text: "LBS", value: "LBS" } ]} onChange={(e) => handleInputChange(e, stateObject, setStateObject)} />
            </div>
          </div>
          <div>
            <p  className="px-2.5 py-2" style={{ backgroundColor: templateThemeColor?.primary?.base}}>Shipment Terms</p>
            {/* <p className="px-2.5 py-2 font-semibold">{stateObject?.shipmentTerms}</p> */}
            <div className="px-2.5 py-2 font-semibold flex flex-row"><ResponsiveTextInput placeholder="[ shipment terms ]" className="w-full min-w-[160px] max-w-[300px] " name="shipmentTerms" value={stateObject?.shipmentTerms} onChange={(e) => handleInputChange(e, stateObject, setStateObject)} /></div>
          </div>
          {/* <div><p className="font-semibold">Shipment Terms:</p> {additionalInfo.shipmentTerms}</div> */}
        </div>
        <div className="text-right">
          <p className="mb-2">Authorized Signature</p>
          {/* <figure className="bg-zinc-100 h-[100px] aspect-[2/1]">

          </figure> */}
          <PageImage placeholder="Add/drop Signature" height={100} width={200} fileId={fileId} formData={stateObject} setFormData={setStateObject} isLoggedIn={isLoggedIn} imageProperty={stateObject?.branding?.eSignatureUrl as string} propertyKey="branding.eSignatureUrl" />
        </div>
      </div>
    </div>
  );
};

export default Commercial1;