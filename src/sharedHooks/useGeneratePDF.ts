// import { savePDF } from "@progress/kendo-react-pdf";
// import { useRef } from "react";

// interface PdfOptions {
//   paperSize: string;
//   orientation: 'portrait' | 'landscape';
//   fileName?: string;
// }

// const useGeneratePDF = ({ paperSize, orientation, fileName = "Report" }: PdfOptions) => {
//   const elementRef = useRef<HTMLElement|null>(null)
//   const createPdf = () => {
//     savePDF(elementRef.current as HTMLElement, {
//       repeatHeaders: true,
//       paperSize: paperSize,
//       fileName: fileName || 'Download.pdf',
//       margin: 3,
//       landscape: orientation === "portrait" ? false : orientation === "landscape" && true,
//     });
//   };
//   return { createPdf, elementRef };
// };

// export default useGeneratePDF;

import { savePDF } from "@progress/kendo-react-pdf";
import { useRef } from "react";

interface PdfOptions {
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  fileName?: string;
  getFileName?: (filename?: string) => string; // Make index optional for single item case
}

const useGeneratePDF = ({ paperSize, orientation, fileName, getFileName }: PdfOptions) => {
  const elementRef = useRef<(HTMLElement | null)[] | HTMLElement | null>([]);

  /** Function overloads */
  function createPdf(): void;
  function createPdf(index?: number, documentFileName?: string): void;
  
  function createPdf(index?: number, documentFileName?: string) {
    // setIsGenerating(true)
    // Handle for array of elements (multiple items)
    if (Array.isArray(elementRef.current)) {
      const element = elementRef.current[index!]; // index is only valid for arrays
      if (element) {
        savePDF(element, {
          repeatHeaders: true,
          paperSize: paperSize,
          fileName: getFileName ? getFileName(documentFileName) : fileName || 'Downloadw.pdf', // Dynamic file name
          margin: 3,
          landscape: orientation === "landscape",
        });
      } 
    }
    // Handle for single element
    else if (elementRef.current) {
      savePDF(elementRef.current, {
        repeatHeaders: true,
        paperSize: paperSize,
        fileName: getFileName ? getFileName() : fileName || 'Download.pdf',
        margin: 3,
        landscape: orientation === "landscape",
      });
    }
    
  }

  return { createPdf, elementRef };
};

export default useGeneratePDF;
