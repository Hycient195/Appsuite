import React, { ChangeEvent } from "react";
import { IGlobalInvoice } from "../../_types/types";
import { handleInputChange, splitInThousand } from "@/utils/miscelaneous";
import useInvoiceManager from "../../_hooks/useInvoiceManager";

interface IProps {
  stateObject: IGlobalInvoice;
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>;
  controls: ReturnType<typeof useInvoiceManager>
}

const Commercial1: React.FC<IProps> = ({ setStateObject, stateObject, controls }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, stateObject, setStateObject);

  return (
    <div className="max-w-screen-lg mx-auto p-[clamp(16px,6%,80px)] bg-white shadow-md">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-4 mb-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-start justify-between gap-3 w-full">

            <figure className="h-[70px] aspect-square w-[70px] bg-zinc-100 rounded-lg"></figure>
            
            <div className="text-right">
              <h2 className="text-xl font-semibold">
                <input
                  name="sender.companyName"
                  value={stateObject?.sender?.companyName || ""}
                  onChange={handleChange}
                  className="focus:outline-none border-none text-right"
                  type="text"
                />
              </h2>
              <input
                name="sender.address"
                value={stateObject?.sender?.address || ""}
                onChange={handleChange}
                className="focus:outline-none border-none text-sm text-right"
                type="text"
              />
            </div>
          </div>
          <h1 className="text-4xl font-semibold">Commercial Invoice</h1>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="gap-4 mb-10 w-full">
        <div className="flex flex-row justify-between w-full [&>*]:flex [&>*]:flex-col text-sm">
          <div>
            <span className="text-zinc-500">AIRWAY BILL NO.</span>{" "}
            <input
              name="metadata.airwayBillNo"
              value={stateObject?.metadata?.airwayBillNo || ""}
              onChange={handleChange}
              className="focus:outline-none border-none font-semibold"
              type="text"
            />
          </div>
          <div>
            <span className="text-zinc-500">INVOICE NO.</span>{" "}
            <input
              name="metadata.invoiceId"
              value={stateObject?.metadata?.invoiceId || ""}
              onChange={handleChange}
              className="focus:outline-none border-none font-semibold"
              type="text"
            />
          </div>
          <div>
            <span className="text-zinc-500">INVOICE DATE</span>{" "}
            <input
              name="metadata.invoiceDate"
              value={stateObject?.metadata?.invoiceDate || ""}
              onChange={handleChange}
              className="focus:outline-none border-none font-semibold"
              type="date"
            />
          </div>
          <div>
            <span className="text-zinc-500">DATE OF EXPORT</span>{" "}
            <input
              name="metadata.exportDate"
              value={stateObject?.metadata?.exportDate || ""}
              onChange={handleChange}
              className="focus:outline-none border-none font-semibold "
              type="date"
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
                colSpan={2}
                className="bg-yellow-500/20 py-2.5 px-3 font-semibold tracking-wide"
              >
                EXPORTER / SHIPPER
              </td>
            </tr>
          </thead>
          <tbody className="[&>*>*]:py-3 grid grid-cols-[1fr_1.3fr] mt-3 gap-4">
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
                  <input
                    name={field}
                    // @ts-ignore
                    value={stateObject?.[field.split(".")[0] as keyof IGlobalInvoice]?.[field.split(".")[1] as any] || ""}
                    onChange={handleChange}
                    placeholder={`[ ${label?.toLowerCase()} ]`}
                    className="focus:outline-none border-none w-full !min-h-2 !h-3"
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
                colSpan={2}
                className="bg-yellow-500/20 py-2.5 px-3 font-semibold tracking-wide"
              >
                SHIP TO / CONSIGNEE
              </td>
            </tr>
          </thead>
          <tbody className="[&>*>*]:py-3 grid grid-cols-[1fr_1.3fr] mt-3 gap-4">
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
                  <input
                    name={field}
                    // @ts-ignore
                    value={stateObject?.[field.split(".")[0]]?.[field.split(".")[1]] || ""}
                    onChange={handleChange}
                    placeholder={`[ ${label?.toLowerCase()} ]`}
                    className="focus:outline-none border-none !min-h-2 !h-3 w-full"
                    type="text"
                  />
                </td>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <table cellPadding={10} className="w-full text-left border-collapse mb-8">
        <thead className="bg-yellow-500/20">
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
                <input className="" placeholder="[ product name ]" value={product.description} name={`lineItems.${index}.description`} onChange={(e) => handleInputChange(e, stateObject, setStateObject)} type="text" />
              </td>
              <td className="py-3.5 text-center">
                <input className="!w-full text-center" name={`lineItems.${index}.quantity`} value={product.quantity} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} />
              </td>
              <td className="py-3.5 text-center">
                <input className="!w-full text-right" name={`lineItems.${index}.unitPrice`} value={splitInThousand(product.unitPrice)} onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)} onBlur={(e) => controls.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)} />
              </td>
              {/* <td className="py-3.5 text-right">${product.unitPrice.toFixed(2)}</td> */}
              {/* <td className="py-3.5 text-right">{stateObject?.lineItems[index]?.total?.toFixed(2)}</td> */}
              <td className="py-3.5 text-right font-semibold relative">
                <span className="">${splitInThousand(product.total?.toFixed(2))}</span>
                <div className="absolute h-full w-12 right-0 top-0 translate-x-12 flex gap-1 items-center noExport">
                  <button onClick={() => controls.removeLineItemAtIndex(index)} className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                  <button onClick={() => controls.insertLineItemAtIndex(index+1)} className="h-5 w-5 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
                </div>
              </td>
            </tr>
          ))}
          <tr className="">
            <td colSpan={2} className=""></td>
            <td className="py-2.5 text-zinc-500 text-right">Sub Total:</td>
            <td className="py-2.5 font-bold text-right">${stateObject?.subtotal?.toFixed(2)}</td>
          </tr>
          <tr className="">
            <td colSpan={2} className=""></td>
            <td className="py-2.5 text-zinc-500 text-right">Discount:</td>
            <td className="py-2.5 font-bold text-right">${stateObject?.totalDiscount.toFixed(2)}</td>
          </tr>
          <tr className="border-b-2 border-b-black">
            <td colSpan={2} className=""></td>
            <td className="py-2.5 text-zinc-500 text-right">Tax:</td>
            <td className="py-2.5 font-bold text-right">${stateObject?.totalTax.toFixed(2)}</td>
          </tr>
          <tr className="">
            <td colSpan={2} className=""></td>
            <td className="py-3.5 text-zinc-700 text-right">Total Value:</td>
            <td className="py-3.5 font-semibold text-right text-3xl">${splitInThousand(stateObject?.grandTotal?.toFixed(2))}</td>
          </tr>
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex flex-col gap-4">
          <div><p className="f bg-yellow-500/20 px-2.5 py-2">Total Weight</p> <p className="px-2.5 py-2 font-semibold">{stateObject?.totalWeight?.amount}{stateObject?.totalWeight?.unit}</p></div>
          <div><p className="f bg-yellow-500/20 px-2.5 py-2">Shipment Terms</p> <p className="px-2.5 py-2 font-semibold">{stateObject?.shipmentTerms}</p></div>
          {/* <div><p className="font-semibold">Shipment Terms:</p> {additionalInfo.shipmentTerms}</div> */}
        </div>
        <div className="text-right">
          <p>Authorized Signature</p>
          <figure className="bg-zinc-100 h-[100px] aspect-[2/1]">

          </figure>
        </div>
      </div>

    </div>
  );
};

export default Commercial1;