"use client"

import React, { ChangeEvent, LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultPage, useReceiptTracker } from '../_hooks/useReceiptTracker';
import ResizableTable from '@/sharedComponents/ResizableTable';
import { formatDateInput, splitInThousand, splitInThousandForTextInput } from '@/utils/miscelaneous';
import useGeneratePDF from '@/sharedHooks/useGeneratePDF';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePage from '@/sharedComponents/DraggablePage';
import { useParams } from 'next/navigation';
import api from '@/redux/api';
import Teleport from '@/utils/Teleport';
import StatusIcon from '@/sharedComponents/CustomIcons';
import Papa from "papaparse";
import { IUpdateFileRequest } from '@/types/shared.types';
import Image from 'next/image';
import axios from 'axios';
import { IReceiptTrackerPage, IReceiptTrackerTableRow } from '../_types/types';

const ReceiptTracker: React.FC<{csvString: string, isLoggedIn: boolean, loadedSucessfully: boolean }> = ({ csvString, isLoggedIn, loadedSucessfully }) => {

  const params = useParams<any>();

  const tableContainerRef = useRef<HTMLTableRowElement|null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement|null>(null);
  const cursorPositionRef = useRef<number | null>(null);

  const [ tableWidth, setTableWidth ] = useState(2);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);


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

  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "A3", fileName: `Account Report.pdf`})
  const { createPdf: createDocumentPDF, elementRef: singleDocumentRef } = useGeneratePDF({ orientation: "portrait", paperSize: "A3", getFileName: (fileName) => `${fileName}.pdf` })
  
  const [ saveFile, { isLoading: isSaving, isSuccess: saveFileIsSuccess, isError: saveFileIsError } ] = api.commonApis.useSaveFileMutation();
  const [ uploadImage, { isLoading: isUploadingImage, isSuccess: isUploadingImageSuccess} ] = api.commonApis.useUploadImageMutation();
  const [ saveFileInFileFolder, { data: uploadImageToFolderSuccess, isLoading: saveFileInFolderIsLoading, isSuccess: isUploadImageInFolderSuccess } ] = api.commonApis.useSaveFileInFileFolderMutation();

  const {
    pages,
    updatePageTitle,
    updatePageSubtitle,
    addPage,
    removePage,
    insertRow,
    removeRow,
    undo,
    redo,
    canUndo,
    canRedo,
    updateImageUrl,
    handleCSVImport,
    generateCSVData,
    downloadPageCSV,
    downloadAllPagesCSV,
    loadCSVData,
    handleInputChange,
    updateRowsToAdd,
    setPages,
    updatePages,
    handleNumericInputBlur,
    handleKeyDown,
    inputRefs,
    movePage
  } = useReceiptTracker();

  /* Loading CSV file fetched from the server using SSR */
  useEffect(() => {
    if (csvString) {
      loadCSVData(Papa.parse(csvString)?.data as string[][]);
    } else {
      setPages([{ ...defaultPage }]);
    }
  }, []);

  const handleSaveFile = (saveType: IUpdateFileRequest["updateType"]) => {
    if (isLoggedIn && loadedSucessfully) {
      const csvData = pages.map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
      saveFile({ fileId: params?.fileId, content: csvData, mimeType: "text/csv", updateType: saveType })
    }
  }

  /* Autosave page change tracker debounce effect */
  useEffect(() => {
    // Skip the effect on the first render
    const newTimer: NodeJS.Timer|null = null;

    if (isFirstRender.current) {
      isFirstRender.current = false; // Set to false after first render
      return;
    } else {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      const newTimer = setTimeout(() => {
        if (!isFirstRender.current && isLoggedIn && loadedSucessfully && !isFirstRender.current) {
          handleSaveFile("autosave");
        }
        clearTimeout(newTimer);
      }, 3000);
  
      setSaveTimer(newTimer);
    }

    return () => {
      if (newTimer) {
        clearTimeout(newTimer);
      }
    };
  }, [ pages ]);

  useEffect(() => {
    if (isUploadImageInFolderSuccess) {
      
    }
  }, [ isUploadImageInFolderSuccess ])

  // console.log(uploadImageToFolderSuccess)
  // console.log(params?.fileId)



  // useEffect(() => {
  //   // Skip the effect on the first render
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }

  //   // Clear the previous timer
  //   if (saveTimer) {
  //     clearTimeout(saveTimer);
  //   }

  //   // Set a new timer to autosave after 3 seconds
  //   const newTimer = setTimeout(() => {
  //     if (isLoggedIn && loadedSucessfully) {
  //       handleSaveFile("autosave");
  //     }
  //   }, 3000);

  //   setSaveTimer(newTimer);

  //   // Clear the timer on cleanup
  //   return () => {
  //     if (newTimer) {
  //       clearTimeout(newTimer);
  //     }
  //   };
  // }, [pages]);


  const resetCursorPosition = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const arr = [3,6]
    setTimeout(() => {
      input.selectionStart = arr.includes(cursorPositionRef.current as number) ? ((cursorPositionRef.current as number) + 1) : cursorPositionRef.current;
      input.selectionEnd = arr.includes(cursorPositionRef.current as number) ? ((cursorPositionRef.current as number) + 1) : cursorPositionRef.current;
    }, 0);
  };

  const handleAddImageURL = (pageIndex: number, imageUrl: string): void => {
    updateImageUrl("https://www.nairaland.com/attachments/14813012_nnpclogo_jpeg26c1f6fedaaf45fdf84e047f1ceb9a4c", 0)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Teleport rootId='saveIconPosition'>
        <button onClick={() => handleSaveFile("versionedSave")} className="h-max flex items-center justify-center my-auto">
          <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
        </button>
      </Teleport>
      
      <main className=" w-full border-zinc-200 ">
        <div ref={elementRef as LegacyRef<HTMLDivElement>} className="max-w-[1080px] mx-auto">
          {pages?.map((page, pageIndex) => (
            <DraggablePage key={pageIndex} pageIndex={pageIndex} movePage={movePage}>
              <div key={pageIndex} ref={(el: HTMLDivElement) => {((singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el)}} className="mb-8 w-full  max-w-[1080px] md:rounded mx-auto bg-white px-4 pt-8 pb-6 xl:pb-8 border border-zinc-300">
                {/* { page?.imageUrl && <Image height={90} width={90} src={page.imageUrl as string} alt='alternative' className='object-contain ml-4' /> } */}
                <div ref={tableContainerRef} className="max-w-screen-lg relative mx-auto">
                  <div className="relative h-max">
                    <p style={{ fontFamily: "sans-serif"}} className="invisib py-1 text-3xl border- border-white outline-none font-bold w-ful text-center">{page.title}<span className="invisible">.</span></p>
                    <textarea style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ TITLE HERE... ]' autoFocus className="noExport text-3xl py-1 resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 right-0 outline-none border- border-zinc-300/80 font-bold w-ma w-ful mx-auto text-center" />
                  </div>
                  <div className="mb-2 noExport" />
                  <div className="relative mb-1">
                    <p style={{ fontFamily: "sans-serif"}} className="text-center  py-1 border- border-white invisibl outline-none text-lg text-black/80 font-semibold w-full">{page.subTitle}<span className="invisible">.</span></p>
                    <textarea style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ SUBTITLE; eg. FROM PERIOD OF 1ST <MONTH> <YEAR> TO 30TH <MONTH> <YEAR>... ]' className={` noExport text-center py-1 resize-none absolute !overflow-visible no-scrollbar left-0 top-0 outline-none border- border-zinc-300/80 text-lg text-black/80 font-semibold h-full w-full`} />
                  </div>
                  <div className="mb-3 noExport" />
                  <ResizableTable
                    headers={["DATE", "NAME", "AMOUNT", "SUB TOTAL", "RECEIPT"]}
                    minCellWidth={100}
                    tableContent={
                      <tbody ref={tbodyRef} className=''>
                        <>
                          {page.rows.map((row, rowIndex) => (
                            <TableRow
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
                  <div className={`mt-6 noExport flex [&>*]:grow flex-wrap gap-3`}>
                    <label htmlFor={`csv-import-${pageIndex}`} className="px-4 py-2 cursor-pointer text-center bg-rose-500 text-white rounded" >
                      Load CSV
                      <input id={`csv-import-${pageIndex}`} type="file" accept=".csv" className='hidden' name={`${pageIndex}`} onChange={(e) => handleCSVImport(e, pageIndex)} />
                    </label>
                    {/* <button className="px-4 py-2 bg-amber-500 text-white rounded" onClick={() => handleAddImageURL(pageIndex, "sdf")}>
                      Add Logo
                    </button> */}
                    <button className="px-4 py-2 bg-amber-500 text-white rounded" onClick={() => downloadPageCSV(pageIndex)}>
                      Download CSV
                    </button>
                    <button className="px-4 py-2 bg-green-500  text-white rounded" onClick={() => createDocumentPDF(pageIndex, page.title)} >
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => removePage(pageIndex)} >
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
          ))}

          {/* Global Actions */}
          <div className={`flex flex-wrap max-md:px-4 noExport flex-row gap-3 lg:gap-4 justify-end`}>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={downloadAllPagesCSV}
            >
              Download All Pages as CSV
            </button>
            <button
              className="px-4 py-2 bg-amber-500 text-white rounded"
              onClick={createPdf}
            >
              Download All Pages as PDF
            </button>
            <label
              htmlFor='csv-import'
              className="px-4 py-2 cursor-pointer bg-rose-500 text-white rounded"
            >
              Import CSV
              <input id='csv-import' type="file" accept=".csv" className='hidden' onChange={handleCSVImport} />
            </label>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => addPage(pages.length - 1)}
            >
              Add New Page
            </button>
            
          </div>
        </div>
      </main>
    </DndProvider>
  );
};

