"use client"

import React, { ChangeEvent, LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultPage, useReceiptTracker } from '../_hooks/useReceiptTracker';
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
import { IReceiptTrackerPage, IReceiptTrackerTableRow } from '../_types/types';
import SheetTableRow from '../_components/SheetTableRow';
import SheetTablePage from '../_components/SheetTablePage';

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

  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "C3", fileName: `Account Report.pdf`})
  const { createPdf: createDocumentPDF, elementRef: singleDocumentRef } = useGeneratePDF({ orientation: "portrait", paperSize: "C3", getFileName: (fileName) => `${fileName}.pdf` })
  
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
      const csvData = pages.map((page) => generateCSVData(page)).join('\n,,,,,\n,,,,,\n');
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
            <SheetTablePage
              key={`sheet-page-${pageIndex}`}
              fileId={params?.fileId}
              pageIndex={pageIndex}
              inputRefs={inputRefs}
              handleInputChange={handleInputChange}
              insertRow={insertRow}
              handleKeyDown={handleKeyDown}
              cursorPositionRef={cursorPositionRef}
              resetCursorPosition={resetCursorPosition}
              handleNumericInputBlur={handleNumericInputBlur}
              removeRow={removeRow}
              isLoggedIn={isLoggedIn}
              pages={pages}
              setPages={setPages}
              params={params}
              page={page}
              addPage={addPage}
              createDocumentPDF={createDocumentPDF}
              downloadPageCSV={downloadPageCSV}
              handleCSVImport={handleCSVImport}
              movePage={movePage}
              removePage={removePage}
              singleDocumentRef={singleDocumentRef}
              updatePageSubtitle={updatePageSubtitle}
              updatePageTitle={updatePageTitle}
              updateRowsToAdd={updateRowsToAdd}
              canRedo={canRedo}
              canUndo={canUndo}
              undo={undo}
              redo={redo}

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

export default ReceiptTracker;

