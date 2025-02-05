"use client"

import ModuleFileList from "@/sharedComponents/ModuleFileList";
import CreateGradesTrackerSheet from "../_components/CreateSheet";

export default function GradesTrackerFiles() {
  return (
    <ModuleFileList
      moduleName="Grades Tracker"
      moduleSubtitle="Manage and accurately compute your grades with ease"
      moduleEnumName="GRADES_TRACKER"
      fileListMimeType="application/json"
      createFileModal={<CreateGradesTrackerSheet />}
    />
  )
}