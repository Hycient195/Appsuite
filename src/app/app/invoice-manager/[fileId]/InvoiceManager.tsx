"use client"

import { useEffect, useRef, useState } from "react"
import Commercial1 from "../_templates/commercial/Commercial1"
import { IGlobalInvoice } from "../_types/types"
import useInvoiceManager from "../_hooks/useInvoiceManager"
import api from "@/redux/api"
import { IUpdateFileRequest } from "@/types/shared.types"
import { useParams } from "next/navigation"
import Teleport from "@/utils/Teleport"
import StatusIcon from "@/sharedComponents/CustomIcons"
import useGeneratePDF from "@/sharedHooks/useGeneratePDF"

interface IProps {
  loadedSucessfully: boolean;
  isLoggedIn: boolean;
  jsonData: IGlobalInvoice;
}

export default function InvoiceManager({ loadedSucessfully, isLoggedIn, jsonData }: IProps) {
  const params = useParams<any>();
  const isFirstRender = useRef(true);

  const [ globalState, setGlobalState ] = useState<IGlobalInvoice>(jsonData);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const controls = useInvoiceManager(globalState, setGlobalState);

  const [ saveFile, { isLoading: isSaving, isSuccess: saveFileIsSuccess, isError: saveFileIsError } ] = api.commonApis.useSaveFileMutation();
  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "A3", fileName: `${jsonData?.fileName}.pdf`})


  const handleSaveFile = (saveType: IUpdateFileRequest["updateType"]) => {
    if (isLoggedIn && loadedSucessfully) {
      saveFile({ fileId: params?.fileId, content: JSON.stringify(globalState), mimeType: "application/json", updateType: saveType })
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
  }, [ globalState ]);


  return (
    <main className="">
      <Teleport rootId='dashboardNavPortal'>
        <li className="-order-2">
          <button onClick={() => handleSaveFile("versionedSave")} className="h-max flex items-center justify-center my-auto">
            <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
          </button>
        </li>
        <li className="-order-1">
          <button onClick={createPdf} className="btn !py-2.5 bg-primary/90 text-white">Download</button>
        </li>
      </Teleport>

      <div ref={elementRef as any} className="">
        <Commercial1 setStateObject={setGlobalState} stateObject={globalState} controls={controls} isLoggedIn={isLoggedIn} fileId={params?.fileId} />
      </div>
    </main>
  )
}