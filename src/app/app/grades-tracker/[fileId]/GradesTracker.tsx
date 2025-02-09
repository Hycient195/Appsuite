"use client"

import React, { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { defaultPage, useGradesTracker } from '../_hooks/useGradesTracker';
import useGeneratePDF from '@/sharedHooks/useGeneratePDF';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'next/navigation';
import Teleport from '@/utils/Teleport';
import StatusIcon from '@/sharedComponents/CustomIcons';
import CGPATrackerPage from '../_components/SheetTablePage';
import { ICGPATrackerPage, IGradesTrackerDocument, TGradeScales } from '../_types/types';
import ModuleFileHeader from '@/sharedComponents/ModuleFileHeader';
import useSaveDocument from '@/sharedHooks/useSaveDocument';
import { AnimatePresence } from 'motion/react';
import CustomModal from '@/sharedComponents/CustomModal';
import usePageTracker from '@/sharedHooks/usePageTracker';
import { GradesTrackerContextProvider } from '../_contexts/gradesTrackerContext';
import CreateGradesTrackerSheet from '../_components/CreateSheet';
import GradesTrackerImportModal from '../_components/ImportModal';
import { MenuItem, Select } from '@mui/material';
import GradesTrackerExportModal from '../_components/ExportModal';
import { useAppDispatch } from '@/redux/hooks/hooks';
import sharedSlice from '@/redux/slices/shared.slice';

const CGPATracker: React.FC<{csvString: IGradesTrackerDocument, folderId: string, fileName: string, loadedSucessfully: boolean }> = ({ csvString, folderId, fileName, loadedSucessfully }) => {
  const params = useParams<any>();
  const dispatch = useAppDispatch();

  const tableContainerRef = useRef<HTMLTableRowElement|null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement|null>(null);
  const cursorPositionRef = useRef<number | null>(null);

  const [ tableWidth, setTableWidth ] = useState(2);

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
  const { createPdf: createDocumentPDF, elementRef: singleDocumentRef } = useGeneratePDF({ orientation: "portrait", paperSize: "B3", getFileName: (fileName) => `${fileName}.pdf` });
  const [ modals, setModals ] = useState({ export: false, import: false, create: false });

  const gradesTrackerInstance = useGradesTracker();
  
  const {
    pages,
    undo,
    redo,
    canUndo,
    canRedo,
    updateImageUrl,
    setPages,
    updateCGPAScale,
    documentFile,
    setDocumentFile
  } = gradesTrackerInstance

  const { handleSaveFile, saveFileIsError, saveFileIsSuccess, isSaving, saveResponse } = useSaveDocument({ fileId: params?.fileId, contentMimeType: "application/json", contentToSave: JSON.stringify({ ...documentFile, pages }), loadedSucessfully });
  const { currentPage, pageRefs } = usePageTracker(pages?.length);

  /* Loading CSV file fetched from the server using SSR */
  useEffect(() => {
    if (csvString) {
      setPages(csvString?.pages as ICGPATrackerPage[]);
      setDocumentFile({ filename: fileName?.split(".")?.[0], cgpaScale: csvString?.cgpaScale, templateLayout: csvString?.templateLayout });
    } else {
      setPages([{ ...defaultPage }]);
    }
  }, []);

  useEffect(() => {
    dispatch(sharedSlice.actions.peekSidebar());
    return () => {
      dispatch(sharedSlice.actions.showSidebar());
    }
  }, []);

  const setIsModalOpen = (modalKey: keyof typeof modals, arg: boolean) => {
    setModals({ ...modals, [modalKey]: arg })
  }

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
    <GradesTrackerContextProvider gradesTrackerInstance={gradesTrackerInstance}>
      <DndProvider backend={HTML5Backend}>
        <Teleport rootId='saveIconPosition'>
          <button onClick={() => handleSaveFile("versionedSave")} className="h-max flex items-center justify-center my-auto">
            <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
          </button>
        </Teleport>
        <main className=" w-full border-zinc-200 relative">
          <ModuleFileHeader
            moduleName="Grades Tracker"
            mimeType='application/json'
            folderId={folderId}
            isSaving={isSaving} isSavingError={saveFileIsError} isSavingSuccess={saveFileIsSuccess}
            fileName={documentFile?.filename} setFileName={(e) => setDocumentFile({ ...documentFile, filename: e.target.value?.replace(/"."/ig,"") })} subtitle={pages?.[0]?.subTitle} handleInitiateCreateFile={() => setModals({ ...modals, create: true })}
            handleExport={() => setModals({ ...modals, export: true })} initiateImport={() => setModals({ ...modals, import: true })}
            undo={undo} redo={redo} canRedo={canRedo} canUndo={canUndo}
            modifiedTime={saveResponse?.modifiedTime as string}
            extraControls={
              <>
                <div className="line-in !gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M10 32h28l4 8H6z"/><path stroke-linecap="round" d="M16 40v4m8-32v20"/><path d="M17 4h14v8H17z"/><path stroke-linecap="round" d="M32 40v4"/></g></svg>
                  <div className="relative">
                    <Select
                      itemID="location"
                      value={documentFile?.cgpaScale}
                      onChange={(e) => updateCGPAScale(e.target.value as TGradeScales)}
                      // className="[&>*]:!py-0 [&>*]:!px-0 !absolut !w-full !opacity- !bg-tes !left-0 !h-full !top-0 [&>*]:!border-none  pr- font-semibold text-md text-zinc-600 min-w-[40px]"
                      className="[&>*]:!py-0 [&>*]:!px-0 [&>*]:!border-none !text-sm !text-slate-800"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                    >
                      <MenuItem value="OVER5">5 Point Scale</MenuItem>
                      <MenuItem value="OVER4">4 Point Scale</MenuItem>
                    </Select>
                  </div>
                </div>
              </>
            }
          />

          <div ref={elementRef as LegacyRef<HTMLDivElement>} className="max-w-[1080px] bg-slate-100 mx-auto">
            {(pages).map((page, pageIndex) => (
              <div
                key={`page-${pageIndex}`}
                data-page={pageIndex}
                ref={(el: any) => {(pageRefs?.current as any)[pageIndex] = el}}
                className="max-md:px-1.5"
              >
              <span className="noExport max-md:ml-3 text-sm text-slate-700">Page {pageIndex+1}</span>
                <CGPATrackerPage
                  key={`page-${pageIndex}`}
                  page={page}
                  pageIndex={pageIndex}
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
        { modals.export && <CustomModal setIsModalOpen={(arg: boolean) => setIsModalOpen("export", arg)} modalData={{ createDocumentPDF, createPdf, currentPage, elementRef, singleDocumentRef, }}><GradesTrackerExportModal /></CustomModal> }
        { modals.import && <CustomModal setIsModalOpen={(arg: boolean) => setIsModalOpen("import", arg)} modalData={{ currentPage }}><GradesTrackerImportModal /></CustomModal> }
        { modals.create && <CustomModal handleModalClose={() => setModals({ ...modals, create: false })}><CreateGradesTrackerSheet /></CustomModal> }
      </AnimatePresence>
    </GradesTrackerContextProvider>
  );
};

export default CGPATracker;