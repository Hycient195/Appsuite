import ResizableTable from "@/sharedComponents/ResizableTable";
import SheetTableRow from "./SheetTableRow";
import DraggablePage from "@/sharedComponents/DraggablePage";
import { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import { IReceiptTrackerPage } from "../_types/types";
import { replaceJSXRecursive, splitInThousand } from "@/utils/miscelaneous";
import useHandlePageLogoActions from "@/sharedHooks/useHandlePageLogoActions";
import { SaveLoadingSpinner } from "@/sharedComponents/CustomIcons";
import Image from "next/image";

interface IProps {
  pageIndex: number;
  inputRefs: any;
  handleInputChange: (pageIndex: number, rowIndex: number, field: string, value: string | number) => void;
  insertRow: (pageIndex: number, rowIndex: number, rowsToAdd?: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, pageIndex: number, rowIndex: number, columnKey: string) => void;
  cursorPositionRef: any;
  resetCursorPosition: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumericInputBlur: (pageIndex: number, rowIndex: number, field: string, event: ChangeEvent<HTMLInputElement>) => void;
  removeRow: (pageIndex: number, rowIndex: number) => void;
  isLoggedIn: boolean;
  pages: IReceiptTrackerPage[]
  setPages: React.Dispatch<React.SetStateAction<IReceiptTrackerPage[]>>;
  params: any;
  movePage: (fromIndex: number, toIndex: number) => void
  singleDocumentRef: React.MutableRefObject<HTMLElement | (HTMLElement | null)[] | null>
  page: IReceiptTrackerPage
  handleCSVImport: (event: ChangeEvent<HTMLInputElement>, pageIndex?: number) => void
  downloadPageCSV: (pageIndex: number) => void
  createDocumentPDF: (index?: number, documentFileName?: string) => void
  removePage: (pageIndex: number) => void
  updateRowsToAdd: (pageNumber: number, action: ("increament" | "decreament" | null), defaltValue?: number) => void
  addPage: (afterPageIndex: number) => void
  updatePageTitle: (value: string, pageNumber: number) => void
  updatePageSubtitle: (value: string, pageNumber: number) => void
  redo: () => void;
  undo: () => void
  canRedo: boolean;
  canUndo: boolean
}

export default function SheetTablePage({
  pageIndex,
  inputRefs,
  handleInputChange,
  insertRow,
  handleKeyDown,
  cursorPositionRef,
  resetCursorPosition,
  handleNumericInputBlur,
  removeRow,
  isLoggedIn,
  pages,
  setPages,
  params,
  page,
  addPage,
  createDocumentPDF,
  downloadPageCSV,
  handleCSVImport,
  movePage,
  removePage,
  singleDocumentRef,
  updatePageSubtitle,
  updatePageTitle,
  updateRowsToAdd,
  canRedo,
  canUndo,
  undo,
  redo
}: IProps) {
  const [ tableWidth, setTableWidth ] = useState(2);
  const tableContainerRef = useRef<HTMLTableRowElement|null>(null);

  useLayoutEffect(() => {
    if (tableContainerRef.current) {
      setTableWidth(tableContainerRef.current.clientWidth)
    }
  }, [ tableContainerRef ])

  if (typeof window !== "undefined") {
    window?.addEventListener("resize", () => {
      if (tableContainerRef.current) {
        setTableWidth(tableContainerRef.current.clientWidth)
      }
    })
  }

  const {
    isLoading, isDragging, imageSrc,
    handleRemoveLogo, handleRemovePage,
    handleReceiptDragOver, handleReceiptDragEnter,
    handleReceiptDragLeave, handleReceiptDrop,
    handleUploadLogo, hasLogoOrSpinner
  } = useHandlePageLogoActions<IReceiptTrackerPage>({ isLoggedIn, page, pageIndex, pages, params, removePage, setPages });

  return (
    <DraggablePage pageIndex={pageIndex} movePage={movePage}>
      <div key={pageIndex} ref={(el: HTMLDivElement) => {((singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el)}} className="mb-8 w-full  max-w-[1080px] md:rounded mx-auto bg-white px-4 pt-8 pb-6 xl:pb-8 border border-zinc-300">

        <div ref={tableContainerRef} className="max-w-screen-lg relative mx-auto">
          <div className={`${hasLogoOrSpinner ? "grid-cols-[90px_1fr_90px]" : "grid-cols-1"} table-top grid gap-3`}>
            {
              (isLoading.uploading || isLoading.deleting || isLoading.removingPage || page?.imageUrl)
              ? <div className={`${isDragging ? "bg-green-500/40" : ""} relative !overflow-hidde z-[2] !w-[80px] !h-[80px] -translate-y-1 `} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
                {
                  (isLoading.uploading || isLoading.removingPage || isLoading.deleting)
                  ? (
                    <SaveLoadingSpinner height={70} width={70} className='' />
                  ) : (page.imageUrl && imageSrc) && (
                    <div className="relative w-full h-full ">
                      <button onClick={() => handleRemoveLogo(page?.imageUrl?.split("<||>")[0] as string)} className="absolute noExport cursor-pointer z-[10] w-max h-max -top-3 -left-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 !text-zinc-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </button>
                      <Image fill src={imageSrc as string}  alt='alternative'  className='object-contain w-full h-auto aspect-square'  onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop} />
                    </div>
                  )
                }
              </div>
              : (
                <label htmlFor={`add-logo-${pageIndex}`} className={`${isDragging ? "bg-green-500/20" : "bg-zinc-100"} absolute cursor-pointer z-[1] h-[70px] w-[75px]  flex items-center p-2 justify-center text-center rounded  -top-1  noExport`} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
                  <span className="text-xs text-zinc-400">Add/drop Logo</span>
                  <input id={`add-logo-${pageIndex}`} type="file" accept="image/jpeg, image/jpg, image/png" className='hidden' name={`${pageIndex}`} onChange={(e) => handleUploadLogo(e.target.files![0], pageIndex)} />
                </label>
              )
            }
            <div className="titles grid !max-w-[800px] w-full mx-auto">
              <div className="relative h-max !max-w-[800px] w-full mx-auto bg-ts">
                <p style={{ fontFamily: "sans-serif"}} className="invisib !max-w-[800px] text-black w-full mx-auto py-1 text-2xl border- border-white outline-none font-bold w-ful text-center">{replaceJSXRecursive(page.title, { "\n": <br />})}<span className="invisible">.</span></p>
                <textarea style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ TITLE HERE... ]' autoFocus className="noExport !max-w-[800px] w-full mx-auto text-2xl py-1 resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 right-0 outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
              </div>
              <div className="mb-2 noExport" />
              <div className="relative mb-1">
                <p style={{ fontFamily: "sans-serif"}} className="text-center  py-1 border- border-white text-black/90 invisibl outline-none text-lg text-black/80 font-semibold w-full">{page.subTitle}<span className="invisible">.</span></p>
                <textarea style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ SUBTITLE; eg. FROM PERIOD OF 1ST <MONTH> <YEAR> TO 30TH <MONTH> <YEAR>... ]' className={` noExport text-center py-1 resize-none absolute !overflow-visible no-scrollbar left-0 top-0 outline-none border- border-zinc-300/80 text-lg text-black/80 font-semibold h-full w-full`} />
              </div>
            </div>
          </div>

          <div className="mb-3 noExport" />
          <ResizableTable
            headers={["DATE", "NAME", "AMOUNT", "SUB TOTAL", "RECEIPT"]}
            minCellWidth={100}
            columnsPercentageWidth={[11.5,48,13.5,13.5,13.5]}
            tableContent={
              <tbody className=''>
                <>
                  {page.rows.map((row, rowIndex) => (
                    <SheetTableRow
                      key={`${pageIndex}-${rowIndex}`}
                      cursorPositionRef={cursorPositionRef}
                      handleInputChange={handleInputChange}
                      handleKeyDown={handleKeyDown}
                      handleNumericInputBlur={handleNumericInputBlur}
                      inputRefs={inputRefs}
                      insertRow={insertRow}
                      isLoggedIn={isLoggedIn}
                      pageIndex={pageIndex}
                      pages={pages}
                      params={params}
                      removeRow={removeRow}
                      resetCursorPosition={resetCursorPosition}
                      row={row}
                      rowIndex={rowIndex}
                      setPages={setPages}
                      tableWidth={tableWidth}
                    />
                  ))}
                </>

              {/* Total Credit, Debit, and Final Balance Row */}
              <tr style={{ fontFamily: "sans-serif" }} >
                <td className="px-1 py-2 text-right"/>
                <td className="px-1 py-2 text-center font-bold">TOTAL</td>
                {/* <td className="px-1 py-2 text-right font-bold text-green-600">{splitInThousand(page.totalAmount)}</td> */}
                <td className="px-1 py-2 text-right font-bold text-green-600"></td>
                <td className="px-1 py-2 text-right font-bold">{splitInThousand(page.totalSubTotal)}</td>
                <td className="px-1 py-2 text-right font-bold text-red-600"></td>
              </tr>
            </tbody>
            }
          />
          <div className="line noExport" />
          <div className={`mt-6 noExport flex [&>*]:grow flex-wrap gap-y-2 gap-x-2.5`}>
            <label htmlFor={`csv-import-${pageIndex}`} className="px-4 py-2 cursor-pointer text-center bg-rose-500 text-white rounded" >
              Load CSV
              <input id={`csv-import-${pageIndex}`} type="file" accept=".csv" className='hidden' name={`${pageIndex}`} onChange={(e) => handleCSVImport(e, pageIndex)} />
            </label>
            <button className="px-4 py-2 bg-amber-500 text-white rounded" onClick={() => downloadPageCSV(pageIndex)}>
              Download CSV
            </button>
            <button className="px-4 py-2 bg-green-500  text-white rounded" onClick={() => createDocumentPDF(pageIndex, page.title)} >
              Download PDF
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleRemovePage(pageIndex)} >
              Remove Page
            </button>
            <button className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-500 text-white rounded" onClick={redo} disabled={!canRedo} >
              Redo
            </button>
            <button className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-500 text-white rounded" onClick={undo} disabled={!canUndo} >
              Undo
            </button>
            <div className="px-4 py-2 cursor-pointer bg-blue-500 flex gap-2 items-center justify-between text-white rounded relative" onClick={() => insertRow(pageIndex, page.rows.length, page.rowsToAdd)}>
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
            <button
              className="px-4 py-2 bg-emerald-500 text-white rounded"
              onClick={() => addPage(pageIndex)}
            >
              Insert Page Below
            </button>
          </div>
        </div>
        </div>
    </DraggablePage>
  )
}