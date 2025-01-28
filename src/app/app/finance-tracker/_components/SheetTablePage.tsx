import DraggablePage from "@/sharedComponents/DraggablePage";
import ResizableTable from "@/sharedComponents/ResizableTable";
import { formatDateInput, replaceJSXRecursive, splitInThousand, splitInThousandForTextInput } from "@/utils/miscelaneous";
import { IBalanceSheetPage } from "../_types/types";
import useHandlePageLogoActions from "@/sharedHooks/useHandlePageLogoActions";
import { useBalanceSheetContext } from "../_contexts/financeTrackerContext";
import { isLoggedIn } from "@/sharedConstants/common";
import PageImage from "@/sharedComponents/PageImage";
import { useParams } from "next/navigation";
import { MinusIcon, PlusIcon } from "@/sharedComponents/CustomIcons";
import { ResponsiveTextInput } from "@/sharedComponents/FormInputs";

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
}

export default function BalanceSheetPage({ cursorPositionRef, page, pageIndex, resetCursorPosition, singleDocumentRef, tableContainerRef, tableWidth, tbodyRef, params }: IBalanceSheetPageProps) {
  const { pages, setPages, handleCSVImport, handleInputChange, handleKeyDown, handleNumericInputBlur, inputRefs, insertRow, movePage, removePage, removeRow, updatePageSubtitle, updatePageTitle, updateRowsToAdd, addPage, } = useBalanceSheetContext();
  const fileId = useParams()?.fileId as string;

  const {
    isLoading, hasLogoOrSpinner
  } = useHandlePageLogoActions<IBalanceSheetPage>({ isLoggedIn, page, pageIndex: pageIndex, pages: pages, params: params, removePage: removePage, setPages: setPages });

  return (
    <DraggablePage pageIndex={pageIndex} movePage={movePage}>   
      <div
        key={pageIndex}
        ref={(el: HTMLDivElement) => {(singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el }}
        className={`${isLoading.removingPage ? "bg-red-600/60 animate-pulse" : "bg-white"} relative mb-8 w-full max-w-[1080px] md:rounded mx-auto px-3 md:px-4 pt-5 lg:pt-8 pb-6 xl:pb-8`}
      >
        <div className="noExport absolute h-full w-full left-0 top-0 border  border-zinc-300 md:rounded" /> {/** Border for preview and not export */}
        <div ref={tableContainerRef} className="max-w-screen-lg relative  mx-auto grid">
          {/* <div className={`${hasLogoOrSpinner ? "grid-cols-[90px_1fr_90px]" : "grid-cols-1"} table-top grid gap-3`}> */}
          <div className={` table-top grid gap-3 `}>
            {/* <PageImage className="md:absolute" width={80} placeholder="Add/drop Logo" fileId={fileId} formData={pages} setFormData={setPages} imageProperty={page?.imageUrl as string} propertyKey={`${pageIndex}.imageUrl`} /> */}
            <div className="titles grid !max-w-[800px] w-full mx-auto justify-center">
              <ResponsiveTextInput style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ ..TITLE HERE.. ]' autoFocus className="!max-w-[800px] text-2xl outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
              <div className="mb-1 noExport" />
              <ResponsiveTextInput style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ ..SUBTITLE HERE.. ]' className="!max-w-[800px] mb-1 text-lg outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
            </div>
          </div>
         
          <div className={`mb-1 md:mb-3 ${!hasLogoOrSpinner ? "noExport" : ""}`} />
          <ResizableTable
            headers={["DATE", "NARRATION", "DEBIT", "CREDIT", "BALANCE"]}
            minCellWidth={100}
            columnsPercentageWidth={[11.5,48,13.5,13.5,13.5]}
            tableContent={
              <tbody ref={tbodyRef} className=''>
                <>
                  {page.rows.map((row, rowIndex) => (
                    <tr style={{ fontFamily: "sans-serif"}} key={rowIndex} className={`relative lg:[&>*]:hover:-translate-x- group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
                      <td  className="  items-center relative ">
                        <div style={{ width: `${tableWidth}px`}} className="bg-transparen bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
                          <button onClick={() => insertRow(pageIndex, rowIndex+1)} className="bg-green-500 hidden duration-300 group-hover/line:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-2 items-center justify-center font-semibold">+</button>
                        </div>
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-date`, el)}}
                          type="text"
                          value={row.date}
                          className='w-full h-full px-1 text-right focus:outline focus:outline-2 disabled:placeholder-transparent focus:outline-zinc-400 font-medium'
                          onChange={e => { handleInputChange(pageIndex, rowIndex, 'date', formatDateInput(e.target.value)), cursorPositionRef.current = e.target.selectionStart, resetCursorPosition(e) }}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "date")}
                          placeholder="Date"
                        />
                      </td>
                      <td className="  items-center relative">
                        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.narration}</p> {/* Placeholder to hold textarea height autoresize */}
                        <textarea
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-narration`, el)}}
                          value={row.narration}
                          rows={1}
                          className={`w-full ${(row.narration === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-zinc-400 disabled:placeholder-transparent font-sans tracking-wide font-bold" : "font-medium"} absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'narration', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "narration")}
                          placeholder="Narration"
                        />
                      </td>
                      <td className="flex items-center">
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-credit`, el)}}
                          className='w-full h-full px-1 text-right text-red-600 focus:outline disabled:placeholder-transparent focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                          value={splitInThousandForTextInput(row.debit === "0" ? "" : row.debit)}
                          disabled={(!!row.credit&&row.credit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'debit', e.target.value?.replace(/[^0-9.]/g, ""))}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "credit")}
                          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "debit", e)}
                          placeholder="Debit"
                        />
                      </td>
                      <td className="items-center" >
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-debit`, el)}}
                          className='w-full h-full px-1 text-right text-green-600 focus:outline focus:outline-2 disabled:placeholder:text-transparent focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                          value={splitInThousandForTextInput(row.credit === "0" ? "" : row.credit)}
                          disabled={(!!row.debit&&row.debit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'credit', e.target.value?.replace(/[^0-9.]/g, ""))}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "debit")}
                          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "credit", e)}
                          placeholder="Credit"
                        />
                      </td>
                      <td className={`peer/test  px-1 relative !bg-tes md text-right flex justify-end text-black/80 items-center ${parseFloat(row.balance) < 0 && "text-red-600"} ${(rowIndex === 0 && row?.narration === "BALANCE BROUGHT FORWARD") ? "!font-bold" : "font-medium"}`}>
                        <div className="bg-transparen bg-transparent lg:w-[calc(100%+45px)] lg:left-0 max-lg:-right-12 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
                          <button onClick={() => removeRow(pageIndex, rowIndex)} className="peer/removeBtn bg-red-400  duration-300 z-[2] lg:hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-[18px] w-[18px] rounded text-white absolute top-0 bottom-0 my-auto right-6 flex items-center justify-center font-semibold"><MinusIcon className="!size-4" /></button>
                          <button onClick={() => insertRow(pageIndex, rowIndex+1)} className="peer/addBtn bg-green-500  duration-300 z-[2] lg:hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-[18px] w-[18px] rounded text-white absolute top-0 bottom-0 my-auto right-1 flex items-center justify-center font-semibold"><PlusIcon className="!size-4 !text-white" /></button>
                          <div style={{ width: `${tableWidth}px`}} className="remove-hover w-full h-full hidden bg-green- peer-hover/removeBtn:block peer-hover/addBtn:block peer-hover/removeBtn:bg-red-400/20 peer-hover/addBtn:bg-green-400/20 -translate-x-1 top-0 right-10 absolute "></div>
                        </div>
                        {splitInThousand(row.balance)}
                      </td>
                    </tr>
                  ))}
                </>

              {/* Total Credit, Debit, and Final Balance Row */}
              <tr style={{ fontFamily: "sans-serif"}} >
                <td className="px-1 py-2 text-right" />
                <td className="px-1 py-2 text-center font-bold">TOTAL</td>
                <td className="px-1 py-2 text-right font-bold text-red-600">{splitInThousand(page.totalDebit)}</td>
                <td className="px-1 py-2 text-right font-bold text-green-600">{splitInThousand(page.totalCredit)}</td>
                <td className="px-1 py-2 text-right font-bold">{splitInThousand(page.finalBalance)}</td>
              </tr>
            </tbody>
            }
          />

          <a style={{ fontFamily: "sans-serif" }} href="https://app-suite.vercel.app" className="text-xs text-blue-600 mt-6">Powered by https://app-suite.vercel.app</a>
          <div className="line noExport" />
          <div className={`mt-6 noExport flex [&>*]:grow flex-wrap gap-x-2.5 gap-y-2`}>
            {/* <label htmlFor={`csv-import-${pageIndex}`} className="px-4 py-2 cursor-pointer text-center bg-rose-500 text-white rounded" >
              Load CSV
              <input id={`csv-import-${pageIndex}`} type="file" accept=".csv"  className='hidden' name={`${pageIndex}`} onChange={(e) => handleCSVImport(e, pageIndex)} />
            </label> */}
            <button className="px-4 py-1.5 max-md:basis-1 max-md:order-2 bg-white border border-red-600 text-red-600 font-semibold rounded" onClick={() => removePage(pageIndex)} >
              Delete Page
            </button>
            <button
              className="px-4 py-1.5 max-md:basis-1 max-md:order-3 bg-white border-emerald-600 text-emerald-600 border font-semibold rounded"
              onClick={() => addPage(pageIndex)}
            >
              Add Page
            </button>
            <div className="px-4 max-md:order-1 max-md:w-full py-2 cursor-pointer bg-blue-500 flex gap-2 items-center justify-between text-white rounded relative" onClick={() => insertRow(pageIndex, page.rows.length, page.rowsToAdd)}>
              <button onClick={(e) => {e.stopPropagation(); updateRowsToAdd(pageIndex, "decreament")}} className="absolut left-2 top-0 bottom-0 my-auto w-3.5 h-3.5 aspect-square flex items-center justify-center bg-white text-blue-500 font-bold rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </button>
              <span>Add Row {page.rowsToAdd > 1 && <span className='text-sm'>{`(${page.rowsToAdd})`}</span>}</span>
              <button onClick={(e) => {e.stopPropagation(); updateRowsToAdd(pageIndex, "increament")}} className="absolut right-2 top-0 bottom-0 my-auto w-3.5 h-3.5 aspect-square flex items-center justify-center bg-white text-blue-500 font-bold rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 noExport" /> {/** Margin for preview */}
    </DraggablePage>
  )
}

