import React, { ChangeEvent, useEffect } from "react";
import { IGlobalInvoice } from "../../_types/types";
import useInvoiceManager from "../../_hooks/useInvoiceManager";
import { useThemeContext } from "../../_contexts/themeContext";
import { FormSelect, ResponsiveTextInput } from "@/sharedComponents/FormInputs";
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

export default function Commercial2({ templateId, setStateObject, stateObject, controls, isLoggedIn = false, fileId, isPreview }: InvoiceProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, stateObject, setStateObject);

  const themes = [
    {
      display: "#141414",
      primary: {
        darkest: "#141414",
        lightest: "rgb(244 244 245 / 0.3)"
      }
    },
    {
      display: "rgb(15 118 110)",
      primary: {
        darkest: "rgb(15 118 110)",
        lightest: "rgb(15 118 110 / 0.1)"
      }
    },
  ]

  const { registerTemplate, getSelectedTheme } = useThemeContext();

  useEffect(() => {
    registerTemplate(templateId, themes);
  }, [templateId, themes]);

  const templateThemeColor = isPreview ? getSelectedTheme(templateId) : stateObject?.branding?.themeColor;

  return (
    <div className="flex flex-col bg-white">
      <div className="w-full max-md:max-w-full">
        <div className="flex max-md:flex-col">
          <div className="flex  flex-col w-[28%] max-md:ml-0 max-md:w-full">
            <div style={{ backgroundColor: templateThemeColor?.primary?.darkest }} className="flex flex-col items-start px-7 py-10 mx-auto w-full min-h-full max-md:px-5 max-md:pt-24">
              <PageImage className="mx-auto" width={80} placeholder="Add/drop Logo" fileId={fileId} formData={stateObject} setFormData={setStateObject} imageProperty={stateObject?.branding?.logoUrl as string} propertyKey="branding.logoUrl" />

              <div className="self-center mt-4 text-xl tracking-wider text-zinc-100">
              <ResponsiveTextInput
                onChange={handleChange}
                name="sender.companyName"
                placeholder="[ brand name ]"
                value={stateObject.sender.companyName}
                className="text-center"
              />
              </div>
              <div className="self-center mt-2 text-sm text-zinc-100 tracking-[8.33px]">
              <ResponsiveTextInput
                onChange={handleChange}
                name="sender.companyBusinessType"
                placeholder="[BRAND TYPE]"
                value={stateObject.sender.companyBusinessType}
                className="text-center"
              />
                {/* INNOVATIONS */}
              </div>
              <div className="mt-8 text-sm tracking-wider text-white max-md:mt-10">
                BILLING TO :
              </div>
              <div className="mt-3 mr-5 text-sm tracking-wide text-white max-md:mr-2.5">
              <ResponsiveTextInput
                  onChange={handleChange}
                  name="recipient.companyName"
                  placeholder="[ recipient brand name ]"
                  value={stateObject.recipient.companyName}
                />
                <span className="text-neutral-400">
                  <ResponsiveTextInput
                  onChange={handleChange}
                  name="recipient.fullName"
                  placeholder="[ receiver's name ]"
                  value={stateObject.recipient.fullName}
                /></span>
              </div>
              <div className="text-sm tracking-wide text-neutral-400">
              <ResponsiveTextInput
                  onChange={handleChange}
                  name="recipient.address"
                  placeholder="[ receiver's address ]"
                  value={stateObject.recipient.address}
                />
              </div>
              <div className="mt-2.5 grid grid-cols-[10px_1fr] items-center gap-x-2 text-sm tracking-wide text-white">
                P: <span className="text-neutral-400"> <ResponsiveTextInput
                onChange={handleChange}
                name="sender.phone"
                placeholder="[ phone ]"
                value={stateObject.sender.phone}
                href={`tel:${stateObject?.sender?.phone}`}
                target='_blank'
                rel='no-referrer'
                /></span>
                E: <span className="text-neutral-400"><ResponsiveTextInput
                onChange={handleChange}
                name="sender.email"
                placeholder="[ email address ]"
                value={stateObject.sender.email}
                href={`mailto:${stateObject?.sender?.email}`}
                target='_blank'
                rel='no-referrer'
                /></span>
                W: <span className="text-neutral-400 ml-1"><ResponsiveTextInput
                onChange={handleChange}
                name="sender.website"
                placeholder="[ www.website.com ]"
                value={stateObject.sender.website}
                href={stateObject.sender.website}
                target='_blank'
                rel='no-referrer'
                /></span>
              </div>
              <div className="mt-8 text-sm tracking-wider text-white max-md:mt-10">
                INVOICE DETAILS
              </div>
              <div className="mt-2 text-sm tracking-wide text-white">
                Invoice no.
                <br />
                <span className="text-neutral-400"><ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceId"
              placeholder="[ IN***** ]"
              value={stateObject.metadata.invoiceId}
            /></span>
              </div>
              <div className="mt-2 text-sm tracking-wide text-white">
                Invoice date
                <span className="text-neutral-400"><ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceDate"
              placeholder="[ date ]"
              value={stateObject.metadata.invoiceDate}
            /></span>
              </div>
              <div className="mt-2 text-sm tracking-wide text-white">
                Customer id
                <br />
                <span className="text-neutral-400"> <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.customerId"
              placeholder="[ customer ID ]"
              value={stateObject.metadata.customerId}
            /></span>
              </div>
              <div className="shrink-0 mt-6 h-0.5 border-2 border-solid border-neutral-400 w-[50px] max-md:mt-10" />
              <div className="mt-6 text-sm tracking-wider text-white max-md:mt-10">
                COMPANY DETAILS :
              </div>
              <div className="mt-1.5 text-sm tracking-wide text-white max-md:mr-2.5">
              <ResponsiveTextInput
                onChange={handleChange}
                name="sender.companyName"
                placeholder="[ sender company ]"
                value={stateObject.sender.address}
                className='text-left'
              />

              </div>
              <div className="self-stretch text-sm tracking-wide text-neutral-400 ">
              <ResponsiveTextInput
                onChange={handleChange}
                name="sender.address"
                placeholder="[ sender address ]"
                value={stateObject.sender.address}
                className='text-left'
              />
              </div>
              <div className="mt-2 text-sm tracking-wide text-white">
                GSTIN: <span className="text-neutral-400"><ResponsiveTextInput
                onChange={handleChange}
                name="paymentDetails?.bankDetails.gstin"
                placeholder="[ GSTIN ]"
                value={stateObject.paymentDetails?.bankDetails?.gstin}
                className='text-left'
              /></span>
              </div>
              <div className="mt-8 font-semibold text-sm tracking-wider text-white max-md:mt-10">
                PAYMENT DETAILS :
              </div>
              

              <div className="self-stretch flex flex-col gap-2 mt-1 text-sm tracking-wide text-white">
                <div className="flex flex-row gap-1 text-neutral-400 items-center">
                  <span className="text-white">UPI: :</span>
                  <ResponsiveTextInput
                    onChange={handleChange}
                    name="paymentDetails.bankDetails.upi"
                    placeholder="[ UPI ]"
                    value={stateObject.paymentDetails.bankDetails?.upi}
                    className='text-left'
                  />
                </div>
               <span className="font-medium">Bank Transfer:</span>
                <div className="flex flex-row gap-1 text-neutral-400 items-center">
                  <span className="text-white">Name:</span>
                  <ResponsiveTextInput
                    onChange={handleChange}
                    name="paymentDetails.bankDetails.accountName"
                    placeholder="[ account name ]"
                    value={stateObject.paymentDetails.bankDetails?.accountName}
                    className='text-left'
                  />
                </div>

                <div className="flex flex-row gap-1 text-neutral-400 items-center">
                  <span className="text-white">A/C no :</span>
                  <ResponsiveTextInput
                    onChange={handleChange}
                    name="paymentDetails.bankDetails.accountNumber"
                    placeholder="[ account number ]"
                    value={stateObject.paymentDetails.bankDetails?.accountNumber}
                    className='text-left'
                  />
                </div>
                <div className="flex flex-row gap-1 text-neutral-400 items-center">
                  <span className="text-white">Bank Name :</span>
                  <ResponsiveTextInput
                    onChange={handleChange}
                    name="paymentDetails.bankDetails.bankName"
                    placeholder="[ bank name ]"
                    value={stateObject.paymentDetails.bankDetails?.bankName}
                    className='text-left'
                  />
                </div>
                <div className="flex flex-row gap-1 text-neutral-400 items-center">
                  <span className="text-white"> IFSC CODE :</span>
                  <ResponsiveTextInput
                    onChange={handleChange}
                    name="paymentDetails.bankDetails.IFSCCode"
                    placeholder="[ IFSC code ]"
                    value={stateObject.paymentDetails.bankDetails?.IFSCCode}
                    className='text-left'
                  />
                </div>
                <PageImage className="mt-3" width={80} placeholder="Add/drop QR Code" fileId={fileId} formData={stateObject} setFormData={setStateObject} imageProperty={stateObject?.branding?.logoUrl as string} propertyKey="branding.qrCodeUrl" />

              </div>
            </div>
          </div>
          
          <div className="flex flex-col w-[72%] max-md:ml-0 max-md:w-full">
          <div className="pt-3  w-full  max-md:pt-8 max-md:max-w-full">
            <div className="flex flex-col p-[clamp(16px,5%,100px)] w-full max-md:px-5 max-md:max-w-full">
              {/* Header Section */}
              <div className="self-start ml-5 text-5xl font-semibold text-neutral-800 tracking-[9px] max-md:ml-2.5 max-md:text-4xl">
                INVOICE
              </div>
              <div className="shrink-0 mt-1.5 ml-5 h-0.5 border-2 border-solid border-neutral-800 w-[49px] max-md:ml-2.5" />

              {/* Table Section */}
              <table style={{ backgroundColor: templateThemeColor?.primary?.lightest }} className="w-full mt-16 text-left border-collapse  text-neutral-800 max-md:mt-10 max-md:max-w-full">
                <thead>
                  <tr className="text-xl tracking-wider whitespace-nowrap">
                    <th className="px-3 py-4">Descriptions</th>
                    <th className="px-3 py-4">Rate</th>
                    <th className="px-3 py-4">Qty</th>
                    <th className="px-3 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stateObject.lineItems.map((item, index) => (
                    <tr key={`line-item-${index}`} className="bg-white [&>*]:border-t [&>*]:border-t-zinc-200 text-sm tracking-wide text-neutral-800">
                      <td className="px-3 py-4">
                        <div className="flex flex-col">
                          <ResponsiveTextInput
                            onChange={handleChange}
                            name={`lineItems.${index}.title`}
                            placeholder="[ item title ]"
                            value={item.title}
                            className="font-medium"
                          />
                          <ResponsiveTextInput
                            onChange={handleChange}
                            name={`lineItems.${index}.description`}
                            placeholder="[ item description ]"
                            value={item.description}
                            className="font-medium text-xs text-zinc-500"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex relative font-medium items-center gap-0.5">
                          <ResponsiveTextInput
                            onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
                            name={`lineItems.${index}.unitPrice`}
                            placeholder="[  ]"
                            value={splitInThousand(item.unitPrice)}
                            className="text-right text-zinc-600"
                            onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)}
                          />
                          <div className="relative">
                            <span className={`${item?.billedPer && "noExport"} absolute`}>{item.billedPer}</span>
                            <FormSelect name={`lineItems.${index}.billedPer`} inputClassName="noExport [&_*]:!font-bold &_*]:!ring-none !bg-transparent !border-none [&>*>*]:!hidden [&_*]:!text-black !ring-none !outline-none [&_*]:!outline-none [&_*]:m-0 [&_*]:!p-0 [&]:blur:!border-none [&_*]:!border-none" value={stateObject?.lineItems[index]?.billedPer} options={[ { text: "Per?", value: "" }, { text: "Hr", value: "Hr" }, { text: "Day", value: "Day" } ]} onChange={(e) => handleInputChange(e, stateObject, setStateObject)} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1.5">
                          <ResponsiveTextInput
                            onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
                            name={`lineItems.${index}.quantity`}
                            placeholder="[  ]"
                            value={splitInThousand(item.quantity)}
                            className="text-right text-zinc-600"
                          />
                          {item?.billedPer && item?.billedPer}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-right relative">
                        {stateObject.metadata.currency.symbol}{splitInThousand(item.total)}
                        <div className="absolute  h-full w-12 -right-1 top-0 translate-x-12 flex gap-1 items-center noExport">
                          <button onClick={() => controls?.removeLineItemAtIndex(index)} className="h-5 w-5 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                          <button onClick={() => controls?.insertLineItemAtIndex(index+1)} className="h-5 w-5 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-white border-y-2 border-y-zinc-500">
                  <tr className="bg-white [&>*]:border-b-2 [&>*]:border-b-zinc-500 text-sm tracking-wide text-neutral-800">
                    <td colSpan={2} className="px-3 text-left py-4">
                      <div className="flex flex-col items-start">
                        <p className="text-zinc-700 font-semibold">Sub Total</p>
                        <div className="flex mt-2 flex-row gap-1 text-zinc-500 items-center justify-end">
                          Tax:
                          <ResponsiveTextInput type="number" max={100} placeholder="[ vat ] !min-w-[20px]" onChange={(e) => controls?.updateVat("rate", e.target.value)} name="valueAddedTax.rate" value={stateObject?.valueAddedTax?.rate} className="text-right " />%
                        </div>
                      </div>
                    </td>
                    
                    <td colSpan={2} className="px-3 py-4 text-right">
                      <div className="flex flex-col">
                        <span className="font-semibold">{stateObject.metadata.currency.symbol}{splitInThousand(stateObject?.subtotal)}</span>
                        <div className="flex mt-2 flex-row gap-1 items-center text-right justify-end">
                          {stateObject.metadata.currency.symbol}
                          <ResponsiveTextInput placeholder="[tax]" onChange={(e) => controls?.updateVat("amount", e.target.value)} name="valueAddedTax.amount" value={splitInThousand(stateObject?.valueAddedTax?.amount)} className="text-right" />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={3} className="px-3 py-4 font-semibold text-lg text-neutral-800">
                      GRAND TOTAL
                    </td>
                    <td className="px-3 py-4 text-right font-semibold">
                      {/* Rs. 59,000 */}
                      <div className="flex flex-row justify-end items-center gap-1">
                        <div>{stateObject.metadata.currency.code}</div>
                        <div>{splitInThousand(stateObject.grandTotal)}</div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Footer Section */}
              <div className="">
                <PageImage className="ml-auto mt-5"placeholder="Add/drop Signature" height={100} width={200} fileId={fileId} formData={stateObject} setFormData={setStateObject} imageProperty={stateObject?.branding?.eSignatureUrl as string} propertyKey="branding.eSignatureUrl" />
              </div>
              <div className="self-end mt-3.5 text-lg tracking-wide text-neutral-800 max-md:mr-2.5">
                {/* Deepak Yadav */}
                <ResponsiveTextInput
                  onChange={handleChange}
                  name="sender.fullName"
                  placeholder="[ sender name ]"
                  value={stateObject.sender.fullName}
                />
              </div>
              <div className="self-end text-sm tracking-wide text-neutral-500 max-md:mr-2.5">
                {/* Director */}
                <ResponsiveTextInput
                  onChange={handleChange}
                  name="sender.position"
                  placeholder="[ position/office ]"
                  value={stateObject.sender.position}
                />
              </div>
            </div>

            {/* Terms and Conditions Section */}
            <div className="flex flex-col px-[clamp(16px,4%,80px)] pb-[clamp(16px,4%,80px)] w-full text-sm max-md:px-5 max-md:mt-10 max-md:max-w-full">
              <div className={`${!stateObject.notes?.termsAndConditions && "noExport"} self-start text-lg tracking-wide text-neutral-800`}>Terms & conditions</div>
              <div className={`${!stateObject.notes?.termsAndConditions && "noExport"} mt-1.5 tracking-wide text-neutral-500 max-md:mr-1.5 max-md:max-w-full`}>
                <ResponsiveTextInput
                  onChange={handleChange}
                  name="notes.termsAndConditions"
                  placeholder="[ terms and conditions ]"
                  value={stateObject.notes?.termsAndConditions || ""}
                  className="text-zinc-700 text-justify"
                />
              </div>
              <div className="shrink-0 mt-5 h-px border border-black border-solid w-full" />
              <div className="flex gap-10 mt-5 tracking-wide text-neutral-400">
                <div className="w-full"><ResponsiveTextInput
                onChange={handleChange}
                name="sender.phone"
                placeholder="[ phone number ]"
                value={stateObject.sender.phone}
                href={`tel:${stateObject?.sender?.phone}`}
                target='_blank'
                rel='no-referrer'
                /></div>
                <div className="w-full"><ResponsiveTextInput
                onChange={handleChange}
                name="sender.email"
                placeholder="[ email address ]"
                value={stateObject.sender.email}
                href={`mailto:${stateObject?.sender?.email}`}
                className="text-center"
                target='_blank'
                rel='no-referrer'
                /></div>
                <div className="w-full"> <ResponsiveTextInput
                onChange={handleChange}
                name="sender.website"
                placeholder="[ www.website.com ]"
                value={stateObject.sender.website}
                href={stateObject.sender.website}
                className="text-right"
                target='_blank'
                rel='no-referrer'
                /></div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// {/* <div className="table flex-col grow pt-20 pb-12 w-full bg-stone-50 max-md:pt-24 max-md:max-w-full">
