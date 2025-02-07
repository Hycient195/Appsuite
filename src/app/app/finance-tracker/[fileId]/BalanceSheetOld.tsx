"use client"

import React, { ChangeEvent, LegacyRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { defaultPage, useFinanceTracker } from '../_hooks/useFinanceTracker';
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
import BalanceSheetPage from '../_components/SheetTablePage';
import { BalanceSheetContextProvider } from '../_contexts/financeTrackerContext';
import ModuleFileHeader from '@/sharedComponents/ModuleFileHeader';

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

  const financeTrackerInstance = useFinanceTracker();

  const {
    pages,
    addPage,
    updateImageUrl,
    handleCSVImport,
    generateCSVData,
    loadCSVData,
    setPages,
  } = financeTrackerInstance;

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
    <div className="">
      {/* <ModuleFileHeader fileName={pages?.[0]?.title} subtitle={pages?.[0]?.subTitle} handleInitiateCreateFile={() => {}} /> */}
      <BalanceSheetContextProvider financeTrackerInstance={financeTrackerInstance}>
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
                  cursorPositionRef={cursorPositionRef}
                  page={page}
                  pageIndex={pageIndex}
                  resetCursorPosition={resetCursorPosition}
                  singleDocumentRef={singleDocumentRef as any}
                  tableContainerRef={tableContainerRef}
                  tableWidth={tableWidth}
                  tbodyRef={tbodyRef}
                  params={params}
                />
              ))}

              {/* Global Actions */}
              <div className={`flex flex-wrap max-md:px-4 noExport flex-row gap-3 lg:gap-4 justify-end`}>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  // onClick={downloadAllPagesCSV}
                >
                  Download All Pages as CSV
                </button>
                <button
                  className="px-4 py-2 bg-amber-500 text-white rounded"
                  // onClick={createPdf}
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
      </BalanceSheetContextProvider>
    </div>
  );
};

export default BalanceSheet;