// import { SaveLoadingSpinner } from "@/sharedComponents/CustomIcons";
// import DraggablePage from "@/sharedComponents/DraggablePage";
// import ResizableTable from "@/sharedComponents/ResizableTable";
// import { formatDateInput, replaceJSXRecursive, splitInThousand, splitInThousandForTextInput } from "@/utils/miscelaneous";
// import Image from "next/image";
// import { IBalanceSheetPage, IRow } from "../_types/types";
// import useHandlePageLogoActions from "@/sharedHooks/useHandlePageLogoActions";
// import { Reorder } from "motion/react";
// import BalanceSheetRow from "./SheetTableRow";


// interface IBalanceSheetPageProps {
//   isLoggedIn: boolean;
//   pages: IBalanceSheetPage[]
//   setPages: React.Dispatch<React.SetStateAction<IBalanceSheetPage[]>>;
//   pageIndex: number;
//   page: IBalanceSheetPage;
//   movePage: (sourceIndex: number, destinationIndex: number) => void;
//   updatePageTitle: (title: string, pageIndex: number) => void;
//   updatePageSubtitle: (subTitle: string, pageIndex: number) => void;
//   insertRow: (pageIndex: number, rowIndex: number, rowsToAdd?: number) => void;
//   removeRow: (pageIndex: number, rowIndex: number) => void;
//   updateRowsToAdd: (pageIndex: number, action: "increament" | "decreament") => void;
//   handleInputChange: (
//     pageIndex: number,
//     rowIndex: number,
//     field: "date" | "narration" | "debit" | "credit",
//     value: string
//   ) => void;
//   handleKeyDown: (
//     e: React.KeyboardEvent,
//     pageIndex: number,
//     rowIndex: number,
//     field: "date" | "narration" | "debit" | "credit"
//   ) => void;
//   handleNumericInputBlur: (
//     pageIndex: number,
//     rowIndex: number,
//     field: "debit" | "credit",
//     e: React.FocusEvent<HTMLInputElement>
//   ) => void;
//   handleCSVImport: (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number) => void;
//   handleAddImageURL: (pageIndex: number, imageUrl: string) => void;
//   downloadPageCSV: (pageIndex: number) => void;
//   createDocumentPDF: (pageIndex: number, title: string) => void;
//   removePage: (pageIndex: number) => void;
//   redo: () => void;
//   undo: () => void;
//   canRedo: boolean;
//   canUndo: boolean;
//   tableWidth: number;
//   cursorPositionRef: React.MutableRefObject<number | null>;
//   resetCursorPosition: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   inputRefs: React.MutableRefObject<Map<string, HTMLInputElement | HTMLTextAreaElement|null>>;
//   tbodyRef: React.RefObject<HTMLTableSectionElement>;
//   tableContainerRef: React.RefObject<HTMLDivElement>;
//   singleDocumentRef: React.MutableRefObject<HTMLDivElement[]|null>;
//   addPage: (arg: any) => void
//   params: any;
// }

