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
import DocumentPage from "../_components/DocumentPage"
import TemplateThemeColorPicker from "@/sharedComponents/TemplateThemeColorPicker"
import TemplatePreviewScaledWrapper from "@/sharedComponents/TemplateScaledWrapper"
import { useThemeContext } from "../_contexts/themeContext"
import { comprehensiveInvoice } from "../_templates/globalDummyData"

interface IProps {
  loadedSucessfully: boolean;
  isLoggedIn: boolean;
  jsonData: IGlobalInvoice;
}

export default function InvoiceManager({ loadedSucessfully, isLoggedIn, jsonData }: IProps) {
  const params = useParams<any>();
  const isFirstRender = useRef(true);

  const [ SelectedTemplate, SetSelectedTemplate ] = useState<any>();
  const [ globalState, setGlobalState ] = useState<IGlobalInvoice>(jsonData);
  const [ formData, setFormData ] = useState({
    fileName: "",
    templateId: ""
  })
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [ isTemplatePaneOpen, setIsTemplatePaneOpen ] = useState<boolean>(false);

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


  

  useEffect(() => {
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
      SetSelectedTemplate(result);
      return result;
    };

    flattenTemplates(invoiceTemplates, globalState.templateId as string);
  }, [ globalState?.templateId ]);


  const TheTemplate = SelectedTemplate?.templateMarkup 


  const { getThemes, getSelectedTheme } = useThemeContext();

  const selectTemplate = (templateId: string) => {
    setFormData({ ...formData, templateId: templateId, })
    const selectedTemplateTheme = getThemes(templateId)

    const selectedTheme = getSelectedTheme(templateId);
    handleUpdateStateProperty(globalState, setGlobalState, selectedTheme, "branding.themeColor");
    handleUpdateStateProperty(globalState, setGlobalState, templateId, "templateId");
    // { ...defaultGlobalInvoice.branding, themeColor: stateObject.branding?.themeColor }
  }

  // console.log(selectTemplate)
  return (
    <main className="flex flex-row gap-3 xl:gap-4 justify-center">
      <Teleport rootId='dashboardNavPortal'>
        <li className="-order-4">
          <button onClick={() => handleSaveFile("versionedSave")} className="h-max flex items-center justify-center my-auto">
            <StatusIcon isLoading={isSaving} isError={saveFileIsError} isSuccess={saveFileIsSuccess} />
          </button>
        </li>
        <li className="-order-2">
          <FormSelect options={[ { text: "USD", value: "USD" }, { text: "NGN", value: "NGN" } ]}
            inputClassName=""
            value={globalState.metadata.currency.code}
            onChange={(e) => handleUpdateStateProperty(globalState, setGlobalState, currencyObject[e.target.value as keyof typeof currencyObject], "metadata.currency" )}
          />
        </li>
        <li className="-order-1">
          <button onClick={createPdf} className="btn !py-2.5 bg-primary/90 text-white">Download</button>
        </li>
        <li className="-order-2">
          <button onClick={() => setIsTemplatePaneOpen(!isTemplatePaneOpen)} className="btn !py-2.5 bg-slate-500 text-white">Switch Template</button>
        </li>
      </Teleport>

      <DocumentPage onClick={() => isTemplatePaneOpen && setIsTemplatePaneOpen(false)} pageType="B3" ref={elementRef as any} className={`${isTemplatePaneOpen ? "basis-3/4" : "w-full"}`}>
        { TheTemplate &&  <TheTemplate templateId={globalState?.templateId} setStateObject={setGlobalState} stateObject={globalState} controls={controls} isLoggedIn={isLoggedIn} fileId={params?.fileId}  /> }
       
      </DocumentPage>

      {
        isTemplatePaneOpen
        && (
          <div className="grid h-full grid-flow-row sticky top-20 animate-slide-in-left">
            <div className="bg-slate-200 shadow-lg border min-w-[350px] border-zinc-300 rounded overflow-y-auto sticky top-0 h-[92vh]">
              {/* <h2 className="text-xl">Invoice Templates</h2> */}
              {/* <div className="line" /> */}
              <div className="flex flex-col gap-8">
                {
                  Object.entries(invoiceTemplates)?.map((templateCategory, categoryIndex) => (
                    <div key={`template-category-${categoryIndex}`} className="grid p-3 xl:p-4">
                      <h3 className="capitalize font-semibold text-3xl">{templateCategory[0]?.toLowerCase()}</h3>
                      <div className="overflow-x-auto h-[620px] border max-w-md overflow-y-visible h- grid">

                        <div className="flex flex-row px-1 items-center  min-w-max gap-2">
                          {
                            Object.entries(templateCategory[1])?.map((template, templateIndex) => {
                              const TheTemplate = template[1].templateMarkup

                              return (
                                (
                                  <div key={`category-${categoryIndex}-template-${templateIndex}`}  className="relative">
                                    <TemplateThemeColorPicker templateId={template[0]} stateObject={globalState} setStateObject={setGlobalState} callback={() => selectTemplate(template[0])} />
                                    <TemplatePreviewScaledWrapper  scale={0.4} onClick={() => selectTemplate(template[0])}  className={`outline-2 outline ${template[0] === formData.templateId ? "outline-green-500" : "outline-transparent"} bg-white cursor-pointer`}>
                                      <DocumentPage>
                                        {<TheTemplate templateId={template[0]} stateObject={comprehensiveInvoice} setStateObject={setGlobalState} isPreview={true} />}
                                      </DocumentPage>
                                    </TemplatePreviewScaledWrapper>
                                  </div>
                                )
                              )
                            })
                          }
                        </div>

                      </div>
                    </div>
                  ))
              }
              </div>
            </div>
          </div>
        )
      }

    </main>
  )
}