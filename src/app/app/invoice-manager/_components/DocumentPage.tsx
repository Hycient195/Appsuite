import React, { LegacyRef } from "react"

interface DocumentPageProps {
  pageType?: keyof DocumentPageTypeMap; // Restrict to predefined page types
  children: React.ReactNode; // Content inside the document page
  ref?: LegacyRef<HTMLDivElement>;
  className?: string;
  onClick?: any
}

const DocumentPage: React.FC<DocumentPageProps> = ({ pageType = "B3", children, className, ref, onClick }) => {
  const pageStyles = documentPageTypeMap[pageType] || documentPageTypeMap["A4"]; // Default to A4 if page type is not found

  return (
    <div
      onClick={onClick}
      style={{
        // padding: `${pageStyles.containerYAxisPadding} ${pageStyles.containerXAxisPadding}`,
        // maxWidth: pageStyles.containerMaxWidth,
        // minWidth: pageStyles.containerMinWidth,
        // margin: "0 auto", // Center the page horizontally
        // // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Light shadow for page effect
        // backgroundColor: "#fff", // White background for the page
      }}
      ref={ref} className={`max-w-screen-lg mx-auto bg-white shadow-lg  ${className}`}
    >
      <div
        style={{
          // maxWidth: pageStyles.contentMaxWidth,
          // minWidth: pageStyles.contentMinWidth,
          // margin: "0 auto", // Center content inside the container
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DocumentPage;


interface DocumentPageType {
  containerXAxisPadding: string; // Padding for X-axis (horizontal) of the container
  containerYAxisPadding: string; // Padding for Y-axis (vertical) of the container
  containerMaxWidth: string; // Max width for the container
  containerMinWidth: string; // Min width for the container
  contentMaxWidth: string; // Max width for the content
  contentMinWidth: string; // Min width for the content
}

type DocumentPageTypeMap = Record<keyof typeof documentPageTypeMap, DocumentPageType>;

const documentPageTypeMap = {
  A1: {
    containerXAxisPadding: "clamp(20px, 8%, 100px)",
    containerYAxisPadding: "clamp(20px, 6%, 90px)",
    containerMaxWidth: "clamp(500px, 90vw, 594mm)", // A1 width
    contentMaxWidth: "clamp(400px, 80vw, 590mm)",
  },
  A2: {
    containerXAxisPadding: "clamp(20px, 7%, 90px)",
    containerYAxisPadding: "clamp(20px, 5%, 80px)",
    containerMaxWidth: "clamp(420px, 85vw, 420mm)", // A2 width
    contentMaxWidth: "clamp(360px, 75vw, 416mm)",
  },
  A3: {
    containerXAxisPadding: "clamp(16px, 6%, 80px)",
    containerYAxisPadding: "clamp(16px, 4%, 70px)",
    containerMaxWidth: "clamp(297px, 80vw, 297mm)", // A3 width
    contentMaxWidth: "clamp(280px, 75vw, 290mm)",
  },
  A4: {
    containerXAxisPadding: "clamp(12px, 5%, 60px)",
    containerYAxisPadding: "clamp(12px, 3%, 50px)",
    containerMaxWidth: "clamp(210px, 70vw, 210mm)", // A4 width
    contentMaxWidth: "clamp(190px, 65vw, 205mm)",
  },
  B1: {
    containerXAxisPadding: "clamp(25px, 10%, 120px)",
    containerYAxisPadding: "clamp(25px, 8%, 110px)",
    containerMaxWidth: "clamp(707px, 95vw, 707mm)", // B1 width
    contentMaxWidth: "clamp(680px, 90vw, 700mm)",
  },
  B2: {
    containerXAxisPadding: "clamp(22px, 9%, 110px)",
    containerYAxisPadding: "clamp(22px, 7%, 100px)",
    containerMaxWidth: "clamp(500px, 85vw, 500mm)", // B2 width
    contentMaxWidth: "clamp(480px, 80vw, 490mm)",
  },
  B3: {
    containerXAxisPadding: "clamp(16px, 6%, 80px)",
    containerYAxisPadding: "clamp(16px, 4%, 70px)",
    containerMaxWidth: "clamp(353px, 100vw, 353mm)", // B3 width
    contentMaxWidth: "clamp(340px, 100vw, 340mm)",
  },
  B4: {
    containerXAxisPadding: "clamp(14px, 5%, 70px)",
    containerYAxisPadding: "clamp(14px, 3%, 60px)",
    containerMaxWidth: "clamp(250px, 65vw, 250mm)", // B4 width
    contentMaxWidth: "clamp(240px, 60vw, 245mm)",
  },
  C1: {
    containerXAxisPadding: "clamp(24px, 9%, 100px)",
    containerYAxisPadding: "clamp(24px, 6%, 90px)",
    containerMaxWidth: "clamp(648px, 90vw, 648mm)", // C1 width
    contentMaxWidth: "clamp(620px, 85vw, 630mm)",
  },
  C2: {
    containerXAxisPadding: "clamp(20px, 8%, 90px)",
    containerYAxisPadding: "clamp(20px, 5%, 80px)",
    containerMaxWidth: "clamp(458px, 85vw, 458mm)", // C2 width
    contentMaxWidth: "clamp(440px, 80vw, 450mm)",
  },
  legal: {
    containerXAxisPadding: "clamp(18px, 6%, 80px)",
    containerYAxisPadding: "clamp(18px, 4%, 70px)",
    containerMaxWidth: "clamp(216px, 75vw, 216mm)", // Legal width
    contentMaxWidth: "clamp(210px, 70vw, 210mm)",
  },
  "": {
    containerXAxisPadding: "clamp(16px, 6%, 80px)",
    containerYAxisPadding: "clamp(16px, 4%, 70px)",
    containerMaxWidth: "clamp(353px, 75vw, 353mm)", // B3 width
    contentMaxWidth: "clamp(340px, 70vw, 340mm)",
  }
};