//               <div className="flex flex-col px-12 w-full max-md:px-5 max-md:max-w-full">
//                 <div className="self-start ml-5 text-5xl font-semibold text-neutral-800 tracking-[9px] max-md:ml-2.5 max-md:text-4xl">
//                   INVOICE
//                 </div>
//                 <div className="shrink-0  mt-1.5 ml-5 h-0.5 border-2 border-solid border-neutral-800 w-[49px] max-md:ml-2.5" />
//                 <div className="table">
//                   <div className="table-row gap-10 px-3 py-4 mt-16 text-xl tracking-wider whitespace-nowrap bg-gray-200 text-neutral-800 max-md:mt-10 max-md:max-w-full">
//                     <div className="table-cell">Descriptions</div>
//                     <div className="table-cell">Rate</div>
//                     <div className="table-cell">Qty</div>
//                     <div className="table-cell text-right">Total</div>
//                   </div>

//                   {
//                   stateObject.lineItems.map((item, index) => (
//                     <div className="table-row"  key={`line-item-${index}`}>
//                       <div className="self-start table-cell text-sm tracking-wide text-neutral-800">
//                           <div className="flex flex-col gap">
//                             <ResponsiveTextInput
//                               onChange={handleChange}
//                               name={`lineItems.${index}.title`}
//                               placeholder="[ item title ]"
//                               value={item.title}
//                               className='font-medium'
//                             />
//                             <ResponsiveTextInput
//                               onChange={handleChange}
//                               name={`lineItems.${index}.description`}
//                               placeholder="[ item description ]"
//                               value={item.description}
//                               className='font-medium'
//                             />
//                             </div>
//                           </div>
//                           {/* <div className="table-cell text-xs tracking-wide text-neutral-500">
                         
