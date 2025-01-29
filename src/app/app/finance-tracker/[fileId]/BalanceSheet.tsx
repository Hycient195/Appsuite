"use client"

import React, { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultPage, useFinanceTracker } from '../_hooks/useFinanceTracker';
import useGeneratePDF from '@/sharedHooks/useGeneratePDF';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'next/navigation';
import api from '@/redux/api';
import Teleport from '@/utils/Teleport';
import StatusIcon from '@/sharedComponents/CustomIcons';
import { IUpdateFileRequest } from '@/types/shared.types';
import BalanceSheetPage from '../_components/SheetTablePage';
import { BalanceSheetContextProvider } from '../_contexts/financeTrackerContext';
import ModuleFileHeader from '@/sharedComponents/ModuleFileHeader';
import CustomModal from '@/sharedComponents/CustomModal';
import SheetExportModal from './_components/ExportModal';
import CreateFinanceTrackerSheet from '../_components/CreateSheet';
import { AnimatePresence } from 'motion/react';
import { IBalanceSheetPage, IFinanceTrackerDocument } from '../_types/types';
import usePageTracker from '@/sharedHooks/usePageTracker';
import SheetImportModal from './_components/ImportModal';

const BalanceSheet: React.FC<{csvString: IFinanceTrackerDocument, isLoggedIn: boolean, loadedSucessfully: boolean }> = ({ csvString, isLoggedIn, loadedSucessfully }) => {
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
  const { createPdf: createDocumentPDF, elementRef: singleDocumentRef } = useGeneratePDF({ orientation: "portrait", paperSize: "A3", getFileName: (fileName) => `${fileName}.pdf` });

  const [ saveFile, { isLoading: isSaving, isSuccess: saveFileIsSuccess, isError: saveFileIsError } ] = api.commonApis.useSaveFileMutation();
  const [ isExportModalOpen, setIsExportModalOpen ] = useState<boolean>(false);
  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState<boolean>(false);
  const [ isImportModalOpen, setIsImportModalOpen ] = useState<boolean>(false);

  const financeTrackerInstance = useFinanceTracker();

  const {
    pages, undo, redo, canUndo, canRedo,
    setPages, documentFile, setDocumentFile
  } = financeTrackerInstance;

  const { currentPage, pageRefs } = usePageTracker(pages?.length);
  
  useLayoutEffect(() => {
    if (csvString) {
      setPages(csvString?.pages as IBalanceSheetPage[])
      setDocumentFile({ filename: csvString?.filename, templateLayout: csvString?.templateLayout });
    } else {
      setPages([{ ...defaultPage }]);
    }
  }, []);

  const handleSaveFile = (saveType: IUpdateFileRequest["updateType"]) => {
    if (isLoggedIn && loadedSucessfully) {
      saveFile({ fileId: params?.fileId, content: JSON.stringify({ ...documentFile, pages }), mimeType: "application/json", updateType: saveType });
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

  const resetCursorPosition = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const arr = [3,6]
    setTimeout(() => {
      input.selectionStart = arr.includes(cursorPositionRef.current as number) ? ((cursorPositionRef.current as number) + 1) : cursorPositionRef.current;
      input.selectionEnd = arr.includes(cursorPositionRef.current as number) ? ((cursorPositionRef.current as number) + 1) : cursorPositionRef.current;
    }, 0);
  };

  return (
    <BalanceSheetContextProvider financeTrackerInstance={financeTrackerInstance}>
      <DndProvider backend={HTML5Backend}>
        <Teleport rootId='saveIconPosition'>
          <button onClick={() => handleSaveFile("versionedSave")} className="h-max flex items-center justify-center my-auto">
            <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
          </button>
        </Teleport>
        <main className=" w-full relative border-zinc-200">
          <ModuleFileHeader
            moduleName="Finance Tracker"
            isSaving={isSaving} isSavingError={saveFileIsError} isSavingSuccess={saveFileIsSuccess}
            fileName={documentFile?.filename} setFileName={(e) => setDocumentFile({ ...documentFile, filename: e.target.value })} subtitle={pages?.[0]?.subTitle} handleInitiateCreateFile={() => setIsCreateModalOpen(true)}
            handleExport={() => setIsExportModalOpen(true)} initiateImport={() => setIsImportModalOpen(true)}
            undo={undo} redo={redo} canRedo={canRedo} canUndo={canUndo}
          />
          <div ref={elementRef as LegacyRef<HTMLDivElement>} className="max-w-[1080px] mx-auto">
            {(pages).map((page, pageIndex) => (
              <div
                key={`page-${pageIndex}`}
                data-page={pageIndex}
                ref={(el: any) => {(pageRefs?.current as any)[pageIndex] = el}}
                className=""
              >
                <span className="noExport max-md:ml-3 text-sm text-slate-700">Page {pageIndex+1}</span>
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
              </div>
            ))}

          </div>
        </main>
      </DndProvider>
      <AnimatePresence>     
        { isExportModalOpen && <CustomModal setIsModalOpen={setIsExportModalOpen} modalData={{ createDocumentPDF, createPdf, currentPage }}><SheetExportModal /></CustomModal> }
        { isImportModalOpen && <CustomModal setIsModalOpen={setIsImportModalOpen} modalData={{ currentPage }}><SheetImportModal /></CustomModal> }
        { isCreateModalOpen && <CustomModal handleModalClose={() => setIsCreateModalOpen(false)}><CreateFinanceTrackerSheet /></CustomModal> }
      </AnimatePresence>
    </BalanceSheetContextProvider>
  );
};

export default BalanceSheet;