// export default function BalanceSheetPage({ isLoggedIn, pages, setPages, canRedo, canUndo, createDocumentPDF, cursorPositionRef, downloadPageCSV, handleAddImageURL, handleCSVImport, handleInputChange, handleKeyDown, handleNumericInputBlur, inputRefs, insertRow, movePage, page, pageIndex, redo, removePage, removeRow, resetCursorPosition, singleDocumentRef, tableContainerRef, tableWidth, tbodyRef, undo, updatePageSubtitle, updatePageTitle, updateRowsToAdd, addPage, params }: IBalanceSheetPageProps) {
//   const {
//     isLoading, isDragging, imageSrc,
//     handleRemoveLogo, handleRemovePage,
//     handleReceiptDragOver, handleReceiptDragEnter,
//     handleReceiptDragLeave, handleReceiptDrop,
//     handleUploadLogo, hasLogoOrSpinner
//   } = useHandlePageLogoActions<IBalanceSheetPage>({ isLoggedIn: isLoggedIn, page: page, pageIndex: pageIndex, pages: pages, params: params, removePage: removePage, setPages: setPages })

//   const handleReorderRows = (pageIndex: number, newRows: IRow[]) => {
//     setPages((prevPages) => {
//       const updatedPages = [...prevPages];
//       updatedPages[pageIndex] = {
//         ...updatedPages[pageIndex],
//         rows: newRows,
//       };
//       return updatedPages;
//     });
//   };

