import React from "react";
import { comprehensiveInvoice } from "../globalDummyData";
import { IGlobalInvoice } from "../../_types/types";

interface IProps {
  stateObject: IGlobalInvoice;
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>
}
const Commercial1: React.FC<IProps> = ({ setStateObject, stateObject }) => {

  return (
    <div className="max-w-screen-lg mx-auto py- p-[clamp(16px,6%,80px)] bg-white shadow-md">
      {/* Header */}
      <div className="flex justify-between !items-end border-b pb-4 mb-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-start justify-between gap-3 w-full ">
            <figure className="h-[70px] aspect-square w-[70px] bg-zinc-100 rounded-lg">

            </figure>
            <div className="text-right">
              <h2 className="text-xl font-semibold">{stateObject?.sender.companyName}</h2>
              <p className="text-sm">{stateObject.sender.address}</p>
            </div>
          </div>
          
          <h1 className="text-4xl font-semibold ">Commercial Invoice</h1>
        </div>
        
      </div>

      {/* Invoice Details */}
      <div className="gap-4 mb-10 w-full">
        <div className="flex flex-row justify-between w-full [&>*]:flex [&>*]:flex-col text-sm">
          <p><span className="text-zinc-500">AIRWAY BILL NO.</span> <span className="font-semibold">{stateObject?.metadata?.airwayBillNo}</span> </p>
          <p><span className="text-zinc-500">INVOICE NO.</span> <span className="font-semibold">{stateObject?.metadata?.invoiceId}</span> </p>
          <p><span className="text-zinc-500">INVOICE DATE</span> <span className="font-semibold">{stateObject?.metadata?.invoiceDate}</span> </p>
          <p><span className="text-zinc-500">DATE OF EXPORT</span> <span className="font-semibold">{stateObject?.metadata?.exportDate}</span> </p>
        </div>
      </div>

      {/* Exporter / Consignee */}
      <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
        <table className="">
          <thead>
            <tr>
              <td colSpan={2} className="bg-yellow-500/20 py-2.5 px-3 font-semibold tracking-wide">EXPORTER / SHIPPER</td>
            </tr>
          </thead>
          <tbody className="[&>*>*]:py-3 grid grid-cols-[1fr_1.3fr] mt-3 gap-4">
           <td className="text-zinc-500 pl-3">COMPANY NAME:</td><td className="">{stateObject?.sender.companyName}</td>
           <td className="text-zinc-500 pl-3">ADDRESS:</td><td className="">{stateObject?.sender.address}</td>
           <td className="text-zinc-500 pl-3">CONTACT NAME:</td><td className="">{stateObject?.sender.fullName}</td>
           <td className="text-zinc-500 pl-3">PHONE:</td><td className="">{stateObject?.sender.phone}</td>
           <td className="text-zinc-500 pl-3">EMAIL:</td><td className="">{stateObject?.sender.email}</td>
           <td className="text-zinc-500 pl-3">COUNTRY OF EXPORT:</td><td className="">{stateObject?.sender.country}</td>
          </tbody>
        </table>
        <table className="">
          <thead>
            <tr>
              <td colSpan={2} className="bg-yellow-500/20 py-2.5 px-3 font-semibold tracking-wide">SHIP TO / CONSIGNEE</td>
            </tr>
          </thead>
          <tbody className="[&>*>*]:py-3 grid grid-cols-[1fr_1.3fr] mt-3 gap-4">
            <td className="text-zinc-500 pl-3">COMPANY NAME:</td><td className="">{stateObject.recipient.companyName}</td>
            <td className="text-zinc-500 pl-3">ADDRESS:</td><td className="">{stateObject?.recipient.address}</td>
            <td className="text-zinc-500 pl-3">CONTACT NAME:</td><td className="">{stateObject?.recipient.fullName}</td>
            <td className="text-zinc-500 pl-3">PHONE:</td><td className="">{stateObject?.recipient.phone}</td>
            <td className="text-zinc-500 pl-3">EMAIL:</td><td className="">{stateObject?.recipient.email}</td>
            <td className="text-zinc-500 pl-3">COUNTRY OF DESTINATION:</td><td className="">{stateObject?.recipient.country}</td>
          </tbody>
        </table>
      </div>

      {/* Product Table */}
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
              <td className="py-3.5 font-semibold">{product.description}</td>
              <td className="py-3.5 text-center">{product.quantity}</td>
              <td className="py-3.5 text-right">${product.unitPrice.toFixed(2)}</td>
              <td className="py-3.5 text-right font-semibold">${product.total.toFixed(2)}</td>
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
            <td className="py-3.5 font-semibold text-right text-3xl">${stateObject?.grandTotal.toFixed(2)}</td>
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