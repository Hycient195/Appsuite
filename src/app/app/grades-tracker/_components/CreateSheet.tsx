import { FormSelect, FormText, FormTextArea } from "@/sharedComponents/FormInputs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
// import { defaultPage, useFinanceTracker } from "../_hooks/useFinanceTracker";
import api from "@/redux/api";
import { Toast } from "@/sharedComponents/utilities/Toast";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { handleInputChange } from "@/utils/miscelaneous";
import { useModalContext } from "@/sharedComponents/CustomModal";
import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import { IGradesTrackerDocument, TGradeScales } from "../_types/types";
import { defaultPage } from "../_hooks/useGradesTracker";
// import { defaultPage } from "../_hooks/useGradesTracker";
// import { IFinanceTrackerDocument } from "../_types/types";

export default function CreateGradesTrackerSheet() {
  const router = useRouter();

  const { handleModalClose } = useModalContext<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]>();

  const [ formData, setFormData ] = useState<{ title: string, cgpaScale: TGradeScales, description: string, templateLayout: "CLASSIC" | "MODERN" }>({
    title: "", cgpaScale: "OVER5", description: "", templateLayout: "CLASSIC"
  })

  const [ createFile, { isLoading, isSuccess, isError, data } ] = api.commonApis.useCreateFileInFolderMutation();

  const handleCreateFile = async (e: FormEvent) => {
    e.preventDefault();
    const pageDefault: IGradesTrackerDocument = { filename: formData.title, cgpaScale: formData.cgpaScale, templateLayout: formData.templateLayout, description: formData.description, pages: [ defaultPage ] }
    createFile({ appName: "GRADES_TRACKER", fileName: `${formData?.title?.trim()}.json`, content: JSON.stringify(pageDefault), mimeType: "application/json" });
  };

  useEffect(() => {
    if (isSuccess) {
      Toast("success", "File Created Sucessfully")
      router.push(data?.data?.id);
    }
    if (isError) Toast("error", "Unable to create file");
  }, [ isSuccess, isError ]);

  return (
    <form onSubmit={handleCreateFile} className="flex flex-col gap-3">
      <FormText name="title" value={formData.title} onChange={(e) => handleInputChange(e, formData, setFormData)} labelText="Title of Sheet" placeholder="Enter file name (e.g statement of account)" />
      <FormSelect labelText="CGPA Scale" value={formData.cgpaScale} onChange={(e) => setFormData({ ...formData, cgpaScale: e.target.value })} options={[ { text: "5-Point Scale", value: "OVER5" }, { text: "4-Point Scale", value: "OVER4"} ]} />
      <FormTextArea name="description" value={formData.description} onChange={(e) => handleInputChange(e, formData, setFormData)} labelText="Description (optional)" placeholder="Enter a description..." />
      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => setFormData({ ...formData, templateLayout: "CLASSIC" })} className=" flex cursor-pointer flex-col gap-2">
          <figure className={`aspect-[2.1/1] w-full h-auto bg-slate-100 rounded-lg lg:rounded-xl relative overflow-hidden border border-slate-300 ${ formData.templateLayout === "CLASSIC" && "ring-1 ring-slate-500"}`}><Image src="/images/shared/finance-tracker-classic-layout.png" fill alt="Classic Layout" /></figure>
          <figcaption className="text-slate-600 font-medium">Classic Layout</figcaption>
        </div>
        <div onClick={() => setFormData({ ...formData, templateLayout: "MODERN" })} className=" flex cursor-pointer flex-col gap-2">
          <figure className={`aspect-[2.1/1] w-full h-auto bg-slate-100 rounded-lg lg:rounded-xl relative overflow-hidden border border-slate-300 ${ formData.templateLayout === "MODERN" && "ring-1 ring-slate-500"}`}><Image src="/images/shared/finance-tracker-modern-layout.png" fill alt="Classic Layout" /></figure>
          <figcaption className="text-slate-600 font-medium">Modern Layout</figcaption>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button onClick={handleModalClose} type="button" className="btn bg-white border border-zinc-200 text-primary">Cancel</button>
        <LoadingButton type="submit" loading={isLoading} className="btn bg-primary text-white">Next</LoadingButton>
      </div>
    </form>
  )
}