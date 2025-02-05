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
import { comprehensiveInvoice, defaultGlobalInvoice } from "../_templates/globalDummyData"
import useSaveDocument from "@/sharedHooks/useSaveDocument"
import ModuleFileHeader from "@/sharedComponents/ModuleFileHeader"
import { isLoggedIn } from "@/sharedConstants/common"

interface IProps {
  loadedSucessfully: boolean;
  fileName: string;
  folderId: string;
  jsonData: IGlobalInvoice;
}

export default function InvoiceManager({ loadedSucessfully, fileName, folderId, jsonData }: IProps) {
  const params = useParams<any>();

  const { setTheme } = useThemeContext();

  const [ SelectedTemplate, SetSelectedTemplate ] = useState<any>();
  const [ isTemplatePaneOpen, setIsTemplatePaneOpen ] = useState<boolean>(false);
  const [ globalState, setGlobalState ] = useState<IGlobalInvoice>(jsonData);
  const [ formData, setFormData ] = useState({
    fileName: "",
    templateId: ""
  })

  const controls = useInvoiceManager(globalState, setGlobalState);
  const { handleSaveFile, saveFileIsError, saveFileIsSuccess, isSaving } = useSaveDocument({ fileId: params?.fileId, contentMimeType: "application/json", contentToSave: globalState, loadedSucessfully });
  const { createPdf, elementRef } = useGeneratePDF({ orientation: "portrait", paperSize: "B3", fileName: `${jsonData?.fileName}.pdf`})


  /** Reset discount fields to default on invoice template change */
  useEffect(() => {
    setGlobalState({ 
      ...globalState,
      valueAddedTax: defaultGlobalInvoice.valueAddedTax,
      appliedDiscount: defaultGlobalInvoice.appliedDiscount,
      taxes: defaultGlobalInvoice.taxes,
      discounts: defaultGlobalInvoice.discounts,
      totalTax: 0,
      totalDiscount: 0
    })
  }, [ globalState?.templateId ]);

  /** Loading last set theme when a new template is mounted */
  // useEffect(() => {
  //   if (jsonData.templateId && jsonData?.branding?.themeColor) {
  //     // setTheme(jsonData.templateId, jsonData?.branding?.themeColor)
  //   }
  // }, [ ]);
  // // }, [ globalState.branding?.themeColor, globalState.templateId ]);
  

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
    <main className="flex flex-col justify-center">
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

      <ModuleFileHeader
        moduleName="Invoice Manager"
        isSaving={isSaving} isSavingError={saveFileIsError} isSavingSuccess={saveFileIsSuccess}
        fileName={globalState?.fileName as string} setFileName={(e) => setGlobalState({ ...globalState, fileName: e.target.value })} subtitle={""} handleInitiateCreateFile={() => ""}
        // handleExport={() => setIsExportModalOpen(true)} initiateImport={() => setIsImportModalOpen(true)}
        // undo={undo} redo={redo} canRedo={canRedo} canUndo={canUndo}
      />
      <div className="overflow-x-auto">
        <DocumentPage onClick={() => isTemplatePaneOpen && setIsTemplatePaneOpen(false)} pageType="B3" ref={elementRef as any} className={`${isTemplatePaneOpen ? "basis-3/4" : "w-full"} h-max`}>
          { TheTemplate &&  <TheTemplate templateId={globalState?.templateId} setStateObject={setGlobalState} stateObject={globalState} controls={controls} isLoggedIn={isLoggedIn} fileId={params?.fileId}  /> }
        </DocumentPage>
      </div>
      

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
                      <div className="overflow-x-auto h-[600px] border max-w-md overflow-y-visible h- grid">

                        <div className="flex flex-row px-1 items-center  min-w-max gap-2">
                          {
                            Object.entries(templateCategory[1])?.map((template, templateIndex) => {
                              const TheTemplate = template[1].templateMarkup

                              return (
                                (
                                  <div key={`category-${categoryIndex}-template-${templateIndex}`}  className="relative">
                                    <TemplateThemeColorPicker templateId={template[0]} stateObject={globalState} setStateObject={setGlobalState} callback={() => selectTemplate(template[0])} />
                                    <TemplatePreviewScaledWrapper  scale={0.4} onClick={() => selectTemplate(template[0])}  className={`outline-2 outline ${template[0] === formData.templateId ? "outline-green-500" : "outline-transparent"} bg-white cursor-pointer`}>
                                      <DocumentPage className="h-[1265px] overflow-hidden">
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