//   return (
//     <DraggablePage pageIndex={pageIndex} movePage={movePage}>   

//       <div key={pageIndex} ref={(el: HTMLDivElement) => {(singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el}} className={`${isLoading.removingPage ? "bg-red-600/60 animate-pulse" : "bg-white"} relative mb-8 w-full  max-w-[1080px] md:rounded mx-auto px-4 pt-8 pb-6 xl:pb-8`}>
//       <div className="noExport absolute h-full w-full left-0 top-0 border border-zinc-300 md:rounded" /> {/** Border for preview and not export */}
//         <div ref={tableContainerRef} className="max-w-screen-lg relative mx-auto">
//           <div className={`${hasLogoOrSpinner ? "grid-cols-[90px_1fr_90px]" : "grid-cols-1"} table-top grid gap-3`}>
//             {
//               (isLoading.uploading || isLoading.deleting || isLoading.removingPage || page?.imageUrl)
//               ? <div className={`${isDragging ? "bg-green-500/40" : ""} relative !overflow-hidde z-[2] !w-[80px] !h-[80px] -translate-y-2 `} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
//                 {
//                   (isLoading.uploading || isLoading.removingPage || isLoading.deleting)
//                   ? (
//                     <SaveLoadingSpinner height={70} width={70} className='' />
//                   ) : (page.imageUrl && imageSrc) && (
//                     <div className="relative w-full h-full ">
//                       <button onClick={() => handleRemoveLogo(page?.imageUrl?.split("<||>")[0] as string)} className="absolute noExport cursor-pointer z-[10] w-max h-max -top-3 -left-3">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 !text-zinc-400">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                         </svg>
//                       </button>
//                       <Image fill src={imageSrc as string}  alt='alternative'  className='object-contain w-full h-auto aspect-square'  onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop} />
//                     </div>
//                   )
//                 }
//               </div>
//               : (
//                 <label htmlFor={`add-logo-${pageIndex}`} className={`${isDragging ? "bg-green-500/20" : "bg-zinc-100"} absolute cursor-pointer z-[1] h-[70px] w-[75px]  flex items-center p-2 justify-center text-center rounded  -top-1  noExport`} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
//                   <span className="text-xs text-zinc-400">Add/drop Logo</span>
//                   <input id={`add-logo-${pageIndex}`} type="file" accept="image/jpeg, image/jpg, image/png" className='hidden' name={`${pageIndex}`} onChange={(e) => handleUploadLogo(e.target.files![0], pageIndex)} />
//                 </label>
//               )
//             }
//             <div className="titles grid !max-w-[800px] w-full mx-auto">
//               <div className="relative h-max !max-w-[800px] w-full mx-auto bg-ts">
//                 <p style={{ fontFamily: "sans-serif"}} className="invisib !max-w-[800px] text-black w-full mx-auto py-1 text-2xl border- border-white outline-none font-bold w-ful text-center">{replaceJSXRecursive(page.title, { "\n": <br />})}<span className="invisible">.</span></p>
//                 <textarea style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ TITLE HERE... ]' autoFocus className="noExport !max-w-[800px] w-full mx-auto text-2xl py-1 resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 right-0 outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
//               </div>
//               <div className="mb-2 noExport" />
//               <div className="relative mb-1">
//                 <p style={{ fontFamily: "sans-serif"}} className="text-center  py-1 border- border-white text-black/90 invisibl outline-none text-lg text-black/80 font-semibold w-full">{page.subTitle}<span className="invisible">.</span></p>
//                 <textarea style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ SUBTITLE; eg. FROM PERIOD OF 1ST <MONTH> <YEAR> TO 30TH <MONTH> <YEAR>... ]' className={` noExport text-center py-1 resize-none absolute !overflow-visible no-scrollbar left-0 top-0 outline-none border- border-zinc-300/80 text-lg text-black/80 font-semibold h-full w-full`} />
//               </div>
//             </div>
//           </div>
         
