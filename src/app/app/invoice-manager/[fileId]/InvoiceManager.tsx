"use client"

import { useEffect, useRef, useState } from "react"
import { IGlobalInvoice } from "../_types/types"
import useInvoiceManager from "../_hooks/useInvoiceManager"
import api from "@/redux/api"
import { IUpdateFileRequest } from "@/types/shared.types"
import { useParams } from "next/navigation"
import Teleport from "@/utils/Teleport"
import StatusIcon from "@/sharedComponents/CustomIcons"
import useGeneratePDF from "@/sharedHooks/useGeneratePDF"
import { FormSelect } from "@/sharedComponents/FormInputs"
import { currencyObject, handleUpdateStateProperty } from "@/utils/miscelaneous"
import { invoiceTemplates } from "../_templates"

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
  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "B3", fileName: `${jsonData?.fileName}.pdf`})


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


  const flattenTemplates = (
    obj: Record<string, any>,
    templateId: string
  ): any | null => {
    let result: any | null = null;
  
    const traverse = (currentObj: Record<string, any>) => {
      for (const key in currentObj) {
        if (key === templateId) {
          result = currentObj[key]; // Match found, assign the object value
          return;
        }
        if (
          typeof currentObj[key] === "object" &&
          !Array.isArray(currentObj[key])
        ) {
          traverse(currentObj[key]); // Recursively traverse deeper
          if (result) return; // Stop further traversal once a match is found
        }
      }
    };
  
    // Start traversal from the root object
    traverse(obj);
    return result;
  };

  const SelectedTemplate = flattenTemplates(invoiceTemplates, globalState.templateId as string)?.templateMarkup;

  // console.log(OldflattenTemplates(invoiceTemplates))
  // console.log(SelectedTemplate)
  // console.log(globalState.templateId)

  return (
    <main className="">
      <Teleport rootId='dashboardNavPortal'>
        <li className="-order-2">
          <button onClick={() => handleSaveFile("versionedSave")} className="h-max flex items-center justify-center my-auto">
            <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
          </button>
        </li>
        <li className="-order-1">
          <FormSelect options={[ { text: "USD", value: "USD" }, { text: "NGN", value: "NGN" } ]}
            inputClassName=""
            value={globalState.metadata.currency.code}
            onChange={(e) => handleUpdateStateProperty(globalState, setGlobalState, currencyObject[e.target.value as keyof typeof currencyObject], "metadata.currency" )}
          />
        </li>
        <li className="-order-1">
          <button onClick={createPdf} className="btn !py-2.5 bg-primary/90 text-white">Download</button>
        </li>
      </Teleport>

      <div ref={elementRef as any} className="">
        <SelectedTemplate setStateObject={setGlobalState} stateObject={globalState} controls={controls} isLoggedIn={isLoggedIn} fileId={params?.fileId} />
        {
          // Object.entries(invoiceTemplates)?.map((template, templetIndex) => Object.values(template[1]))
        }
        {/* <Commercial1 templateId="COMMERCIAL_1" setStateObject={setGlobalState} stateObject={globalState} controls={controls} isLoggedIn={isLoggedIn} fileId={params?.fileId} /> */}
      </div>
    </main>
  )
}