export default ReceiptTracker;

interface ITableRowProps {
  row: IReceiptTrackerTableRow;
  pageIndex: number;
  rowIndex: number;
  inputRefs: any;
  handleInputChange: (pageIndex: number, rowIndex: number, field: string, value: string | number) => void;
  insertRow: (pageIndex: number, rowIndex: number, rowsToAdd?: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, pageIndex: number, rowIndex: number, columnKey: string) => void;
  tableWidth: number;
  cursorPositionRef: any;
  resetCursorPosition: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumericInputBlur: (pageIndex: number, rowIndex: number, field: string, event: ChangeEvent<HTMLInputElement>) => void;
  removeRow: (pageIndex: number, rowIndex: number) => void;
  isLoggedIn: boolean;
  pages: IReceiptTrackerPage[]
  setPages: React.Dispatch<React.SetStateAction<IReceiptTrackerPage[]>>;
  params: any;
}

function TableRow({ row, pageIndex, rowIndex, inputRefs, handleInputChange, insertRow, handleKeyDown, tableWidth, cursorPositionRef, resetCursorPosition, handleNumericInputBlur, removeRow, isLoggedIn, pages, setPages, params }: ITableRowProps) {

  const [ isLoading, setIsLoading ] = useState({ uploading: false, deleting: false, removingRow: false });
  
  const handleUploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number, rowIndex: number) => {
    if (!e.target.files || !isLoggedIn) return;
    setIsLoading({ ...isLoading, uploading: true });
    const imageFile = e.target.files[0];
    const data = new FormData();
    data.append("content", imageFile);
    data.append("fileId", params?.fileId);

    axios.put<{ id: string, url: string }>("/api/google-drive/file-in-folder", data)
      .then((res) => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].rows[rowIndex].receipt = `${res.data?.id}<||>${res.data?.url}`;
        setPages(pagesCopy);
        setIsLoading({ ...isLoading, uploading: false })
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, uploading: false })
        console.log(err)
      })
  };

  const handleDeleteReceipt = async (fileId: string, action?: any) => {
    setIsLoading({ ...isLoading, deleting: true, removingRow: action ? true : false });
    axios.delete(`/api/google-drive/file?fileId=${fileId}`)
      .then(() => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].rows[rowIndex].receipt = "";
        setPages(pagesCopy);
        if (action) action();
        setIsLoading({ ...isLoading, deleting: false, removingRow: false });
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, deleting: false, removingRow: false });
        console.log(err)
      })
  }

  const handleRemoveRow = async (pageIndex: number, rowIndex: number, row: IReceiptTrackerTableRow) => {
    if (row?.receipt && row?.receipt !== "0") {
      await handleDeleteReceipt(
        row?.receipt?.split("<||>")[0], () => {
          removeRow(pageIndex, rowIndex)
        }
      );
    } else {
      removeRow(pageIndex, rowIndex);
    }
  };

  return (
    <tr style={{ fontFamily: "sans-serif"}} className={`relative group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
      <td  className="  items-center relative ">
        <div style={{ width: `${tableWidth}px`}} className="bg-transparen bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
          <button onClick={() => insertRow(pageIndex, rowIndex+1)} className="bg-green-500 hidden duration-300 group-hover/line:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-2 items-center justify-center font-semibold">+</button>
        </div>
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-date`, el)}}
          type="text"
          value={row.date}
          className='w-full h-full px-1 text-right focus:outline focus:outline-2 focus:outline-zinc-400 font-medium'
          onChange={e => { handleInputChange(pageIndex, rowIndex, 'date', formatDateInput(e.target.value)), cursorPositionRef.current = e.target.selectionStart, resetCursorPosition(e) }}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "date")}
        />
      </td>

      <td className="  items-center relative">
        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.receiptName}</p> {/* Placeholder to hold textarea height autoresize */}
        <textarea
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-receiptName`, el)}}
          value={row.receiptName}
          rows={1}
          className={`w-full ${(row.receiptName === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-zinc-400 font-sans tracking-wide font-bold" : "font-medium"} absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'receiptName', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "receiptName")}
        />
      </td>
      
      <td className="items-center " >
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-receipt`, el)}}
          className='w-full h-full px-1 text-right text-green-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={splitInThousandForTextInput(row.amount === "0" ? "" : row.amount)}
          // disabled={(!!row.receipt&&row.receipt!=="0") || row.receiptName === "BALANCE BROUGHT FORWARD"}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'amount', e.target.value?.replace(/[^0-9.]/g, ""))}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "receipt")}
          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "amount", e)}
        />
      </td>

      <td className={`px-1 relative text-right flex justify-end text-black/80 items-center ${parseFloat(row.subTotal) < 0 && "text-red-600"} ${(rowIndex === 0 && row?.receiptName === "BALANCE BROUGHT FORWARD") ? "!font-bold" : "font-medium"}`}>
        {splitInThousand(row.subTotal)}
      </td>

      <td className={`flex items-center ${!isLoading ? "cursor-not-allowed" : ""}`}>
        <div className="bg-transparen bg-transparent peer/test flex flex-row gap-2 items-center relative bg-tes w-[calc(100%+10px)] -right-3 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
          {
            (row?.receipt && row?.receipt !== "0") ? (
              !isLoading.deleting
              ? (
                <>
                  <a href={row.receipt?.split("<||>")[1]} target='_blank' rel='noreferrer' className="!text-blue-600 underline">Link</a>
                  <button onClick={() => handleDeleteReceipt(row.receipt?.split("<||>")[0])} className='noExport'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                </>
              ) : (
                tableRowSpinner
              )
              
            ) : (
              !isLoading.uploading
              ? (
                <label htmlFor={`file-input-${pageIndex}-${rowIndex}`} className='noExport' title='You can drag and drop in the column cell to upload a receipt'>
                  <p className="text-purple-600 underline">Upload</p>
                  <input disabled={!isLoggedIn} type="file" id={`file-input-${pageIndex}-${rowIndex}`} className='hidden' onChange={(e) => handleUploadReceipt(e, pageIndex, rowIndex)} />
                </label>
              ) : (
                tableRowSpinner
              )
            )
          }
          <button onClick={() => handleRemoveRow(pageIndex, rowIndex, row)} className="peer/removeBtn bg-red-400  duration-300 z-[3] hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-3 items-center justify-center font-semibold">-</button>
          <div style={{ width: `${tableWidth}px`}} className={`${(isLoading.deleting && isLoading.removingRow) ? "!bg-red-500/70 animate-pulse !block" : ""}  remove-hover w-full h-full hidden peer-hover/removeBtn:block bg-red-400/20 -translate-x-3 top-0 right-0 absolute`}></div>
        </div>
      </td>
    </tr>
  )
}

const tableRowSpinner = <svg width="25" height="25" viewBox="0 0 24 24" fill="#343C54" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
<path d="M13.7507 3.74805C13.7507 2.78155 12.9672 1.99805 12.0007 1.99805C11.0342 1.99805 10.2507 2.78155 10.2507 3.74805C10.2507 4.71455 11.0342 5.49815 12.0007 5.49815C12.9672 5.49815 13.7507 4.71455 13.7507 3.74805Z" fill="#343C54"/>
<path d="M18.366 6.69439C18.6589 6.4015 18.6589 5.92663 18.366 5.63373C18.0731 5.34084 17.5983 5.34084 17.3054 5.63373C17.0125 5.92663 17.0124 6.40157 17.3053 6.69446C17.5982 6.98736 18.0731 6.98729 18.366 6.69439Z" fill="#343C54"/>
<path d="M21.1477 12C21.1477 12.4943 20.747 12.895 20.2527 12.895C19.7584 12.895 19.3576 12.4943 19.3576 12C19.3576 11.5057 19.7583 11.105 20.2526 11.105C20.7469 11.105 21.1477 11.5057 21.1477 12Z" fill="#343C54"/>
<path d="M17.1003 18.5713C17.5064 18.9775 18.1649 18.9775 18.5711 18.5713C18.9772 18.1652 18.9772 17.5067 18.5711 17.1005C18.1649 16.6944 17.5064 16.6943 17.1002 17.1005C16.6941 17.5066 16.6942 18.1652 17.1003 18.5713Z" fill="#343C54"/>
<path d="M12.0007 19.067C12.6552 19.067 13.1857 19.5975 13.1857 20.252C13.1857 20.9064 12.6552 21.4371 12.0007 21.4371C11.3463 21.4371 10.8157 20.9065 10.8157 20.2521C10.8157 19.5976 11.3463 19.067 12.0007 19.067Z" fill="#343C54"/>
<path d="M7.10623 18.7764C7.62562 18.257 7.62562 17.4149 7.10623 16.8955C6.58683 16.3761 5.74472 16.3761 5.22532 16.8955C4.70592 17.4149 4.70585 18.2571 5.22525 18.7765C5.74465 19.2959 6.58683 19.2958 7.10623 18.7764Z" fill="#343C54"/>
<path d="M5.22354 12C5.22354 12.8146 4.56316 13.475 3.74854 13.475C2.93392 13.475 2.27344 12.8146 2.27344 12C2.27344 11.1854 2.93382 10.525 3.74844 10.525C4.56306 10.525 5.22354 11.1854 5.22354 12Z" fill="#343C54"/>
<path d="M5.02026 7.30958C5.65291 7.94222 6.67864 7.94222 7.31129 7.30958C7.94394 6.67693 7.94394 5.6512 7.31129 5.01855C6.67864 4.3859 5.65284 4.38583 5.02019 5.01848C4.38754 5.65113 4.38761 6.67693 5.02026 7.30958Z" fill="#343C54"/>
</svg>