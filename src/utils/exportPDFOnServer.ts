"use client"

import { RefObject } from "react";

export const handleExportPDFOnServer = async (exportNode: any) => {
  if (!exportNode) return;

  const htmlContent = exportNode.outerHTML;

  const response = await fetch("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: htmlContent, }),
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    console.error("PDF export failed");
  }
};