//                         </div> */}
//                         <div className="table-cell">
//                           <div className="flex flex-row relative">
//                             <ResponsiveTextInput
//                               onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
//                               name={`lineItems.${index}.unitPrice`}
//                               placeholder="[  ]"
//                               value={splitInThousand(item.unitPrice)}
//                               className="text-right text-zinc-600"
//                               onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)}
//                             /> 
//                             <FormSelect name={`lineItems.${index}.billedPer`} inputClassName="[&_*]:!font-bold &_*]:!ring-none !bg-transparent !border-none [&>*>*]:!hidden [&_*]:!text-black !ring-none !outline-none [&_*]:!outline-none [&_*]:m-0 [&_*]:!p-0 [&]:blur:!border-none [&_*]:!border-none" value={stateObject?.lineItems[index]?.billedPer} options={[ { text: "Per?", value: "" }, { text: "Hr", value: "Hr" }, { text: "Day", value: "Day" } ]} onChange={(e) => handleInputChange(e, stateObject, setStateObject)} />

//                           </div>
//                         </div>
//                         <div className="table-cell">
//                         <div className="table-cell flex-row items-center gap-1.5">
//                           <ResponsiveTextInput
//                             onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
//                             name={`lineItems.${index}.quantity`}
//                             placeholder="[  ]"
//                             value={splitInThousand(item.quantity)}
//                             className="text-right text-zinc-600"
//                           />
//                             { item?.billedPer && item?.billedPer }
//                           </div>
//                         </div>
//                         <div className="table-cell">
//                         {stateObject.metadata.currency.symbol} {splitInThousand(item.total)}

