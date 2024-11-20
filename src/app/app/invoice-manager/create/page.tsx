"use client"

import { FormText } from "@/sharedComponents/FormInputs";
import LoadingButton from "@/sharedComponents/LoadingButton";
import SuccessBlock from "@/sharedComponents/SuccessBlock";
import {  useEffect, useState } from "react";
// import { defaultPage, useBalanceSheet } from "../_hooks/useBalanceSheet";
import api from "@/redux/api";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import Commercial1 from "../_templates/commercial/Commercial1";
import { comprehensiveInvoice, defaultGlobalInvoice } from "../_templates/globalDummyData";
// import useInvoiceTemplates from "../_templates";

export default function CreateBalanceSheet() {
  const router = useRouter();

  const [ formData, setFormData ] = useState({
    fileName: "",
    templateId: ""
  })

  const [ theme, setTheme ] = useState({ 
    themeColor: {}
  })


  const [ stateObject, setStateObject ] = useState(comprehensiveInvoice)

  const [ createFile, { isLoading, isSuccess, isError, data }] = api.commonApis.useCreateFileInFolderMutation();
  const cookieAccessToken = parseCookies().asAccessToken;

  const handleCreateFile = async () => {
    createFile({ appName: "INVOICE_MANAGER", fileName: `${formData.fileName}.json`, content: JSON.stringify({ ...defaultGlobalInvoice, fileName: formData.fileName, templateId: formData.templateId, branding: { ...defaultGlobalInvoice.branding, themeColor: stateObject.branding?.themeColor } }), mimeType: "application/json"});
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        router.push(data?.data?.id)
        clearTimeout(timeout);
      }, 1000);
    }
  }, [ isSuccess, data?.data?.id, router ]);

  // const invoiceTemplates = useInvoiceTemplates();

  const { getThemes } = useThemeContext();


  const selectTemplate = (templateId: string) => {
    setFormData({ ...formData, templateId: templateId, })
    const selectedTemplateTheme = getThemes(templateId)
    handleUpdateStateProperty(stateObject, setStateObject, selectedTemplateTheme![0], "branding.themeColor")
    // { ...defaultGlobalInvoice.branding, themeColor: stateObject.branding?.themeColor }
  }

  return (
    <main className="h-full max-md:p-3">
      <div className="bg-whit borde border-zinc-200 rounded-md min-h-full flex flex-col ">
        {/* <h2>Invoice Samples</h2> */}
        
        <div className="max-w-lg mx-auto w-full border border-zinc-200 h-max rounded-xl items-center justify-center bg-white flex flex-row gap-3 p-[clamp(10px,1.5%,30px)] shadow-inne">
            <FormText placeholder="Enter Invoice Name" value={formData.fileName} onChange={(e) => setFormData({ ...formData, fileName: e.target.value })} />
            <SuccessBlock className="animate-fade-in" isSuccess={isSuccess}>
              File Created
            </SuccessBlock>
            <SuccessBlock className="animate-fade-in !bg-red-100 !text-red-600" isSuccess={isError}>
              {!cookieAccessToken ? "Sign in to create file" : "Unable to create file"}
            </SuccessBlock>
          <LoadingButton success={isSuccess} successText="Sucessful" loading={isLoading} onClick={handleCreateFile} className="btn bg-black !py-2.5 text-white">Create</LoadingButton>
        </div>
        <div className="">
           <h2 className="text-xl">Invoice Templates</h2>
           <div className="line" />
           <div className="flex flex-col gap-8">
            {
              Object.entries(invoiceTemplates)?.map((templateCategory, categoryIndex) => (
                <div key={`template-category-${categoryIndex}`} className="grid">
                  <h3 className="capitalize font-semibold text-3xl">{templateCategory[0]?.toLowerCase()}</h3>
                  <div className="overflow-x-auto h-[600px] overflow-y-visible h- grid">

                    <div className="flex flex-row px-1 items-center  min-w-max gap-2">
                      {
                        Object.entries(templateCategory[1])?.map((template, templateIndex) => {
                          const TheTemplate = template[1].templateMarkup

                          return (
                            (
                              <div key={`category-${categoryIndex}-template-${templateIndex}`} onClick={() => selectTemplate(template[0])} className="relative">
                                
                                <ThemePicker templateId={template[0]} stateObject={stateObject} setStateObject={setStateObject} />
                                <ScaledWrapper  scale={0.4}  className={`outline-2 outline ${template[0] === formData.templateId ? "outline-green-500" : "outline-transparent"} cursor-pointer`}>
                                  {<TheTemplate templateId={template[0]} stateObject={stateObject} setStateObject={setStateObject} isPreview={true} />}
                                  {/* <div className="bg-transparent absolute h-full w-full z-[2]" /> */}
                                  {/* {React.cloneElement(template.templateMarkup, { isPreview: true, themeColorPicker: <ThemePicker newTemplateTheme={theme} setNewTemplateTheme={setTheme} /> })} */}
                                </ScaledWrapper>
                                
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
    </main>
  )
}

interface IThemePickerProps {
  // themeColors: ITemplateThemeColor[]
  templateId: string;
  stateObject: IGlobalInvoice;
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>;
  // localThemeColor: ITemplateThemeColor;
  // setLocalTheme: React.Dispatch<React.SetStateAction<ITemplateThemeColor>>
  // newTemplateTheme: { themeColor: ITemplateThemeColor }
  // setNewTemplateTheme: React.Dispatch<React.SetStateAction<{ themeColor: ITemplateThemeColor }>>
}

const ThemePicker = ({ templateId, stateObject, setStateObject }: IThemePickerProps) => {
  const { getThemes, setTheme, getSelectedTheme } = useThemeContext();
  const themes = getThemes(templateId);

  const updateState = (theme: ITemplateThemeColor) => {
    setTheme(templateId, theme);
    handleUpdateStateProperty(stateObject, setStateObject, theme, "branding.themeColor");
  }

  const selectedTheme = getSelectedTheme(templateId);

  return (
    <div className=" !z-[1]   bg-tes  left-0  right-0 w-ma left- mx-auto my-auto mb-2 ">
      {/* <h3 className="text-">Theme Colors</h3> */}
      <div className="overflow-x-auto bg-tes w-full">
        <div className="flex flex-row items-center gap-1">
          {
            themes?.map((theme, index) => (
              <button onClick={() => updateState(theme)} key={`theme-picker-${index}`} style={{ backgroundColor: theme.display}} className={`h-10 w-10 rounded-ful border  ${JSON.stringify(theme) === JSON.stringify(selectedTheme) ? "border-2 border-slate-600" : "border-slate-400"}`}></button>
            ))
          }
        </div>
      </div>
    </div>
  )
}

import React, { ReactNode } from "react";
import { IGlobalInvoice, ITemplateThemeColor } from "../_types/types";
import { handleUpdateStateProperty } from "@/utils/miscelaneous";
import { useThemeContext } from "../_contexts/themeContext";
import { invoiceTemplates } from "../_templates";

interface ScaledWrapperProps {
  children: ReactNode;
  scale: number; // Scale factor (e.g., 0.3 for 30%)
  className?: string; // Optional additional classes
  onClick?: any
}

const ScaledWrapper: React.FC<ScaledWrapperProps> = ({
  children,
  scale,
  className = "",
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-block relative h-[520px] w-[370px] ${className}`}
      style={{
        // transform: `scale(${scale})`,
        transformOrigin: "top left",
        // width: `calc(100% * ${scale})`,
        // height: `calc(100% * ${scale})`,
      }}
    >
      <div
        style={{
          // transform: `scale(${scale})`,
          transformOrigin: "top left",
          // width: `calc(100% * ${scale})`,
          // height: `calc(100% * ${scale})`,
        }}
        className="absolute w-[900px] z-[1] top-0 left-0 scale-[0.41]">{children}</div>
    </div>
  );
};

// interface ScaledContainerProps {
//   children: ReactNode;
//   scale: number; // Scale factor (e.g., 0.3 for 30%)
//   className?: string; // Optional additional classes
// }

// const ScaledContainer: React.FC<ScaledContainerProps> = ({
//   children,
//   scale,
//   className = "",
// }) => {
//   return (
//     <div
//       className={`relative overflow-hidden [&>*]:transform [&>*]:origin-top-left [&>*]:scale-[0.3] ${className}`}
//       // style={{
//       //   width: `calc(100% * ${scale})`,
//       //   height: `calc(100% * ${scale})`,
//       //   transform: `scale(${scale})`
//       // }}
//     >
//       <div 
//         style={{
//           // width: `calc(100% * ${scale})`,
//           height: `380px`,
//           width: "200px"
//           // transform: `scale(${scale})`
//         }}
//        className="absolut z-[10] bg-test left-0 top-0 ">
//       {/* {children} */}
//       </div>
//       {/* <div
//         // className="transform origin-top-left"
//         style={{
//           transform: `scale(${scale})`,
//         }}
//       >
//         {children}
//       </div> */}
//     </div>
//   );
// };