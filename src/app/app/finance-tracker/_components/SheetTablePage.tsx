import DraggablePage from "@/sharedComponents/DraggablePage";
import ResizableTable from "@/sharedComponents/ResizableTable";
import { formatDateInput, getColorByIndex, getColorByWord, splitInThousand, splitInThousandForTextInput } from "@/utils/miscelaneous";
import { IBalanceSheetPage, IRow } from "../_types/types";
import useHandlePageLogoActions from "@/sharedHooks/useHandlePageLogoActions";
import { useFinanceTrackerContext } from "../_contexts/financeTrackerContext";
import { isLoggedIn } from "@/sharedConstants/common";
import PageImage from "@/sharedComponents/PageImage";
import { useParams } from "next/navigation";
import { MinusIcon, PlusIcon } from "@/sharedComponents/CustomIcons";
import { FormSelect, ResponsiveTextInput } from "@/sharedComponents/FormInputs";
import { MobileDatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs";
import { format, parse } from "date-fns";
import { memo } from "react";
import { MenuItem, Select } from "@mui/material";
import CategoryPlot from "./CategoryPlot";

interface IBalanceSheetPageProps {
  cursorPositionRef: React.MutableRefObject<number | null>;
  page: IBalanceSheetPage;
  pageIndex: number;
  resetCursorPosition: (e: React.ChangeEvent<HTMLInputElement>) => void;
  singleDocumentRef: React.MutableRefObject<HTMLDivElement[] | null>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  tableWidth: number;
  tbodyRef: React.RefObject<HTMLTableSectionElement>;
  params: any;
  setCategoriesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FinanceTrackerPage({ page, pageIndex, singleDocumentRef, tableContainerRef, tableWidth, tbodyRef, params, setCategoriesModalOpen }: IBalanceSheetPageProps) {
  const { pages, setPages, insertRow, movePage, removePage, updatePageSubtitle, updatePageTitle, updateRowsToAdd, addPage, categoryTotals } = useFinanceTrackerContext();

  const {
    isLoading, hasLogoOrSpinner
  } = useHandlePageLogoActions<IBalanceSheetPage>({ isLoggedIn, page, pageIndex: pageIndex, pages: pages, params: params, removePage: removePage, setPages: setPages });
  console.log(categoryTotals)
  return (
    <DraggablePage pageIndex={pageIndex} movePage={movePage}>   
      <div
        key={pageIndex}
        ref={(el: HTMLDivElement) => {(singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el }}
        className={`${isLoading.removingPage ? "bg-red-600/60 animate-pulse" : "bg-white"} relative  mb-8 w-full max-w-[1080px] md:rounded mx-auto px-3 md:px-4 pt-5 lg:pt-8 pb-6 xl:pb-8`}
      >
        <div className="noExport absolute h-full w-full left-0 top-0 border  border-zinc-300 md:rounded" /> {/** Border for preview and not export */}
        <div ref={tableContainerRef} className="max-w-screen-lg relative  mx-auto grid ">
          {/* <div className={`${hasLogoOrSpinner ? "grid-cols-[90px_1fr_90px]" : "grid-cols-1"} table-top grid gap-3`}> */}
          <div className={` table-top grid gap-3 `}>
            {/* <PageImage className="md:absolute" width={80} placeholder="Add/drop Logo" fileId={fileId} formData={pages} setFormData={setPages} imageProperty={page?.imageUrl as string} propertyKey={`${pageIndex}.imageUrl`} /> */}
            <div className="titles grid !max-w-[800px] w-full mx-auto justify-center mb-2">
              <ResponsiveTextInput style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ ..TITLE HERE.. ]' className="!max-w-[800px] text-2xl outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
              <div className="mb-1 noExport" />
              <ResponsiveTextInput style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ ..SUBTITLE HERE.. ]' className="!max-w-[800px] text-lg outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
            </div>
          </div>
         
          {/* <div className={`mb-1 md:mb-3 ${!hasLogoOrSpinner ? "noExport" : ""}`} /> */}
          <ResizableTable
            headers={["DATE", "NARRATION", "CATEGORY", "DEBIT", "CREDIT", "BALANCE"]}
            minCellWidth={100}
            columnsPercentageWidth={[12,40,12,12,12,12]}
            tableContent={
              <tbody ref={tbodyRef} className=''>
                <>
                  {page.rows.map((row, rowIndex) => (
                    <FinanceTrackerRow
                      key={rowIndex}
                      row={row}
                      rowIndex={rowIndex}
                      pageIndex={pageIndex}
                      tableWidth={tableWidth}
                      setCategoriesModalOpen={setCategoriesModalOpen}
                    />
                  ))}
                </>

              {/* Total Credit, Debit, and Final Balance Row */}
              <tr style={{ fontFamily: "sans-serif"}} >
                <td className="px-1 py-2 text-right" />
                <td className="px-1 py-2 text-center font-bold">TOTAL</td>
                <td className="px-1 py-2 text-center font-bold"></td>
                <td className="px-1 py-2 text-right font-bold text-red-600">{splitInThousand(page.totalDebit)}</td>
                <td className="px-1 py-2 text-right font-bold text-green-600">{splitInThousand(page.totalCredit)}</td>
                <td className="px-1 py-2 text-right font-bold">{splitInThousand(page.finalBalance)}</td>
              </tr>
            </tbody>
            }
          />

          

          <a style={{ fontFamily: "sans-serif" }} href="https://www.myappsuite.com" className="text-xs text-blue-700 w-max mt-6">Powered by myappsuite.com</a>
          <div className="line noExport" />
          <div className={`mt-2 noExport flex [&>*]:grow flex-wrap gap-x-2.5 gap-y-2`}>
            <button className="px-4 py-1.5 max-md:basis-1 max-md:order-2 bg-white border border-red-600 text-red-600 font-semibold rounded" onClick={() => removePage(pageIndex)} >
              Delete Page
            </button>
            <button className="px-4 py-1.5 max-md:basis-1 max-md:order-3 bg-white border-emerald-600 text-emerald-600 border font-semibold rounded" onClick={() => addPage(pageIndex)}>
              Add Page
            </button>
            <div className="px-4 max-md:order-1 max-md:w-full py-2 cursor-pointer bg-primary text-white flex gap-2 items-center justify-between rounded relative" onClick={() => insertRow(pageIndex, page.rows.length, page.rowsToAdd)}>
              <button onClick={(e) => {e.stopPropagation(); updateRowsToAdd(pageIndex, "decreament")}} className="absolut left-2 top-0 bottom-0 my-auto w-5 h-5 aspect-square flex items-center justify-center bg-white border border-primary text-primary font-bold rounded-full">
                <MinusIcon className="!size-3.5" />
              </button>
              <span className="font-semibold">Add Row {page.rowsToAdd > 1 && <span className='text-sm'>{`(${page.rowsToAdd})`}</span>}</span>
              <button onClick={(e) => {e.stopPropagation(); updateRowsToAdd(pageIndex, "increament")}} className="absolut right-2 top-0 bottom-0 my-auto w-5 h-5 aspect-square flex items-center justify-center bg-white border border-primary text-primary font-bold rounded-full">
                <PlusIcon className="!size-3.5" />
              </button>
            </div>
          </div>
          { (page?.pageCategoryTotal?.debit && page?.pageCategoryTotal?.credit) && <CategoryPlot categoryTotals={page?.pageCategoryTotal as any} />}
        </div>
        
      </div>
      <div className="mb-8 noExport" /> {/** Margin for preview */}
      
    </DraggablePage>
  )
}


interface BalanceSheetRowProps {
  row: IRow;
  rowIndex: number;
  pageIndex: number;
  tableWidth: number;
  setCategoriesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FinanceTrackerRow: React.FC<BalanceSheetRowProps> = memo(({
  row,
  rowIndex,
  pageIndex,
  tableWidth,
  setCategoriesModalOpen
}) => {
  const { handleInputChange, handleKeyDown, handleNumericInputBlur, inputRefs, insertRow, removeRow, documentFile } = useFinanceTrackerContext();
  // const categoryType = useMemo(() =>  ((!!row.credit && row.credit !== "0") ? "credit" : "debit") as keyof typeof documentFile.categories, [row]);
  const categoryType = ((!!row.credit && row.credit !== "0") ? "credit" : "debit") as keyof typeof documentFile.categories;

  return (
    <tr style={{ fontFamily: "sans-serif" }} key={rowIndex} className={`relative lg:[&>*]:hover:-translate-x- group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
      <td className="items-center relative">
        <div style={{ width: `${tableWidth}px` }} className="bg-transparen max-lg:hidden bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
          <button onClick={() => insertRow(pageIndex, rowIndex + 1)} className="bg-green-500 hidden duration-300 group-hover/line:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-2 items-center justify-center font-semibold">+</button>
        </div>
        <MobileDatePicker
          format="DD-MM-YYYY"
          ref={(el) => { inputRefs.current.set(`${pageIndex}-${rowIndex}-date`, el); }}
          value={dayjs(parse(row?.date, "dd-MM-yyyy", new Date()))}
          className='w-full [&_*]:!border-0 [&>*>*]:!py-1 [&_*]:!text-center [&>*>*]:!pl-1 [&_*]:!pr-1 h-full bg-white focus:outline focus:outline-2 disabled:placeholder-transparent lg:placeholder:text-transparent focus:outline-zinc-400 font-medium'
          onChange={(e: any) => { handleInputChange(pageIndex, rowIndex, 'date', format(new Date(e), "dd-MM-yyyy")); }}
        />
      </td>
      <td className="items-center relative">
        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.narration}</p> {/* Placeholder to hold textarea height autoresize */}
        <textarea
          ref={(el) => { inputRefs.current.set(`${pageIndex}-${rowIndex}-narration`, el); }}
          value={row.narration}
          rows={1}
          className={`w-full ${(row.narration === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-zinc-400 font-sans tracking-wide font-bold" : "font-medium"} disabled:placeholder-transparent lg:placeholder:text-transparent absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'narration', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "narration")}
          placeholder="Narration"
        />
      </td>
      <td className="items-center relative">
        {/* <input
          ref={(el) => { inputRefs.current.set(`${pageIndex}-${rowIndex}-category`, el); }}
          className='w-full h-full px-1 text-center absolute top-0 left-0 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={row?.category}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'category', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "category")}
        /> */}
        <div className="h-full w-full noExpor">
          <Select
            ref={(el: any) => { inputRefs.current.set(`${pageIndex}-${rowIndex}-category`, el); }}
            disabled={row.narration === "BALANCE BROUGHT FORWARD"}
            className='w-full !h-full disabled:!placeholder-transparent lg:placeholder:!text-transparent disabled:bg-zinc-50 [&]:disabled:!cursor-not-allowed !font-medium [&_*]:!rounded-none [&]:!rounded-none text-center [&_*]:!py-1 [&_*]:!px-0 [&]:!border-none focus:[&]:!outline-none [&_*]:!text-slate-90 [&_*]:!border-none [&_*]:!ring-0 focus:[&_*]:outline- !outline-zinc-400'
            value={row?.category}
            style={getColorByWord(row?.category)}
            IconComponent={() => null}
            // options={(documentFile?.categories?.[categoryType] as unknown as string[])?.map((category: string) => ({ text: category, value: category }))}
            onChange={e => { if (e?.target?.value !== "") handleInputChange(pageIndex, rowIndex, 'category', e.target.value)}}
          >
            {
              (documentFile?.categories?.[categoryType] as unknown as string[])?.map((category, categoryIndex) => (
                <MenuItem style={getColorByWord(category)} key={`${rowIndex}-${category}`} value={category} className="!font-lexend !font-medium !font-zinc-600">{category}</MenuItem>
              ))
            }
            <MenuItem onClick={(e) => { setCategoriesModalOpen(true) }} value="" className="!font-lexend !font-zinc-600 !font-light">Add Category</MenuItem>
          </Select>
        </div>
      </td>
      <td className="flex items-center">
        <input
          ref={(el) => { inputRefs.current.set(`${pageIndex}-${rowIndex}-debit`, el); }}
          className='w-full h-full px-1 text-right text-red-600 focus:outline disabled:placeholder:text-transparent lg:placeholder:text-transparent focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={splitInThousandForTextInput(row.debit === "0" ? "" : row.debit)}
          disabled={(!!row.credit && row.credit !== "0") || row.narration === "BALANCE BROUGHT FORWARD"}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'debit', e.target.value?.replace(/[^0-9.]/g, ""))}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "debit")}
          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "debit", e)}
          placeholder="Debit"
          inputMode="decimal"
        />
      </td>
      <td className="items-center">
        <input
          ref={(el) => { inputRefs.current.set(`${pageIndex}-${rowIndex}-credit`, el); }}
          className='w-full h-full px-1 text-right text-green-600 focus:outline disabled:placeholder:text-transparent lg:placeholder:text-transparent focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={splitInThousandForTextInput(row.credit === "0" ? "" : row.credit)}
          disabled={(!!row.debit && row.debit !== "0") || row.narration === "BALANCE BROUGHT FORWARD"}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'credit', e.target.value?.replace(/[^0-9.]/g, ""))}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "credit")}
          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "credit", e)}
          placeholder="Credit"
          inputMode="decimal"
        />
      </td>
      <td className={`peer/test px-1 relative !bg-tes md text-right flex items-start justify-end text-black/80 ${parseFloat(row.balance) < 0 && "text-red-600"} ${(rowIndex === 0 && row?.narration === "BALANCE BROUGHT FORWARD") ? "!font-bold" : "font-medium"}`}>
        <div className="bg-transparen bg-transparent lg:w-[calc(100%+45px)] lg:left-0 max-lg:-right-12 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
          <button onClick={() => removeRow(pageIndex, rowIndex)} className="peer/removeBtn bg-red-400 duration-300 z-[2] lg:hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-[18px] w-[18px] rounded text-white absolute top-0 bottom-0 my-auto right-6 flex items-center justify-center font-semibold"><MinusIcon className="!size-4" /></button>
          <button onClick={() => insertRow(pageIndex, rowIndex + 1)} className="peer/addBtn bg-green-500 duration-300 z-[2] lg:hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-[18px] w-[18px] rounded text-white absolute top-0 bottom-0 my-auto right-1 flex items-center justify-center font-semibold"><PlusIcon className="!size-4 !text-white" /></button>
          <div style={{ width: `${tableWidth}px` }} className="remove-hover w-full h-full hidden bg-green- peer-hover/removeBtn:block peer-hover/addBtn:block peer-hover/removeBtn:bg-red-400/20 peer-hover/addBtn:bg-green-400/20 -translate-x-1 top-0 right-10 absolute"></div>
        </div>
        {splitInThousand(row.balance)}
      </td>
    </tr>
  );
});

FinanceTrackerRow.displayName = "FinanceTrackerRow";