//           <div className={`mb-3 ${!hasLogoOrSpinner ? "noExport" : ""}`} />
//           <ResizableTable
//             headers={["DATE", "NARRATION", "DEBIT", "CREDIT", "BALANCE"]}
//             minCellWidth={100}
//             columnsPercentageWidth={[11.5,48,13.5,13.5,13.5]}
//             tableContent={
//               <Reorder.Group ref={tbodyRef} 
//                 axis="y"
//                 values={page.rows}
//                 onReorder={(newRows) => handleReorderRows(pageIndex, newRows)}
//                 className=' w-full'
//                 as="div"
//               >
//                 <>
//                   {page.rows.map((row, rowIndex) => (
//                     <Reorder.Item
//                       key={`$${row.narration}-${row?.date}-${row?.debit}-${row?.credit}`}
//                       value={row}
//                       style={{ fontFamily: "sans-serif"}}
//                       className={`grid grid-cols-[11.5%_48%_13.5%_13.5%_13.5%] bg-white relative group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}
//                       as="div"
//                     >
//                       <BalanceSheetRow
//                         cursorPositionRef={cursorPositionRef}
//                         pageIndex={pageIndex}
//                         resetCursorPosition={resetCursorPosition}
//                         row={row}
//                         rowIndex={rowIndex}
//                       />
//                     </Reorder.Item>
//                   ))}
//                 </>
              
//               {/* Total Credit, Debit, and Final Balance Row */}
//               {/* <tr style={{ fontFamily: "sans-serif"}} >
                
