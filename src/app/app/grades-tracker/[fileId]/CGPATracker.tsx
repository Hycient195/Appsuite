"use client"

import React, { ChangeEvent, LegacyRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { defaultPage, useCGPATracker } from '../_hooks/useCGPATracker';
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
import axios from 'axios';
import LoadingButton from '@/sharedComponents/LoadingButton';
import CGPATrackerPage from '../_components/SheetTablePage';
import { FormSelect } from '@/sharedComponents/FormInputs';
import { ICGPATrackerPage, IGradesTrackerDocument } from '../_types/types';
import { isLoggedIn } from '@/sharedConstants/common';

const CGPATracker: React.FC<{csvString: IGradesTrackerDocument, fileName: string, loadedSucessfully: boolean }> = ({ csvString, fileName, loadedSucessfully }) => {

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
        setTableWidth(tableContainerRef.current.clientWidth);
      }
    })
  }

  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "B3", fileName: `Account Report.pdf`})
  const { createPdf: createDocumentPDF, elementRef: singleDocumentRef } = useGeneratePDF({ orientation: "portrait", paperSize: "B3", getFileName: (fileName) => `${fileName}.pdf` })
  
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
    movePage,
    updateCGPAScale,
    documentFile,
    setDocumentFile
  } = useCGPATracker();

  /* Loading CSV file fetched from the server using SSR */
  useEffect(() => {
    if (csvString) {
      setPages(csvString?.pages as ICGPATrackerPage[]);
      setDocumentFile({ filename: fileName?.split(".")?.[0], templateLayout: csvString?.templateLayout });
      // loadCSVData(Papa.parse(csvString)?.data as string[][]);
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
  }, [ isUploadingImageSuccess ]);

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
      <main className=" w-full border-zinc-200 -mt-4 relative">
        <div className="max-w-[1080px] mx-auto">
          <div className="!h-[20px] sticky !top-16 !bg-zinc-100 z-[2] noExport" />
          <div className="bg-white border-zinc-300 rounded-lg border p-4 sticky !top-[83px] z-[3]">
            <FormSelect labelText="CGPA Scale" value={pages?.[0]?.cgpaScale} onChange={(e) => updateCGPAScale(e.target.value)} options={[ { text: "5 Point Scale", value: "OVER5" }, { text: "4 Point Scale", value: "OVER4"} ]} />
          </div>
          <div className="!h-[25px] sticky !top-[175px] !bg-zinc-100 z-[2] noExport" /> {/** Margin for preview */}
        </div>
      
        <div ref={elementRef as LegacyRef<HTMLDivElement>} className="max-w-[1080px] bg-zinc-100 mx-auto">
          {(pages).map((page, pageIndex) => (
            <CGPATrackerPage
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
              // handleAddImageURL={handleAddImageURL}
              handleCSVImport={handleCSVImport}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown as any}
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

export default CGPATracker;


