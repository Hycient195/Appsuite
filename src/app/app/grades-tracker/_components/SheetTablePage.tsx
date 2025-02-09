import { MinusIcon, PlusIcon, SaveLoadingSpinner } from "@/sharedComponents/CustomIcons";
import DraggablePage from "@/sharedComponents/DraggablePage";
import ResizableTable from "@/sharedComponents/ResizableTable";
import { formatDateInput, replaceJSXRecursive, splitInThousand, splitInThousandForTextInput } from "@/utils/miscelaneous";
import Image from "next/image";
import { ICGPATrackerPage } from "../_types/types";
import useHandlePageLogoActions from "@/sharedHooks/useHandlePageLogoActions";
import { FormSelect, ResponsiveTextInput } from "@/sharedComponents/FormInputs";
import { isLoggedIn } from "@/sharedConstants/common";
import { useGradesTrackerContext } from "../_contexts/gradesTrackerContext";


interface IGradesTrackerProps {
  page: ICGPATrackerPage;
  pageIndex: number;
  singleDocumentRef: React.MutableRefObject<HTMLDivElement[] | null>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  tableWidth: number;
  tbodyRef: React.RefObject<HTMLTableSectionElement>;
  params: any;
}

export default function CGPATrackerPage({ page, pageIndex, singleDocumentRef, tableContainerRef, tableWidth, tbodyRef, params }: IGradesTrackerProps) {
  const { pages, setPages, handleInputChange, handleKeyDown, inputRefs, insertRow, movePage, removePage, removeRow, updatePageSubtitle, updatePageTitle, updateRowsToAdd, addPage } = useGradesTrackerContext()
  const {
    isLoading, hasLogoOrSpinner
  } = useHandlePageLogoActions<ICGPATrackerPage>({ isLoggedIn: isLoggedIn, page: page, pageIndex: pageIndex, pages: pages, params: params, removePage: removePage, setPages: setPages })

  return (
    <DraggablePage pageIndex={pageIndex} movePage={movePage}>   

      <div key={pageIndex} ref={(el: HTMLDivElement) => {(singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el}} className={`${isLoading.removingPage ? "bg-red-600/60 animate-pulse" : "bg-white"} relative  w-full  max-w-[1080px] md:rounded mx-auto px-2 md:px-4 lg:px-6 pt-8 pb-6 xl:pb-8 `}>
        <div className="noExport absolute h-full w-full left-0 top-0 border border-zinc-300 md:rounded" /> {/** Border for preview and not export */}
        <div ref={tableContainerRef} className="max-w-screen-lg relative mx-auto ">
          <div className={`${hasLogoOrSpinner ? "grid-cols-[90px_1fr_90px]" : "grid-cols-1"} table-top grid gap-3`}>
            {/* {
              (isLoading.uploading || isLoading.deleting || isLoading.removingPage || page?.imageUrl)
              ? <div className={`${isDragging ? "bg-green-500/40" : ""} relative !overflow-hidde z-[2] !w-[80px] !h-[80px] -translate-y-2 `} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
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
            } */}

            {/* <div className="titles grid !max-w-[800px] w-full mx-auto">
              <div className="relative h-max !max-w-[800px] w-full mx-auto bg-ts">
                <p style={{ fontFamily: "sans-serif"}} className="invisib !max-w-[800px] text-black w-full mx-auto py-1 text-2xl border- border-white outline-none font-bold w-ful text-center">{replaceJSXRecursive(page.title, { "\n": <br />})}<span className="invisible">.</span></p>
                <textarea style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ TITLE HERE... ]' autoFocus className="noExport !max-w-[800px] w-full mx-auto text-2xl py-1 resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 right-0 outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
              </div>
              <div className="mb-2 noExport" />
              <div className="relative mb-1">
                <p style={{ fontFamily: "sans-serif"}} className="text-center  py-1 border- border-white invisibl outline-none text-lg text-black/80 font-semibold w-full">{page.subTitle}<span className="invisible">.</span></p>
                <textarea style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ SUBTITLE; eg. FROM PERIOD OF 1ST <MONTH> <YEAR> TO 30TH <MONTH> <YEAR>... ]' className={` noExport text-center py-1 resize-none absolute !overflow-visible no-scrollbar left-0 top-0 outline-none border- border-zinc-300/80 text-lg text-black/80 font-semibold h-full w-full`} />
              </div>
            </div> */}

            <div className="titles grid !max-w-[800px] w-full mx-auto justify-center mb-2">
              <ResponsiveTextInput style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ ..TITLE HERE.. ]' className="!max-w-[800px] text-2xl outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
              <div className="mb-1 noExport" />
              <ResponsiveTextInput style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ ..SUBTITLE HERE.. ]' className="!max-w-[800px] text-lg outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
            </div>

          </div>
         
          {/* <div className={`mb-3 ${!hasLogoOrSpinner ? "noExport" : ""}`} /> */}
          <ResizableTable
            headers={["S/N", "COURSE CODE", "COURSE TITLE", "UNIT LOAD", "GRADE", "GRADE POINT"]}
            minCellWidth={100}
            tableClassName="grid-cols-[7.5%_15%_40%_13.5%_10.5%_13.5%]"
            columnsPercentageWidth={[7.5,15,40,13.5,10.5,13.5]}
            tableContent={
              <tbody ref={tbodyRef} className=''>
                <>
                  {page.rows.map((row, rowIndex) => (
                    <tr style={{ fontFamily: "sans-serif"}} key={rowIndex} className={`relative group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
                      <td  className="  items-center relative text-center justify-center">
                        <div style={{ width: `${tableWidth}px`}} className="bg-transparen bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
                          <button onClick={() => insertRow(pageIndex, rowIndex+1)} className="bg-green-500 hidden duration-300 group-hover/line:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-2 items-center justify-center font-semibold">+</button>
                        </div>
                        <div className="h-full flex items-center justify-center my-auto">{rowIndex + 1}</div>
                      </td>
                      <td className="items-center" >
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-courseCode`, el)}}
                          className='w-full h-full px-1 text-center focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                          value={row?.courseCode}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'courseCode', e.target.value?.toUpperCase())}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "courseCode")}
                        />
                      </td>
                      <td className="  items-center relative">
                        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{replaceJSXRecursive(row.courseTitle, { '\n': <br /> })}</p> {/* Placeholder to hold textarea height autoresize */}
                        <textarea
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-courseTitle`, el)}}
                          value={row.courseTitle}
                          rows={1}
                          className={`w-full absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'courseTitle', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "courseTitle")}
                        />
                      </td>
                      <td className="flex items-center">
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-credit`, el)}}
                          className='w-full h-full px-1 text-center  focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                          value={row.unitLoad}
                          type="number"
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'unitLoad', e.target.value?.replace(/[^0-9.]/g, ""))}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "unitLoad")}
                        />
                      </td>
                      <td className="items-center relative" >
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-courseCode`, el)}}
                          className='w-full h-full px-1 text-center absolute top-0 left-0 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                          value={row?.grade}
                          maxLength={1}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'grade', e.target.value?.replace(/[^A-F]/ig, "")?.toUpperCase())}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "grade")}
                        />
                        <div className="h-full w-full noExport">
                          <FormSelect
                            ref={(el: any) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-courseCode`, el)}}
                            inputClassName='w-full !h-full px-1 text-center [&_*]:!py-1 focus:outline [&_*]:!text-slate-900 [&_*]:!border-none focus:[&_*]:!ring-0 focus:[&_*]:outline- focus:!outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                            value={row?.grade}
                            options={[ {text: "A", value: "A"}, {text: "B", value: "B"}, {text: "C", value: "C"}, {text: "D", value: "D"}, {text: "E", value: "E"}, {text: "F", value: "F"}, ]}
                            // maxLength={1}
                            onChange={e => handleInputChange(pageIndex, rowIndex, 'grade', e.target.value?.replace(/[^A-F]/ig, "")?.toUpperCase())}
                            // onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "grade")}
                          />
                        </div>
                      </td>
                      
                      <td className={`peer/test  px-1 relative text-center flex justify-center text-black/80 items-center`}>
                        <div className="bg-transparen bg-transparent bg-tes w-[calc(100%+10px)] -right-3 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
                          <button onClick={() => removeRow(pageIndex, rowIndex)} className="peer/removeBtn bg-red-400  duration-300 z-[3] hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-3 items-center justify-center font-semibold">-</button>
                          <div style={{ width: `${tableWidth}px`}} className="remove-hover w-full h-full hidden peer-hover/removeBtn:block bg-red-400/20 -translate-x-3 top-0 right-0 absolute "></div>
                        </div>
                        {row.gradePoint}
                      </td>
                    </tr>
                  ))}
                </>

              {/* Total Credit, Debit, and Final Balance Row */}
              <tr style={{ fontFamily: "sans-serif"}} className=" [&>*]:!border-t  [&>*]:!border-t-black" >
                <td className="px-1 col-span-3 py-2 text-center font-bold">TOTAL</td>
                <td className="px-1 py-2 text-center font-bold">{page.totalUnitLoad}</td>
                <td className="px-1 bg-zinc-50 py-2 text-right font-bold" />
                <td className="px-1 py-2 text-center font-bold">{page.totalGradePoint}</td>
              </tr>
              <tr style={{ fontFamily: "sans-serif"}} className=" [&>*]:!border-t  [&>*]:!border-t-black" >
                <td className="col-span-3 px-1 py-2 text-center font-bold">
                  <span className="md:hidden">GPA</span>
                  <span className="max-md:hidden">GRADE POINT AVERAGE (GPA)</span>
                </td>
                {/* <td className=" bg-zinc-50 px-1 py-2 text-right font-bold" /> */}
                <td className="font-bold col-span-3 text-center flex items-center justify-center">{page?.gradePointAverage}</td>
              </tr>
              <tr style={{ fontFamily: "sans-serif"}} >
                <td colSpan={5} className="col-span-3 text-center px-1 py-2 font-bold">
                  <span className="md:hidden">CGPA</span>
                  <span className="max-md:hidden">CUMMULATIVE GRADE POINT AVERAGE (CGPA)</span>
                </td>
                <td className="font-bold col-span-3 text-center flex items-center justify-center">{page?.cummulativeGradePointAverage}</td>
              </tr>
            </tbody>
            }
          />

          <a style={{ fontFamily: "sans-serif" }} href="https://www.myappsuite.com" className="text-xs text-blue-700 w-max !mt-4">Powered by myappsuite.com</a>
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

        </div>
      </div>
      <div className="mb-8 noExport" /> {/** Margin for preview */}
    </DraggablePage>
  )
}