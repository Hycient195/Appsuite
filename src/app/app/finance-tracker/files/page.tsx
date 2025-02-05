"use client"

import ModuleFileList from "@/sharedComponents/ModuleFileList";
import CreateFinanceTrackerSheet from "../_components/CreateSheet";

export default function FinanceTrackerFiles() {
  return (
    <ModuleFileList
      moduleName="Finance Tracker"
      moduleSubtitle="Manage and compute income and expenditure with ease"
      moduleEnumName="FINANCE_TRACKER"
      fileListMimeType="application/json"
      createFileModal={<CreateFinanceTrackerSheet />}
    />
  )
}