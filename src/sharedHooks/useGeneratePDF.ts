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
  
  function createPdf({ index, domNode, documentFileName }:  {index?: number, domNode?: HTMLElement, documentFileName?: string }) {
    // setIsGenerating(true)
    // Handle for array of elements (multiple items)
    if (Array.isArray(elementRef.current)) {
      const element = elementRef.current[index!] ; // index is only valid for arrays
      if (element) {
        savePDF( domNode ? domNode : element, {
          repeatHeaders: true,
          paperSize: paperSize,
          fileName: getFileName ? getFileName(documentFileName) : documentFileName || fileName || 'Download.pdf', // Dynamic file name
          margin: 3,
          landscape: orientation === "landscape",
        });
      } 
    }
    // Handle for single element
    else if (elementRef.current || domNode) {
      // console.log(JSON.stringify(elementRef.current))
      // console.log(JSON.stringify(domNode))
      // savePDF( (domNode ? domNode : elementRef.current) as HTMLElement, {
      savePDF( domNode ? domNode : elementRef.current as HTMLElement, {
        repeatHeaders: true,
        paperSize: paperSize,
        fileName: getFileName ? getFileName(documentFileName) : documentFileName || fileName || 'Download.pdf',
        margin: 3,
        landscape: orientation === "landscape",
      });
    }
    
  }

  return { createPdf, elementRef };
};

export default useGeneratePDF;
