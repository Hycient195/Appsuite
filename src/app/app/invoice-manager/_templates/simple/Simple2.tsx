import * as React from 'react';
import { IGlobalInvoice } from '../../_types/types';
import useInvoiceManager from '../../_hooks/useInvoiceManager';
import { comprehensiveInvoice } from '../globalDummyData';
import PageImage from '@/sharedComponents/PageImage';
import { handleInputChange, splitInThousand } from '@/utils/miscelaneous';
import { useThemeContext } from '../../_contexts/themeContext';
import { ResponsiveTextInput } from '@/sharedComponents/FormInputs';

interface InvoiceProps {
  templateId: string;
  stateObject: IGlobalInvoice;
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>;
  controls?: ReturnType<typeof useInvoiceManager>;
  isLoggedIn?: boolean;
  fileId? : string
  isPreview?: boolean
}

const Simple2:React.FC<InvoiceProps> = ({ templateId, setStateObject, stateObject, controls, isLoggedIn = false, fileId, isPreview }) => {
  const formatCurrency = (amount: number): string => {
    return `${stateObject.metadata.currency.symbol}${splitInThousand(amount)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, stateObject, setStateObject);

  const themes = [
    {
      display: "#4C63ED",
      primary: {
        base: "#4C63ED",
        lightest: "#F9FAFC"
      },

    },
    {
      display: "#E87117",
      primary: {
        base: "#E87117",
        lightest: "rgb(250 250 250 / 0.7)"
      },
    },
  ]

  const { registerTemplate, getSelectedTheme } = useThemeContext();

  React.useEffect(() => {
    registerTemplate(templateId, themes);
  }, [templateId, themes]);

  // const templateThemeColor =  getSelectedTheme(templateId)
  const templateThemeColor = isPreview ? getSelectedTheme(templateId) : stateObject?.branding?.themeColor;


  return (
    <main className={`flex overflow-hidden flex-col bg-white ${isPreview && ""}`}>
      <header style={{ backgroundColor: templateThemeColor?.primary?.lightest}} className="flex  overflow-hidden flex-wrap gap-10 p-[clamp(16px,5%,100px)] w-full border-solid  border-b-[0.5px] border-b-gray-300 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col flex-1">
          <h1 className="text-3xl font-semibold leading-none uppercase whitespace-nowrap text-zinc-900">
            INVOICE
          {/* <ResponsiveTextInput
            onChange={handleChange}
            name="metadata.title"
            placeholder="[  ]"
            value={stateObject.metadata?.title || "INVOICE"}
            className='!bg-transparent'
          /> */}
          </h1>
          <section className="flex flex-col self-start mt-8 text-base">
            <h2 className="font-semibold leading-snug text-zinc-900">
              Billed to
            </h2>
            <address className="flex flex-col mt-1 text-gray-500 not-italic">
              <div className="font-semibold leading-snug">
                <ResponsiveTextInput
                  onChange={handleChange}
                  name="recipient.companyName"
                  placeholder="[ brand name ]"
                  value={stateObject.recipient.companyName}
                />
              </div>
              <div className="leading-4">
                <ResponsiveTextInput
                  onChange={handleChange}
                  name="recipient.address"
                  placeholder="[ brand address ]"
                  value={stateObject.recipient.address}
                />
              </div>
            </address>
          </section>
        </div>
        <div className="flex flex-col max-w-[18rem] flex-1">
          <div style={{ color: templateThemeColor?.primary?.base }} className="flex flex-col items-end pl- text-base gap-1 leading-none  max-md:pl-5">
            <div className="w-[80px] h-[70px] flex justify-end">
              <PageImage width={80} placeholder="Add/drop Logo" fileId={fileId} formData={stateObject} setFormData={setStateObject} isLoggedIn={isLoggedIn} imageProperty={stateObject?.branding?.logoUrl as string} propertyKey="branding.logoUrl" />
            </div>
            <div className="mt-2 font-bold">
              <ResponsiveTextInput
                onChange={handleChange}
                name="sender.companyName"
                placeholder="[ business name ]"
                value={stateObject.sender.companyName}
                
                className='placeholder:text-indigo-300'
              />
            </div>
          </div>
          <address className="flex flex-col items-end text-sm text-right text-gray-500 not-italic">
            <div className="leading-">
            <ResponsiveTextInput
                onChange={handleChange}
                name="sender.address"
                placeholder="[ business address ]"
                value={stateObject.sender.address}
                className='text-right'
              />
            </div>
            <div className="leading-snug flex items-center gap-1">
            TAX ID
            <ResponsiveTextInput
          onChange={handleChange}
          name="sender.taxIdentificationNumber"
          placeholder="[ tax ID ]"
          value={stateObject.sender.taxIdentificationNumber}
        />
              {/* {stateObject.sender.taxIdentificationNumber && `TAX ID ${stateObject.sender.taxIdentificationNumber}`} */}
            </div>
          </address>
        </div>
      </header>

      <section className="grid grid-cols-[16%_82%] gap-[2%] p-[clamp(16px,5%,100px)] self-center w-full  text-base leading-snug max-md:max-w-full">
        <div className="flex text-sm h-max flex-col justify-between  w-f font-medium">
          <div className="flex flex-col ">
            <div className="text-zinc-900">Invoice #</div>
            <div className="text-gray-400 break-kee">
              <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceId"
              placeholder="[ IN***** ]"
              value={stateObject.metadata.invoiceId}
            />
          </div>
          </div>
          <div className="flex flex-col mt-10 ">
            <div className="text-zinc-900 break-keep">Invoice date</div>
            <div className="text-gray-400">
            <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.invoiceDate"
              placeholder="[ date ]"
              value={stateObject.metadata.invoiceDate}
            />
            </div>
          </div>
          <div className="flex flex-col mt-10  whitespace-nowrap">
            <div className="text-zinc-900">Reference</div>
            <ResponsiveTextInput
              onChange={handleChange}
              name="metadata.purchaseOrderNumber"
              placeholder="[ reference ]"
              value={stateObject.metadata.purchaseOrderNumber}
            />
            {/* <div className="text-gray-400">{stateObject.metadata.purchaseOrderNumber}</div> */}
          </div>
          <div className="flex flex-col mt-10 ">
            <div className="text-zinc-900">Due date</div>
            <div className="text-gray-400">
            <ResponsiveTextInput
              onChange={handleChange}
              name="paymentDetails.dueDate"
              placeholder="[ date ]"
              value={stateObject.paymentDetails.dueDate}
            />
            </div>
          </div>
        </div>

        <article className="table [&>*>*]:p-3 overflow-hidde flex-col self-start rounded-xl border-gray-300 border-solid border-[0.5px] min-w-[240px] ">
          {/* <div className="table gap- justify-between mx-3 font-semibold text-zinc-900 max-md:mx-2.5">
            
          </div> */}
          
          <div className="table-row font-bold gap-10">
            <div className='table-cell'>Services</div>
            <div className='table-cell text-right'>Qty</div>
            <div className='table-cell text-right'>Rate</div>
            <div className='table-cell text-right'>Line total</div>
          </div>
          
          {/* <div className="border-t border-gray-300 mt-2.5" /> */}
          
          {stateObject.lineItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="table-row [&>*]:border-t [&>*]:border-t-zinc-200 gap-5 justify-between mx-3 mt-2.5 max-md:mx-2.5">
                <div className="table-cell">
                <ResponsiveTextInput
                  onChange={handleChange}
                  name={`lineItems.${index}.title`}
                  placeholder="[ item title ]"
                  value={item.title}
                  className='font-medium'
                />
                </div>
                <div className="table-cell">
                <ResponsiveTextInput
                  onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
                  name={`lineItems.${index}.quantity`}
                  placeholder="[  ]"
                  value={splitInThousand(item.quantity)}
                  className="text-right text-zinc-600"
                />
                </div>
                <div className="table-cell">
                <ResponsiveTextInput
                  onChange={(e) => handleInputChange(e, stateObject, setStateObject, true)}
                  name={`lineItems.${index}.unitPrice`}
                  placeholder="[  ]"
                  value={splitInThousand(item.unitPrice)}
                  className="text-right text-zinc-600"
                  onBlur={(e) => controls?.handleNumericInputBlur(`lineItems.${index}.unitPrice`, e)}
                />
                </div>
                
                <div className="text-right table-cell text-zinc-800 relative">
                  {stateObject.metadata.currency.symbol} {splitInThousand(item.total)}
                  <div className="absolute h-full w-12 -right-1 top-0 translate-x-11 flex text-zinc-500 gap-1 items-center noExport">
                    <button onClick={() => controls?.removeLineItemAtIndex(index)} className="h-4 w-4 rounded-full bg-red-100 hover:bg-red-500 duration-300 flex items-center justify-center">-</button>
                    <button onClick={() => controls?.insertLineItemAtIndex(index+1)} className="h-4 w-4 absolute bottom-0 translate-y-2.5 rounded-full bg-green-100 hover:bg-green-500 duration-300 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
          
          {/* <div className="border-t border-gray-300 mt-9" /> */}
          
          {/* <div className="flex gap-10 mx-3 mt-2.5 font-medium max-md:mx-2.5"> */}
            <div className="table-row [&>*]:border-t [&>*]:border-t-zinc-200 flex-col flex-1 text-zinc-900">
              <div className="self-start span-2 table-cell">Subtotal</div>
              <div className="  table-cell"></div>
              <div className=" table-cell"></div>
              <div className='table-cell text-right'>{formatCurrency(stateObject.subtotal)}</div>
            </div>

            <div className="table-row  flex-col flex-1 text-gray-500">
              <div className="self-start span-2 table-cell">
                <div className="flex flex-row gap-1 items-center">
                  Tax
                  (<ResponsiveTextInput type="number" max={100} placeholder="[ vat ] !min-w-[20px]" onChange={(e) => controls?.updateVat("rate", e.target.value)} name="valueAddedTax.rate" value={stateObject?.valueAddedTax?.rate} className="text-center " />%)
                </div>
              </div>
              <div className="  table-cell" />
              <div className="  table-cell" />
              <div className=" table-cell">
              <ResponsiveTextInput placeholder="[amount]" onChange={(e) => controls?.updateVat("amount", e.target.value)} name="valueAddedTax.amount" value={splitInThousand(stateObject?.valueAddedTax?.amount)} className="text-right" />

              </div>

              {/* <div className='table-cell text-right'>{formatCurrency(stateObject.valueAddedTax.amount)}</div> */}
            </div>

            {/* <div className="flex flex-col flex-1 text-right text-gray-500 whitespace-nowrap">
              <div className="mt-2.5 table-cell">Tax ({stateObject.valueAddedTax.rate}%)</div>

              <div className="self-start mt-2.5 max-md:ml-2.5">
                {formatCurrency(stateObject.valueAddedTax.amount)}
              </div>
            </div> */}
          {/* </div> */}
          
          <div style={{ backgroundColor: templateThemeColor?.primary?.lightest, color: templateThemeColor?.primary?.base }} className="table-row gap-5 [&>*]:border-t  [&>*]:border-t-zinc-200 justify-between px-3 py-2.5 mt-2.5 w-full font-bold  border-solid border-t-[0.5px] border-t-gray-300">
            <div className='table-cell rounded-bl-xl'>Total due</div>
            <div className="  table-cell" />
            <div className="  table-cell" />
            <div className="table-cell gap-0.5 items-start tracking-wide text-right whitespace-nowrap rounded-br-xl">
              <div className="flex flex-row justify-end items-center gap-1">
                <div>{stateObject.metadata.currency.code}</div>
                <div>{formatCurrency(stateObject.grandTotal)}</div>
              </div>
            </div>
          </div>
        </article>
        <div /> {/** Grid col placeholder */}
        <div className="flex  w-full ml-auto gap-1.5 tracking-wide items-start self-center mt-3">
          <div className="flex gap-2 items-start py-0.5 w-2.5 mt-2">
            {
              stateObject?.notes?.specialInstructions && (
                <svg className="w-2.5 h-2.5 fill-zinc-400" viewBox="0 0 10 10">
                  <circle cx="5" cy="5" r="5"/>
                </svg>
              )
            }
          </div>
          <p className="text-sm  leading-snug text-gray-500">
            <ResponsiveTextInput
              onChange={handleChange}
              name="notes.specialInstructions"
              placeholder="[ other details ]"
              value={stateObject.notes?.specialInstructions}
              className='text-justify'
              />
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: templateThemeColor?.primary?.lightest, color: templateThemeColor?.secondary?.base }} className="flexe mt-auto flex-col justify-center px-[clamp(16px,5%,100px)] py-7  w-full text-sm font-medium  border-solid border-y-[0.5px] border-y-gray-300 max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex justify-between items-center max-md:max-w-full">
          <div className="relative">
            <ResponsiveTextInput
                onChange={handleChange}
                name="sender.website"
                placeholder="[ www.website.com ]"
                value={stateObject.sender.website}
                href={stateObject.sender.website}
                target='_blank'
                rel='no-referrer'
                />
          </div>

          <div className="relative">
            <ResponsiveTextInput
                onChange={handleChange}
                name="sender.phone"
                placeholder="[ phone ]"
                value={stateObject.sender.phone}
                href={`tel:${stateObject?.sender?.phone}`}
                target='_blank'
                rel='no-referrer'
                />
          </div>

          <div className="relative">
            <ResponsiveTextInput
                onChange={handleChange}
                name="sender.email"
                placeholder="[ email address ]"
                value={stateObject.sender.email}
                href={`mailto:${stateObject?.sender?.email}`}
                target='_blank'
                rel='no-referrer'
                />
          </div>

        </div>
      </section>
    </main>
  );
};

export default Simple2