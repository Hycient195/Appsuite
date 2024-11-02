"use client"

import React, { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBalanceSheet } from '../_hooks/useBalanceSheet';
import ResizableTable from '@/sharedComponents/ResizableTable';
import { formatDateInput, parseCSV, splitInThousand } from '@/utils/miscelaneous';
import useGeneratePDF from '@/sharedHooks/useGeneratePDF';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePage from '@/sharedComponents/DraggablePage';
import { useParams } from 'next/navigation';
import TableSkeleton from '@/sharedComponents/skeletons/TableSkeleton';
import api from '@/redux/api';
import LoadingButton from '@/sharedComponents/LoadingButton';
import DraggableRow from '@/sharedComponents/DraggableRow';
import Teleport from '@/utils/Teleport';
import StatusIcon from '@/sharedComponents/CustomIcons';

const BalanceSheet: React.FC = () => {
  const params = useParams<any>();

  const tableContainerRef = useRef<HTMLTableRowElement|null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement|null>(null);
  const [ tableWidth, setTableWidth ] = useState(2);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true); // Ref to track the first render


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

  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "A3", fileName: `Audit report on property.pdf`})
  const { createPdf: createDocumentPDF, elementRef: singleDocumentRef } = useGeneratePDF({ orientation: "portrait", paperSize: "A3", getFileName: (fileName) => `${fileName}.pdf` })
  
  const movePage = (fromIndex: number, toIndex: number) => {
    const updatedPages = [...pages];
    const [movedPage] = updatedPages.splice(fromIndex, 1);
    updatedPages.splice(toIndex, 0, movedPage);
    setPages(updatedPages);
    updatePages(updatedPages);
  };

  const moveRow = (draggedRowIndex: number, targetRowIndex: number, pageIndex: number) => {
    const pagesCopy = [ ...pages ];
    const currentPageRows = pages[pageIndex];
    
    if (!currentPageRows || draggedRowIndex === targetRowIndex) {
      return;
    }
  
    const updatedRows = [...currentPageRows.rows];
    const [movedRow] = updatedRows.splice(draggedRowIndex, 1);
    updatedRows.splice(targetRowIndex, 0, movedRow);
    pagesCopy[pageIndex].rows = updatedRows;
    setPages(pagesCopy);
  };

  const [ saveFile, { isLoading: isSaving, isSuccess: saveFileIsSuccess, isError: saveFileIsError } ] = api.commonApis.useSaveFileMutation();
  const { isSuccess, data, isLoading }  = api.commonApis.useGetFileQuery(params?.fileId);

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
    handleCSVImport,
    loadCSVData,
    generateCSVData,
    downloadPageCSV,
    downloadAllPagesCSV,
    handleInputChange,
    updateRowsToAdd,
    setPages,
    updatePages
  } = useBalanceSheet();

  useEffect(() => {
    if (isSuccess) {
      loadCSVData(parseCSV(data));
    }
  }, [ isSuccess ]);



  const handleSaveFile = () => {
    const csvData = pages.map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
    saveFile({ fileId: params?.fileId, content: csvData })
  }

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
        if (!isFirstRender.current && !isLoading) {
          handleSaveFile();
        }
        clearTimeout(newTimer);
      }, 4000);
  
      setSaveTimer(newTimer);
    }

    return () => {
      if (newTimer) {
        clearTimeout(newTimer);
      }
    };
  }, [pages]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Teleport rootId='saveIconPosition'>
        <button onClick={handleSaveFile} className="h-max flex items-center justify-center my-auto">
          <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
        </button>
      </Teleport>
      <main className=" w-full border-zinc-200 ">
        <div ref={elementRef as LegacyRef<HTMLDivElement>} className="max-w-[1080px] mx-auto">
          {pages.map((page, pageIndex) => (
            <DraggablePage key={pageIndex} pageIndex={pageIndex} movePage={movePage}>
              {/* @ts-ignore */}
              <div key={pageIndex} ref={(el: HTMLDivElement) => ((singleDocumentRef.current as HTMLDivElement[])[pageIndex] = el)} className="mb-8 w-full  max-w-[1080px] md:rounded mx-auto bg-white px-4 pt-8 pb-6 xl:pb-8 border border-zinc-300">
                <div ref={tableContainerRef} className="max-w-screen-lg relative mx-auto">
                  {/* {
                    !isLoading
                    ? (
                      <div className="relative h-max animate-fade-in">
                        <p className="invisib text-3xl outline-none font-bold w-full text-center">{page.title}</p>
                        <textarea value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} autoFocus className="text-3xl resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 outline-none font-bold w-full text-center" /> <br />
                      </div>
                      
                    ) : (
                      <>
                        <p className="invisib text-3xl text-zinc-400 animate-pulse outline-none font-bold w-full text-center">PAGE TITLE</p>
                        <br />
                      </>
                    )
                  } */}
                  <div className="relative h-max">
                    <p className="invisib text-3xl outline-none font-bold w-full text-center">{page.title}</p>
                    <textarea value={page.title} onChange={(e) => updatePageTitle(e.target.value, pageIndex)} autoFocus className="text-3xl resize-none absolute h-full !overflow-visible no-scrollbar top-0 left-0 outline-none font-bold w-full text-center" /> <br />
                  </div>
                  
                  <div className="relative">
                    <p className="text-center invisible outline-none text-lg text-black/80 font-semibold w-full mb-4">{page.subTitle}</p>
                    <textarea value={page.subTitle} onChange={(e) => updatePageSubtitle(e.target.value, pageIndex)} className={`${isLoading && "animate-pulse text-zinc-400"} text-center resize-none absolute !overflow-visible no-scrollbar left-0 top-0 outline-none text-lg text-black/80 font-semibold h-full w-full mb-4`} />
                  </div>
                  <ResizableTable
                    headers={["DATE", "NARRATION", "CREDIT", "DEBIT", "BALANCE"]}
                    minCellWidth={100}
                    tableContent={
                      <tbody ref={tbodyRef} className=''>
                        {
                          isLoading
                          ? (
                            <TableSkeleton numCols={5} className={`py-1 px-2 !border-zinc-300`} numRows={18} />
                          ) : (
                          <>
                            {page.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className={`relative group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
                                <td  className="  items-center relative ">
                                  <div style={{ width: `${tableWidth}px`}} className="bg-transparen bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
                                    <button onClick={() => insertRow(pageIndex, rowIndex+1)} className="bg-green-500 hidden duration-300 group-hover/line:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-2 items-center justify-center font-semibold">+</button>
                                  </div>
                                  <input
                                    type="text"
                                    value={row.date}
                                    className='w-full h-full px-1 text-right focus:outline focus:outline-2 focus:outline-zinc-400 font-medium'
                                    onChange={e =>
                                      handleInputChange(pageIndex, rowIndex, 'date', formatDateInput(e.target.value))
                                    }
                                  />
                                </td>
                                <td className="  items-center relative">
                                  <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.narration}</p>
                                  <textarea
                                    value={row.narration}
                                    rows={1}
                                    className={`w-full ${(row.narration === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-amber-600 font-sans tracking-wide font-bold" : "font-medium"} absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
                                    onChange={e =>
                                      handleInputChange(pageIndex, rowIndex, 'narration', e.target.value)
                                    }
                                  />
                                </td>
                                <td className="  items-center">
                                  <input
                                    className='w-full h-full px-1 text-right text-green-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                                    value={splitInThousand(row.credit === "0" ? "" : row.credit)}
                                    disabled={(!!row.debit&&row.debit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
                                    onChange={e =>
                                      handleInputChange(pageIndex, rowIndex, 'credit', e.target.value?.replace(/,/ig,"")?.replace(/[A-Z]/ig, ""))
                                    }
                                  />
                                </td>
                                <td className="items-center">
                                  <input
                                    className='w-full h-full px-1 text-right text-red-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
                                    value={splitInThousand(Number(row.debit) === 0 ? "" : row.debit)}
                                    disabled={(!!row.credit&&row.credit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
                                    onChange={e =>
                                      handleInputChange(pageIndex, rowIndex, 'debit', e.target.value?.replace(/,/ig,"")?.replace(/[A-Z]/ig, ""))
                                    }
                                  />
                                </td>
                                <td className={`peer/test px-2 relative text-right flex justify-end font-medium text-black/80 items-center ${row.balance < 0 && "text-red-600"}`}>
                                  <div className="bg-transparen bg-transparent bg-tes w-[calc(100%+30px)] -right-3 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
                                    <button onClick={() => removeRow(pageIndex, rowIndex)} className="peer/removeBtn bg-red-400  duration-300 z-[3] hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-3 items-center justify-center font-semibold">-</button>
                                    <div style={{ width: `${tableWidth}px`}} className="remove-hover w-full h-full hidden peer-hover/removeBtn:block bg-red-400/20 -translate-x-3 top-0 right-0 absolute "></div>
                                  </div>
                                  {splitInThousand(row.balance)}
                                </td>
                              </tr>
                            ))}
                          </>
                          )
                        }
                      
                      {/* Total Credit, Debit, and Final Balance Row */}
                      <tr>
                        <td className="px-1.5 tracking-wide py-2 text-right"/>
                        <td className="px-1.5 tracking-wide py-2 text-center font-bold">TOTAL</td>
                        <td className="px-1.5 tracking-wide py-2 text-right font-bold">{splitInThousand(page.totalCredit)}</td>
                        <td className="px-1.5 tracking-wide py-2 text-right font-bold">{splitInThousand(page.totalDebit)}</td>
                        <td className="px-1.5 tracking-wide py-2 text-right font-bold">{splitInThousand(page.finalBalance)}</td>
                      </tr>
                    </tbody>
                    }
                  />
                  <div className="line noExport" />
                  <div className={`mt-6 noExport flex [&>*]:grow flex-wrap gap-3`}>
                    <label
                      htmlFor={`csv-import-${pageIndex}`}
                      className="px-4 py-2 cursor-pointer text-center bg-rose-500 text-white rounded"
                    >
                      Load CSV
                      <input id={`csv-import-${pageIndex}`} type="file" accept=".csv" className='hidden' name={`${pageIndex}`} onChange={(e) => handleCSVImport(e, pageIndex)} />
                    </label>
                    <button
                      className="px-4 py-2 bg-amber-500 text-white rounded"
                      onClick={() => downloadPageCSV(pageIndex)}
                    >
                      Download Page CSV
                    </button>
                    <button
                      className="px-4 py-2 bg-green-500  text-white rounded"
                      onClick={() => !isLoading && createDocumentPDF(pageIndex, page.title)}
                    >
                      Download as PDF
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => removePage(pageIndex)}
                    >
                      Remove Page
                    </button>
                    <button
                      className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-500 text-white rounded"
                      onClick={redo}
                      disabled={!canRedo}
                    >
                      Redo
                    </button>
                    <button
                      className="px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-gray-500 text-white rounded"
                      onClick={undo}
                      disabled={!canUndo}
                    >
                      Undo
                    </button>
                    <div
                      className="px-4 py-2 cursor-pointer bg-blue-500 flex gap-2 items-center justify-between text-white rounded relative"
                      onClick={() => insertRow(pageIndex, page.rows.length, page.rowsToAdd)}
                    >
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
            {/* <LoadingButton
              className="px-4 !py-2 bg-violet-500 text-white rounded"
              loading={isSaving}
              onClick={() => handleSaveFile()}
            >
              Save File
            </LoadingButton> */}
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
              className="px-4 py-2 bg-rose-500 text-white rounded"
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