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



// import { savePDF } from "@progress/kendo-react-pdf";
// import { useRef } from "react";

// interface PdfOptions {
//   paperSize: string;
//   orientation: 'portrait' | 'landscape';
//   fileName?: string;
//   getFileName?: (filename?: string) => string; // Make index optional for single item case
// }

// const useGeneratePDF = ({ paperSize, orientation, fileName, getFileName }: PdfOptions) => {
//   const elementRef = useRef<(HTMLElement | null)[] | HTMLElement | null>([]);
  
//   function createPdf({ index, domNode, documentFileName }:  {index?: number, domNode?: HTMLElement, documentFileName?: string }) {
//     // setIsGenerating(true)
//     // Handle for array of elements (multiple items)
//     if (Array.isArray(elementRef.current)) {
//       const element = elementRef.current[index!] ; // index is only valid for arrays
//       if (element) {
//         savePDF( domNode ? domNode : element, {
//           repeatHeaders: true,
//           paperSize: paperSize,
//           fileName: getFileName ? getFileName(documentFileName) : documentFileName || fileName || 'Download.pdf', // Dynamic file name
//           margin: 3,
//           landscape: orientation === "landscape",
//         });
//       } 
//     }
//     // Handle for single element
//     else if (elementRef.current || domNode) {
//       // console.log(JSON.stringify(elementRef.current))
//       // console.log(JSON.stringify(domNode))
//       // savePDF( (domNode ? domNode : elementRef.current) as HTMLElement, {
//       savePDF( domNode ? domNode : elementRef.current as HTMLElement, {
//         repeatHeaders: true,
//         paperSize: paperSize,
//         fileName: getFileName ? getFileName(documentFileName) : documentFileName || fileName || 'Download.pdf',
//         margin: 3,
//         landscape: orientation === "landscape",
//       });
//     }
    
//   }

//   return { createPdf, elementRef };
// };

// export default useGeneratePDF;


import { savePDF } from "@progress/kendo-react-pdf";
import { useRef } from "react";

interface PdfOptions {
  paperSize: string;
  orientation: "portrait" | "landscape";
  fileName?: string;
  getFileName?: (filename?: string) => string;
}

const useGeneratePDF = ({ paperSize, orientation, fileName, getFileName }: PdfOptions) => {
  const elementRef = useRef<HTMLElement | (HTMLElement | null)[] | null>([]);

  function createPdf({
    index,
    indexes,
    domNode,
    documentFileName,
  }: {
    index?: number;
    indexes?: number[],
    domNode?: HTMLElement;
    documentFileName?: string;
  }) {
    const getFilename = () =>
      getFileName ? getFileName(documentFileName) : documentFileName || fileName || "Download.pdf";

    if (domNode) {
      savePDF(domNode, {
        repeatHeaders: true,
        paperSize,
        fileName: getFilename(),
        margin: 3,
        landscape: orientation === "landscape",
      });
      return;
    }

    if (Array.isArray(elementRef.current)) {
      if (index !== undefined) {
        // Generate PDF for a single indexed element
        const targetElement = elementRef.current[index];
        // console.log(targetElement)
        if (targetElement) {
          savePDF(targetElement, {
            repeatHeaders: true,
            paperSize,
            fileName: getFilename(),
            margin: 3,
            landscape: orientation === "landscape",
          });
        }
      } else {
        // Generate a single PDF for all elements combined
        let validElements: HTMLElement[] = []
        if (indexes){
          validElements = elementRef.current.filter((_, idx) => indexes.includes(idx)) as HTMLElement[];
        } else {
          elementRef.current.filter((el) => el !== null) as HTMLElement[];
        }

        if (validElements.length > 0) {
          const container = document.createElement("div");
          validElements.forEach((el) => container.appendChild(el.cloneNode(true)));
          console.log(container)
          document.body.appendChild(container); // Append it to the DOM
          savePDF(container, {
            repeatHeaders: true,
            paperSize,
            fileName: getFilename(),
            margin: 3,
            landscape: orientation === "landscape",
          }, () => {
            document.body.removeChild(container); // Clean up after PDF generation
          });
        }
      }
    } else if (elementRef.current) {
      savePDF(elementRef.current, {
        repeatHeaders: true,
        paperSize,
        fileName: getFilename(),
        margin: 3,
        landscape: orientation === "landscape",
      });
    }
  }

  return { createPdf, elementRef };
};

export default useGeneratePDF;


        