//                         </div>
//                     </div>
//                   ))
//                 }
//                 </div>
                
                
               
                
//                 {/* <div className="shrink-0 mx-3 mt-6 max-w-full h-px border border-solid border-neutral-800 w-[681px] max-md:mr-2.5" /> */}

//                 <div className="flex flex-wrap gap-5 justify-between mx-3 mt-3 text-lg tracking-wide text-neutral-800 max-md:mr-2.5 max-md:max-w-full">
//                   <div>GRAND TOTAL</div>
//                   <div className="text-right">Rs. 59,000</div>
//                 </div>
//                 <div className="shrink-0 mx-3 mt-3 max-w-full h-px border border-solid border-neutral-800 w-[681px] max-md:mr-2.5" />

//                 <PageImage className="ml-auto mt-5"placeholder="Add/drop Signature" height={100} width={200} fileId={fileId} formData={stateObject} setFormData={setStateObject} imageProperty={stateObject?.branding?.eSignatureUrl as string} propertyKey="branding.eSignatureUrl" />

//                 <div className="self-end mt-3.5 text-lg tracking-wide text-neutral-800 max-md:mr-2.5">
//                   Deepak Yadav
//                 </div>
//                 <div className="self-end text-sm tracking-wide text-neutral-500 max-md:mr-2.5">
//                   Director
//                 </div>
//               </div>
//               <div className="flex flex-col px-16 mt-24 w-full text-sm max-md:px-5 max-md:mt-10 max-md:max-w-full">
//                 <div className="self-start text-lg tracking-wide text-neutral-800">
//                   Terms & conditions
//                 </div>
//                 <div className="mt-1.5 tracking-wide text-neutral-500 max-md:mr-1.5 max-md:max-w-full">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Ut enim ad minim veniam, quis nostrud.
//                 </div>
//                 <div className="shrink-0 mt-5 max-w-full h-px border border-black border-solid w-[678px]" />
//                 <div className="flex flex-wrap gap-10 mt-5 tracking-wide whitespace-nowrap text-neutral-400 max-md:max-w-full">
//                   <div className="grow shrink w-[100px]">+91-97-2907-2096</div>
//                   <div className="grow shrink w-[179px]">
//                     deepak@parallelconnect.com
//                   </div>
//                   <div className="grow shrink w-[151px]">
//                     www.parallelconnect.com
//                   </div>
//                 </div>
//               </div>
//             </div> */}