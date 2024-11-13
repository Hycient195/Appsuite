"use client"

import React, { ChangeEvent, LegacyRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { defaultPage, useBalanceSheet } from '../_hooks/useBalanceSheet';
import ResizableTable from '@/sharedComponents/ResizableTable';
import { formatDateInput, replaceJSXRecursive, splitInThousand, splitInThousandForTextInput } from '@/utils/miscelaneous';
import useGeneratePDF from '@/sharedHooks/useGeneratePDF';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePage from '@/sharedComponents/DraggablePage';
import { useParams } from 'next/navigation';
import api from '@/redux/api';
import Teleport from '@/utils/Teleport';
import StatusIcon, { SaveLoadingSpinner } from '@/sharedComponents/CustomIcons';
import Papa from "papaparse";
import { IUpdateFileRequest } from '@/types/shared.types';
import Image from 'next/image';
import { IBalanceSheetPage } from '../_types/types';
import axios from 'axios';
import LoadingButton from '@/sharedComponents/LoadingButton';

const BalanceSheet: React.FC<{csvString: string, isLoggedIn: boolean, loadedSucessfully: boolean }> = ({ csvString, isLoggedIn, loadedSucessfully }) => {

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
  } = useBalanceSheet();

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
    if (isUploadingImageSuccess) {
      
    }
  }, [ isUploadingImageSuccess ])

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number) => {
    const newUrl = e.target.value;
    // setImageUrl(newUrl);
    updateImageUrl(newUrl, pageIndex);
  };

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
    updateImageUrl("https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz", 0)
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
          {(pages).map((page, pageIndex) => (
            <BalanceSheetPage
              key={`page-${pageIndex}`}
              isLoggedIn={isLoggedIn}
              pages={pages}
              setPages={setPages}
              addPage={addPage}
              canRedo={canRedo}
              canUndo={canUndo}
              createDocumentPDF={createDocumentPDF}
              cursorPositionRef={cursorPositionRef}
              downloadPageCSV={downloadPageCSV}
              handleAddImageURL={handleAddImageURL}
              handleCSVImport={handleCSVImport}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown as any}
              handleNumericInputBlur={handleNumericInputBlur}
              inputRefs={inputRefs}
              insertRow={insertRow}
              movePage={movePage}
              page={page}
              pageIndex={pageIndex}
              redo={redo}
              removePage={removePage}
              removeRow={removeRow}
              resetCursorPosition={resetCursorPosition}
              singleDocumentRef={singleDocumentRef as any}
              tableContainerRef={tableContainerRef}
              tableWidth={tableWidth}
              tbodyRef={tbodyRef}
              undo={undo}
              updatePageSubtitle={updatePageSubtitle}
              updatePageTitle={updatePageTitle}
              updateRowsToAdd={updateRowsToAdd}
              params={params}
            />
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

export default BalanceSheet;


interface IBalanceSheetPageProps {
  isLoggedIn: boolean;
  pages: IBalanceSheetPage[]
  setPages: React.Dispatch<React.SetStateAction<IBalanceSheetPage[]>>;
  pageIndex: number;
  page: IBalanceSheetPage;
  movePage: (sourceIndex: number, destinationIndex: number) => void;
  updatePageTitle: (title: string, pageIndex: number) => void;
  updatePageSubtitle: (subTitle: string, pageIndex: number) => void;
  insertRow: (pageIndex: number, rowIndex: number, rowsToAdd?: number) => void;
  removeRow: (pageIndex: number, rowIndex: number) => void;
  updateRowsToAdd: (pageIndex: number, action: "increament" | "decreament") => void;
  handleInputChange: (
    pageIndex: number,
    rowIndex: number,
    field: "date" | "narration" | "debit" | "credit",
    value: string
  ) => void;
  handleKeyDown: (
    e: React.KeyboardEvent,
    pageIndex: number,
    rowIndex: number,
    field: "date" | "narration" | "debit" | "credit"
  ) => void;
  handleNumericInputBlur: (
    pageIndex: number,
    rowIndex: number,
    field: "debit" | "credit",
    e: React.FocusEvent<HTMLInputElement>
  ) => void;
  handleCSVImport: (e: React.ChangeEvent<HTMLInputElement>, pageIndex: number) => void;
  handleAddImageURL: (pageIndex: number, imageUrl: string) => void;
  downloadPageCSV: (pageIndex: number) => void;
  createDocumentPDF: (pageIndex: number, title: string) => void;
  removePage: (pageIndex: number) => void;
  redo: () => void;
  undo: () => void;
  canRedo: boolean;
  canUndo: boolean;
  tableWidth: number;
  // imageSrc?: string;
  cursorPositionRef: React.MutableRefObject<number | null>;
  resetCursorPosition: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRefs: React.MutableRefObject<Map<string, HTMLInputElement | HTMLTextAreaElement|null>>;
  tbodyRef: React.RefObject<HTMLTableSectionElement>;
  tableContainerRef: React.RefObject<HTMLDivElement>;
  singleDocumentRef: React.MutableRefObject<HTMLDivElement[]|null>;
  addPage: (arg: any) => void
  params: any;
}

function BalanceSheetPage({ isLoggedIn, pages, setPages, canRedo, canUndo, createDocumentPDF, cursorPositionRef, downloadPageCSV, handleAddImageURL, handleCSVImport, handleInputChange, handleKeyDown, handleNumericInputBlur, inputRefs, insertRow, movePage, page, pageIndex, redo, removePage, removeRow, resetCursorPosition, singleDocumentRef, tableContainerRef, tableWidth, tbodyRef, undo, updatePageSubtitle, updatePageTitle, updateRowsToAdd, addPage, params }: IBalanceSheetPageProps) {
  const [ isLoading, setIsLoading ] = useState({ uploading: false, deleting: false, removingPage: false });
  const [ isDragging, setIsDragging ] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);



  // Prevent the default behavior to allow the drop event
  const handleReceiptDragOver = (e: any) => {
    e.preventDefault();
    if (!page?.imageUrl) setIsDragging(true);
  };

  // Optional: add styling or other effects when a file is dragged over
  const handleReceiptDragEnter = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    if (!page?.imageUrl) setIsDragging(true);
  };

  const handleReceiptDragLeave = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    setIsDragging(false);
  };

  const handleReceiptDrop = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0 && (!page?.imageUrl)) {
      // Call the provided upload handler with the event and indices
      handleUploadLogo(files[0], pageIndex);
      e.dataTransfer.clearData();
    }
  };

  const fetchImageAsBase64 = async () => {
    try {
      // const response = await fetch('https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz');
      // const response = await fetch(`/api/google-drive/image?imageUrl=${encodeURIComponent("https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz")}`);
      const response = await fetch(`/api/google-drive/image?imageUrl=${encodeURIComponent((page.imageUrl?.split("<||>")[1] as string)?.replace("file/d/","uc?export=view&id=")?.replace("/view?usp=drivesdk",""))}`);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(blob);
      setIsLoading({ ...isLoading, uploading: false });
    } catch (error) {
      console.error('Failed to load image', error);
      setIsLoading({ ...isLoading, uploading: false });
    }
  };

  useEffect(() => {
    if (page?.imageUrl) fetchImageAsBase64();
  }, [ ]);

  // Fetch and convert image to Base64
  useEffect(() => {
    if (page?.imageUrl) fetchImageAsBase64();
  }, [ page?.imageUrl ]);

  const handleUploadLogo = async (file: any, pageIndex: number) => {
    if (!file || !isLoggedIn) return;
    setIsLoading({ ...isLoading, uploading: true });
    const imageFile = file;
    const data = new FormData();
    data.append("fileId", params?.fileId);
    data.append("content", imageFile);

    axios.put<{ id: string, url: string }>("/api/google-drive/file-in-folder", data)
      .then((res) => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].imageUrl = `${res.data?.id}<||>${res.data?.url}`;
        setPages(pagesCopy);
        
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, uploading: false });
        console.log(err)
      })
  };

  const handleRemoveLogo = async (fileId: string, action?: any) => {
    setIsLoading({ ...isLoading, deleting: true, removingPage: action ? true : false });
    axios.delete(`/api/google-drive/file?fileId=${fileId}`)
      .then(() => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].imageUrl = "";
        setPages(pagesCopy);
        setImageSrc("");
        if (action) action();
        setIsLoading({ ...isLoading, deleting: false, removingPage: false });
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, deleting: false, removingPage: false });
        console.log(err)
      })
  }

  const handleRemovePage = async (pageIndex: number) => {
    if (page?.imageUrl) {
      await handleRemoveLogo(
        page.imageUrl?.split("<||>")[0], () => {
          removePage(pageIndex);
        }
      );
      removePage(pageIndex);
    } else {
      removePage(pageIndex);
    }
  };


  const hasLogoOrSpinner = useMemo(() => (isLoading.uploading || isLoading.deleting || isLoading.removingPage || page?.imageUrl), [ isLoading, page.imageUrl])
  return (
    <DraggablePage pageIndex={pageIndex} movePage={movePage}>   

      <div key={pageIndex} ref={(el: HTMLDivElement) => {(singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el}} className={`${isLoading.removingPage ? "bg-red-600/60 animate-pulse" : "bg-white"} relative mb-8 w-full  max-w-[1080px] md:rounded mx-auto px-4 pt-8 pb-6 xl:pb-8 border border-zinc-300`}>
        
        
        <div ref={tableContainerRef} className="max-w-screen-lg relative mx-auto">
          <div className={`${hasLogoOrSpinner ? "grid-cols-[90px_1fr_90px]" : "grid-cols-1"} table-top grid gap-3`}>
            {
              (isLoading.uploading || isLoading.deleting || isLoading.removingPage || page?.imageUrl)
              ? <div className={`${isDragging ? "bg-green-500/40" : ""} relative !overflow-hidden z-[2] !w-[80px] !h-[80px] -translate-y-2 `} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
                {
                  (isLoading.uploading || isLoading.removingPage || isLoading.deleting)
                  ? (
                    <SaveLoadingSpinner height={70} width={70} className='' />
                  ) : (page.imageUrl && imageSrc) && (
                    <Image fill src={imageSrc as string}  alt='alternative'  className='object-contain w-full h-auto aspect-square'  onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop} />
                  )
                }
              </div>
              : (
                <div className={`${isDragging ? "bg-green-500/20" : "bg-zinc-100"} absolute z-[1] h-[60px] w-[65px]  flex items-center p-2 justify-center text-center rounded  -top-3 -left-1 noExport`} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
                  <span className="text-xs text-zinc-400">Drop Logo</span>
                </div>
              )
            }
            <div className="titles grid !max-w-[800px] w-full mx-auto">
              <div className="relative h-max !max-w-[800px] w-full mx-auto bg-ts">
                <p style={{ fontFamily: "sans-serif"}} className="invisib !max-w-[800px] w-full mx-auto py-1 text-2xl border- border-white outline-none font-bold w-ful text-center">{replaceJSXRecursive(page.title, { "\n": <br />})}<span className="invisible">.</span></p>
                <textarea style={{ fontFamily: "sans-serif" }} value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} placeholder='[ TITLE HERE... ]' autoFocus className="noExport !max-w-[800px] w-full mx-auto text-2xl py-1 resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 right-0 outline-none border- border-zinc-300/80 font-bold w-ma w-ful text-center" />
              </div>
              <div className="mb-2 noExport" />
              <div className="relative mb-1">
                <p style={{ fontFamily: "sans-serif"}} className="text-center  py-1 border- border-white invisibl outline-none text-lg text-black/80 font-semibold w-full">{page.subTitle}<span className="invisible">.</span></p>
                <textarea style={{ fontFamily: "sans-serif" }} value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} placeholder='[ SUBTITLE; eg. FROM PERIOD OF 1ST <MONTH> <YEAR> TO 30TH <MONTH> <YEAR>... ]' className={` noExport text-center py-1 resize-none absolute !overflow-visible no-scrollbar left-0 top-0 outline-none border- border-zinc-300/80 text-lg text-black/80 font-semibold h-full w-full`} />
              </div>
            </div>
          </div>
         
          <div className="mb-3 noExport" />
          <ResizableTable
            headers={["DATE", "NARRATION", "DEBIT", "CREDIT", "BALANCE"]}
            minCellWidth={100}
            tableContent={
              <tbody ref={tbodyRef} className=''>
                <>
                  {page.rows.map((row, rowIndex) => (
                    <tr style={{ fontFamily: "sans-serif"}} key={rowIndex} className={`relative group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
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
                        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.narration}</p> {/* Placeholder to hold textarea height autoresize */}
                        <textarea
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-narration`, el)}}
                          value={row.narration}
                          rows={1}
                          className={`w-full ${(row.narration === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-zinc-400 font-sans tracking-wide font-bold" : "font-medium"} absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'narration', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "narration")}
                        />
                      </td>
                      <td className="flex items-center">
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-credit`, el)}}
                          className='w-full h-full px-1 text-right text-red-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                          value={splitInThousandForTextInput(row.debit === "0" ? "" : row.debit)}
                          disabled={(!!row.credit&&row.credit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'debit', e.target.value?.replace(/[^0-9.]/g, ""))}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "credit")}
                          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "debit", e)}
                        />
                      </td>
                      <td className="items-center" >
                        <input
                          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-debit`, el)}}
                          className='w-full h-full px-1 text-right text-green-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                          value={splitInThousandForTextInput(row.credit === "0" ? "" : row.credit)}
                          disabled={(!!row.debit&&row.debit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
                          onChange={e => handleInputChange(pageIndex, rowIndex, 'credit', e.target.value?.replace(/[^0-9.]/g, ""))}
                          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "debit")}
                          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "credit", e)}
                        />
                      </td>
                      <td className={`peer/test  px-1 relative text-right flex justify-end text-black/80 items-center ${parseFloat(row.balance) < 0 && "text-red-600"} ${(rowIndex === 0 && row?.narration === "BALANCE BROUGHT FORWARD") ? "!font-bold" : "font-medium"}`}>
                        <div className="bg-transparen bg-transparent bg-tes w-[calc(100%+10px)] -right-3 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
                          <button onClick={() => removeRow(pageIndex, rowIndex)} className="peer/removeBtn bg-red-400  duration-300 z-[3] hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-3 items-center justify-center font-semibold">-</button>
                          <div style={{ width: `${tableWidth}px`}} className="remove-hover w-full h-full hidden peer-hover/removeBtn:block bg-red-400/20 -translate-x-3 top-0 right-0 absolute "></div>
                        </div>
                        {splitInThousand(row.balance)}
                      </td>
                    </tr>
                  ))}
                </>

              {/* Total Credit, Debit, and Final Balance Row */}
              <tr style={{ fontFamily: "sans-serif"}} >
                <td className="px-1 py-2 text-right" />
                {/* <td className="px-1 py-2 text-right">{page.imageUrl}</td> */}
                <td className="px-1 py-2 text-center font-bold">TOTAL</td>
                <td className="px-1 py-2 text-right font-bold text-red-600">{splitInThousand(page.totalDebit)}</td>
                <td className="px-1 py-2 text-right font-bold text-green-600">{splitInThousand(page.totalCredit)}</td>
                <td className="px-1 py-2 text-right font-bold">{splitInThousand(page.finalBalance)}</td>
              </tr>
            </tbody>
            }
          />
          <div className="line noExport" />
          <div className={`mt-6 noExport flex [&>*]:grow flex-wrap gap-3`}>
            <label htmlFor={`csv-import-${pageIndex}`} className="px-4 py-2 cursor-pointer text-center bg-rose-500 text-white rounded" >
              Load CSV
              <input id={`csv-import-${pageIndex}`} type="file" accept=".csv"  className='hidden' name={`${pageIndex}`} onChange={(e) => handleCSVImport(e, pageIndex)} />
            </label>
            {
              !imageSrc
              ? (
                <label htmlFor={`add-logo-${pageIndex}`}  className="px-4 py-2 cursor-pointer text-center bg-violet-500 text-white rounded" >
                  Add Logo
                  <input id={`add-logo-${pageIndex}`} type="file" accept="image/jpeg, image/jpg, image/png" className='hidden' name={`${pageIndex}`} onChange={(e) => handleUploadLogo(e.target.files![0], pageIndex)} />
                </label>
              ) : (
                <LoadingButton loading={isLoading.deleting || isLoading.removingPage} className="!px-4 !py-2 bg-violet-500 text-white !rounded" onClick={() => handleRemoveLogo(page?.imageUrl?.split("<||>")[0] as string)} >
                  Remove Logo
                </LoadingButton>
              )
            }
           
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