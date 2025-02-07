import { useModalContext } from "@/sharedComponents/CustomModal";
import { FormSelect, FormText } from "@/sharedComponents/FormInputs";
import { Radio } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useFinanceTrackerContext } from "../../_contexts/financeTrackerContext";
import { handleUpdateStateProperty } from "@/utils/miscelaneous";
import { Toast } from "@/sharedComponents/utilities/Toast";
import { handleExportPDFOnServer } from "@/utils/exportPDFOnServer";
import api from "@/redux/api";
import LoadingButton from "@/sharedComponents/LoadingButton";

export interface IFinanceTrackerExportOptions {
  alternateExportName: string, exportType: "CURRENT_PAGE"|"ALL_PAGES"|"CUSTOM"|""
  exportFormat: "CSV"|"XLSX"|"PDF"|"",
  customOptions: { 
    type: "FROM"|"PAGES", value: string, range: [number, number]|[]
  }
}

export default function SheetExportModal() {
  const { handleModalClose, modalData, } = useModalContext<any>();
  const { pages, downloadCSVFile, downloadJSONFile, documentFile } = useFinanceTrackerContext()
  const [ exportPDFOnServer, { isLoading, isError, error } ] = api.commonApis.useExportPdfOnServerMutation();

  const selectedPagesRef = useRef<HTMLDivElement|null>(null);
  const isIOSMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [ exportOptions, setExportOptions ] = useState<IFinanceTrackerExportOptions>({
    alternateExportName: "", exportType: "", exportFormat: "", customOptions: { type: "FROM", value: "", range: [] }
  });
  
  const exportTypes = [ { text: `Current Page (page ${modalData?.currentPage + 1})`, value: "CURRENT_PAGE", }, { text: `All Pages (${pages?.length} page${pages?.length>1?"s":""})`, value: "ALL_PAGES", }, { text: "Custom", value: "CUSTOM", }, ]
  const exportFormats = [  { text: "PDF", value: "PDF", }, { text: "CSV", value: "CSV", }, { text: "JSON", value: "JSON"} ];

  const generateRange = ([ start, end ]: [number, number]): number[] => {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const validPattern = /^(\d+,?)*$/;

  const handlePagesInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue === "" || validPattern.test(inputValue)) {
      // Ensure it doesn't start with a comma and no consecutive commas
      const formattedValue = inputValue
        .replace(/^,/, "") // Remove leading comma
        .replace(/,,+/g, ","); // Replace multiple consecutive commas with a single comma
        handleUpdateStateProperty(exportOptions, setExportOptions, formattedValue, "customOptions.value");
    }
  };

  const handlePagesBlur = () => {
    const processedValue = exportOptions?.customOptions?.value
      .split(",")
      .map((num) => num.trim()) // Remove spaces
      .filter((num) => num !== "0" && num !== "") // Remove "0" and empty values
      .map(Number) // Convert to numbers
      .filter((num) => num <= pages?.length) // Remove numbers greater than maxLimit
      .filter((num, index, self) => self.indexOf(num) === index) // Remove duplicates
      .sort((a, b) => a - b) // Optional: Sort numbers in ascending order
      .join(",");
    handleUpdateStateProperty(exportOptions, setExportOptions, processedValue, "customOptions.value");
  };

  const onUpperRangeBlur = () => {
    if (exportOptions?.customOptions?.range?.[1] && exportOptions?.customOptions?.range?.[0]) {
      if((Number(exportOptions?.customOptions?.range?.[1]) <= Number(exportOptions?.customOptions?.range?.[0])) || Number(exportOptions?.customOptions?.range?.[1]) > pages?.length) {
        handleUpdateStateProperty(exportOptions, setExportOptions, "", "customOptions.range.1");
        Toast("error", "Value out of range");
      }
    }
  };

  const onLowerRangeBlur = () => {
    if (exportOptions?.customOptions?.range?.[0] && (Number(exportOptions?.customOptions?.range?.[0]) <= 0 || Number(exportOptions?.customOptions?.range?.[0]) > (pages?.length))) {
      handleUpdateStateProperty(exportOptions, setExportOptions, "", "customOptions.range.0");
      Toast("error", "Value out of range");
    }
  };

  const handleRangeInput = (e: ChangeEvent<HTMLInputElement>, propertyKey: string) => {
    const value = e.target.value;
    if (value === "" || validPattern.test(value)) {
      handleUpdateStateProperty(exportOptions, setExportOptions, value, propertyKey);
    }
  }

  const exportMap = {
    CSV: {
      ALL_PAGES: () => {
        downloadCSVFile({ fileName: exportOptions?.alternateExportName || documentFile?.filename });
      },
      CURRENT_PAGE: () => {
        // downloadPageCSV(modalData?.currentPage, exportOptions?.alternateExportName || documentFile?.filename)
        downloadCSVFile({ pageNumberOrNumbers: modalData?.currentPage, fileName: exportOptions?.alternateExportName || documentFile?.filename })
      },
      CUSTOM: () => {
        if (exportOptions.customOptions.type === "FROM") {
          // downloadCSVFile(generateRange(exportOptions?.customOptions?.range?.map(x => (Number(x) - 1)) as [number, number]), exportOptions?.alternateExportName || documentFile?.filename);
          downloadCSVFile({ pageNumberOrNumbers: generateRange(exportOptions?.customOptions?.range?.map(x => (Number(x) - 1)) as [number, number]), fileName: exportOptions?.alternateExportName || documentFile?.filename });
        } else if (exportOptions.customOptions.type === "PAGES") {
          // downloadCSVFile(exportOptions.customOptions.value.split(",")?.map(x => (Number(x) - 1)), exportOptions?.alternateExportName || documentFile?.filename);
          downloadCSVFile({ pageNumberOrNumbers: exportOptions.customOptions.value.split(",")?.map(x => (Number(x) - 1)), fileName: exportOptions?.alternateExportName || documentFile?.filename });
        }
      }
    },
    PDF: {
      ALL_PAGES: () => {
        if (isIOSMobile) { // if device is an iphone or Ipad
          // exportPDFOnServer(modalData?.elementRef?.current); // render the PDF on the server
          exportPDFOnServer({ exportNode: modalData?.elementRef?.current, fileName: exportOptions?.alternateExportName || documentFile?.filename }); // render the PDF on the server
        } else {
          // modalData?.createPdf(null, modalData?.elementRef?.current, );
          modalData?.createPdf({domNode: modalData?.elementRef?.current, documentFileName: exportOptions?.alternateExportName || documentFile?.filename });
        }
      },
      CURRENT_PAGE: () => {
        if (isIOSMobile) {
          // exportPDFOnServer(modalData?.singleDocumentRef?.current?.[modalData?.currentPage]);
          exportPDFOnServer({ exportNode: modalData?.singleDocumentRef?.current?.[modalData?.currentPage], fileName: exportOptions?.alternateExportName || documentFile?.filename });
        } else {
          // modalData?.createDocumentPDF(modalData?.currentPage, exportOptions?.alternateExportName ?? `${pages?.[0]?.title}`);
          modalData?.createDocumentPDF({index: modalData?.currentPage, documentFileName: exportOptions?.alternateExportName || documentFile?.filename });
        }
      },
      CUSTOM: () => {
        let selectedPages:number[] = [];

        if (exportOptions.customOptions.type === "FROM") {
          selectedPages = generateRange(exportOptions?.customOptions?.range?.map(x => (Number(x) - 1)) as [number, number])
        } else if (exportOptions.customOptions.type === "PAGES") {
          selectedPages = exportOptions.customOptions.value.split(",")?.map(x => (Number(x) - 1))
        }

        const downloadSection = document.createElement("div");

        modalData?.singleDocumentRef?.current
        ?.filter((_: any, index: number) => selectedPages?.includes(index))
        .forEach((item: any) => {
          const clonedItem = item.cloneNode(true); // Clone the element with its children
          downloadSection.appendChild(clonedItem);
        });

        if (isIOSMobile) {
          exportPDFOnServer({ exportNode: downloadSection, fileName: exportOptions?.alternateExportName || documentFile?.filename });
        } else {
          exportPDFOnServer({ exportNode: downloadSection, fileName: exportOptions?.alternateExportName || documentFile?.filename});
          // modalData?.createDocumentPDF(null, exportOptions?.alternateExportName ?? `${pages?.[0]?.title}`, downloadSection);
        }

      }
    },
    JSON: {
      ALL_PAGES: () => {
        downloadJSONFile({ fileName: exportOptions?.alternateExportName || documentFile?.filename });
      },
      CURRENT_PAGE: () => {
        downloadJSONFile({ pageNumberOrNumbers: modalData?.currentPage, fileName: exportOptions?.alternateExportName || documentFile?.filename })
      },
      CUSTOM: () => {
        if (exportOptions.customOptions.type === "FROM") {
          downloadJSONFile({ pageNumberOrNumbers: generateRange(exportOptions?.customOptions?.range?.map(x => (Number(x) - 1)) as [number, number]), fileName: exportOptions?.alternateExportName || documentFile?.filename });
        } else if (exportOptions.customOptions.type === "PAGES") {
          downloadJSONFile({ pageNumberOrNumbers: exportOptions.customOptions.value.split(",")?.map(x => (Number(x) - 1)), fileName: exportOptions?.alternateExportName || documentFile?.filename });
        }
      }
    }
  };

  useEffect(() => {
    if (isError) Toast("error", "Unable to export file");
  }, [ isError ]);

  const handleExport = (e: FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    exportMap[exportOptions.exportFormat][exportOptions.exportType]();
  }

  return (
    <form onSubmit={handleExport} className="flex flex-col gap-3 max-h-[97dvh] -mx-1 px-[2px] overflow-y-auto">
      <h2 className="text-xl font-medium text-slate-800">Export</h2>
      <p className="text-slate-500">What are you exporting?</p>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 lg:gap-3">
          {
            exportTypes.map((each) => (
              <label htmlFor={each.value} key={each.text} className={`rounded-lg cursor-pointer spread-out duration-500 text-slate-700 font-medium border border-slate-300 px-4 py-3 lg:py-4 ${exportOptions.exportType === each.value && "bg-slate-100 ring-1 ring-primary"}`}>
                <span className="">{each.text}</span>
                <Radio onChange={(e) => setExportOptions({ ...exportOptions, exportType: each.value as typeof exportOptions.exportType})} checked={exportOptions.exportType === each.value} id={each.value} className="!p-0 !text-inherit" />
              </label>
            ))
          }
        </div>
        <AnimatePresence>
          {
            exportOptions.exportType === "CUSTOM"
            && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className=""
              >
                <div className="grid grid-cols-[max-content_1fr] gap-3 mt-2">
                  <FormSelect onChange={(e) => setExportOptions({ ...exportOptions, customOptions: { ...exportOptions.customOptions, type: e.target.value }}) } value={exportOptions.customOptions.type} options={[ { text: "From page", value: "FROM" }, { text: "Pages", value: "PAGES" }, ]} />
                  {
                    exportOptions.customOptions.type === "FROM" ?
                    (
                      <div className="grid grid-cols-[1fr_max-content_1fr] items-center gap-2">
                        <FormText required onBlur={onLowerRangeBlur} value={exportOptions?.customOptions.range?.[0]} name={`customOptions.range.0`} onChange={(e) => handleRangeInput(e, "customOptions.range.0")} type="number" />
                          <span className="text-slate-700">to</span>
                        <FormText required onBlur={onUpperRangeBlur} value={exportOptions?.customOptions.range?.[1]} name={`customOptions.range.1`} onChange={(e) => handleRangeInput(e, "customOptions.range.1")} type="number" />
                      </div>
                    ) : (
                      <FormText required value={exportOptions?.customOptions.value} name={`customOptions.value`} onChange={handlePagesInput} onBlur={handlePagesBlur} placeholder="Page numbers separated by commas (,)" inputClassName="max-md:placeholder:!text-sm" />
                    )
                  }
                </div>
              </motion.div>
            )
          }
        </AnimatePresence>
      </div>

      <div className="flex flex-col bg-white z-[30] gap-2">
        <p className="text-slate-500 mt-1  ">Choose the format you would like to export</p>
        <div className="flex flex-col bg-white gap-2 lg:gap-3">
          {
            exportFormats.map((each) => (
              <label htmlFor={each.value} key={each.text} className={`rounded-lg cursor-pointer spread-out text-slate-700 font-medium border duration-500 border-slate-300 px-4 py-3 lg:py-4 ${exportOptions.exportFormat === each.value && "bg-slate-100 ring-1 ring-primary"}`}>
                <span className="">{each.text}</span>
                <Radio onChange={(e) => setExportOptions({ ...exportOptions, exportFormat: each.value as typeof exportOptions.exportFormat})} checked={exportOptions.exportFormat === each.value} id={each.value} className="!p-0 !text-inherit" />
              </label>
            ))
          }
        </div>
     </div>
      <FormText value={exportOptions?.alternateExportName} onChange={(e) => setExportOptions({ ...exportOptions, alternateExportName: e.target.value })} placeholder={documentFile?.filename} labelText="Specify an alternate export name (optional)" />
      <div className="grid grid-cols-2 gap-3 mt-1">
        <button onClick={handleModalClose} type="button" className="btn-large bg-white border border-zinc-200 text-primary">Cancel</button>
        <LoadingButton loading={isLoading} type="submit" disabled={!exportOptions?.exportType || !exportOptions?.exportFormat} className="btn-large bg-primary text-white disabled:bg-zinc-300 disabled:cursor-not-allowed">Export</LoadingButton>
      </div>
    </form>
  )
}