//               </tr> */}
//             </Reorder.Group>
//             }
//             tableFooter={
//               <>
//                 <td className="px-1 py-2 text-right" />
//                 <td className="px-1 py-2 text-center font-bold">TOTAL</td>
//                 <td className="px-1 py-2 text-right font-bold text-red-600">{splitInThousand(page.totalDebit)}</td>
//                 <td className="px-1 py-2 text-right font-bold text-green-600">{splitInThousand(page.totalCredit)}</td>
//                 <td className="px-1 py-2 text-right font-bold">{splitInThousand(page.finalBalance)}</td>
//               </>
//             }
//           />

//           <a style={{ fontFamily: "sans-serif" }} href="https://app-suite.vercel.app" className="text-xs text-blue-600 mt-6">Powered by https://app-suite.vercel.app</a>
//           <div className="line noExport" />
//           <div className={`mt-6 noExport flex [&>*]:grow flex-wrap gap-x-2.5 gap-y-2`}>
//             <label htmlFor={`csv-import-${pageIndex}`} className="px-4 py-2 cursor-pointer text-center bg-rose-500 text-white rounded" >
//               Load CSV
//               <input id={`csv-import-${pageIndex}`} type="file" accept=".csv"  className='hidden' name={`${pageIndex}`} onChange={(e) => handleCSVImport(e, pageIndex)} />
//             </label>
//             {/* {
//               !imageSrc
//               ? (
//                 <label htmlFor={`add-logo-${pageIndex}`}  className="px-4 py-2 cursor-pointer text-center bg-violet-500 text-white rounded" >
//                   Add Logo
//                   <input id={`add-logo-${pageIndex}`} type="file" accept="image/jpeg, image/jpg, image/png" className='hidden' name={`${pageIndex}`} onChange={(e) => handleUploadLogo(e.target.files![0], pageIndex)} />
//                 </label>
//               ) : (
//                 <LoadingButton loading={isLoading.deleting || isLoading.removingPage} className="!px-4 !py-2 bg-violet-500 text-white !rounded" onClick={() => handleRemoveLogo(page?.imageUrl?.split("<||>")[0] as string)} >
//                   Remove Logo
//                 </LoadingButton>
//               )
//             } */}
           
//             <button className="px-4 py-2 bg-amber-500 text-white rounded" onClick={() => downloadPageCSV(pageIndex)}>
//               Download CSV
//             </button>
//             <button className="px-4 py-2 bg-green-500  text-white rounded" onClick={() => createDocumentPDF(pageIndex, page.title)} >
//               Download PDF
//             </button>
//             <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleRemovePage(pageIndex)} >
//               Remove Page
//             </button>
//             <button className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-500 text-white rounded" onClick={redo} disabled={!canRedo} >
//               Redo
//             </button>
//             <button className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-500 text-white rounded" onClick={undo} disabled={!canUndo} >
//               Undo
//             </button>
//             <div className="px-4 py-2 cursor-pointer bg-blue-500 flex gap-2 items-center justify-between text-white rounded relative" onClick={() => insertRow(pageIndex, page.rows.length, page.rowsToAdd)}>
//               <button onClick={(e) => {e.stopPropagation(); updateRowsToAdd(pageIndex, "decreament")}} className="absolut left-2 top-0 bottom-0 my-auto w-3.5 h-3.5 aspect-square flex items-center justify-center bg-white text-blue-500 font-bold rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
//                 </svg>
//               </button>
//               <span>Add Row {page.rowsToAdd > 1 && <span className='text-sm'>{`(${page.rowsToAdd})`}</span>}</span>
//               <button onClick={(e) => {e.stopPropagation(); updateRowsToAdd(pageIndex, "increament")}} className="absolut right-2 top-0 bottom-0 my-auto w-3.5 h-3.5 aspect-square flex items-center justify-center bg-white text-blue-500 font-bold rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                 </svg>
//               </button>
//             </div>
//             <button
//               className="px-4 py-2 bg-emerald-500 text-white rounded"
//               onClick={() => addPage(pageIndex)}
//             >
//               Insert Page Below
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="mb-8 noExport" /> {/** Margin for preview */}
//     </DraggablePage>
//   )
// }