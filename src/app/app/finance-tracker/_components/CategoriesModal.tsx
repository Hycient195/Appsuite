import { FormSelect, FormText, FormTextArea } from "@/sharedComponents/FormInputs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { defaultPage, useFinanceTracker } from "../_hooks/useFinanceTracker";
import api from "@/redux/api";
import { Toast } from "@/sharedComponents/utilities/Toast";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { getColorByWord, handleInputChange, handleRemoveStateProperty, handleUpdateStateProperty } from "@/utils/miscelaneous";
import { useModalContext } from "@/sharedComponents/CustomModal";
import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import { IFinanceTrackerDocument } from "../_types/types";
import { useFinanceTrackerContext } from "../_contexts/financeTrackerContext";
import { CloseIcon } from "@/sharedComponents/CustomIcons";

export default function FinanceTrackerCategoresModal() {
  const router = useRouter();

  const { handleModalClose } = useModalContext<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]>();
  const { documentFile, setDocumentFile } = useFinanceTrackerContext();

  const [ formData, setFormData ] = useState<{ text: string, selectedCategory: "debit"|"credit" }>({
    text: "", selectedCategory: "debit"
  })

  const [ createFile, { isLoading, isSuccess, isError, data } ] = api.commonApis.useCreateFileInFolderMutation();
  // const [ categoryText, setCategoryText ] = useState<string>("");

  // const handleCreateFile = async (e: FormEvent) => {
  //   e.preventDefault();
  //   const pageDefault: IFinanceTrackerDocument = { filename: formData.title, templateLayout: formData.templateLayout, description: formData.description, pages: [ defaultPage ] }
  //   createFile({ appName: "FINANCE_TRACKER", fileName: `${formData?.title?.trim()}.json`, content: JSON.stringify(pageDefault), mimeType: "application/json" });
  // };

  const handleAddCategory = () => {
    const category = formData?.text.trim();
    if (!category) return;
    if (documentFile?.categories) {
      setDocumentFile({
        ...documentFile,
        categories: {
          ...documentFile.categories,
          [formData.selectedCategory]: [
            ...(documentFile?.categories[formData.selectedCategory] ?? []),
            category,
          ],
        },
      });
    } else {
      setDocumentFile({
        ...documentFile,
        // @ts-ignore
        categories: { [formData.selectedCategory as keyof typeof documentFile.categories]: [category] },
      });
    }
    setFormData({ ...formData, text: "" });
  };

  // const handleAddCategory = (category: string, type: "debit" | "credit") => {
  //   setDocumentFile((prevDocumentFile) => ({
  //     ...prevDocumentFile,
  //     categories: {
  //       ...prevDocumentFile.categories,
  //       [type]: [...(prevDocumentFile.categories[type] || []), category],
  //     },
  //   }));
  // };

  const handleRemoveCategory = (categoryType: "credit"|"debit", index: number) => {
    if (documentFile?.categories) {
      const updatedCategories = {
        ...documentFile.categories,
        [categoryType]: documentFile.categories[categoryType].filter((_, i) => i !== index),
      };
      setDocumentFile({
        ...documentFile,
        categories: updatedCategories,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      Toast("success", "File Created Sucessfully")
      router.push(data?.data?.id);
    }
    if (isError) Toast("error", "Unable to create file");
  }, [ isSuccess, isError ]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-slate-800">Categories</h3>
      <div className="grid grid-cols-[1fr_max-content] gap-1">
        <FormText value={formData?.text} onChange={(e) => { setFormData({ ...formData, text: formData?.text?.length <= 16 ? e?.target?.value : "" })}} labelText="Add Category" placeholder="eg. Transportation" footerText={`${16 - formData?.text?.length} words remaining`} />
        <button onClick={handleAddCategory} type="button" className="btn bg-primary h-max mt-auto mb-auto !py-3.5 border-zinc-200 text-white">Add</button>
      </div>
      <FormSelect labelText="Category For?" value={formData?.selectedCategory} onChange={(e) => setFormData({ ...formData, selectedCategory: e?.target?.value })} options={[ { text: "Debit", value: "debit" }, { text: "Credit", value: "credit" } ]} />
      <div className="grid grid-cols-2 gap-2">
        {documentFile.categories && Object.entries(documentFile.categories)?.map(([key, value]) => (
          <div key={key} className="">
            <p className="text-slate-800 capitalize">{key}</p>
            <div className="flex gap-1 flex-wrap">
              {value?.map((category: string, categoryIndex: number) => (<div key={`${key}-${category}-${categoryIndex}`} style={{ ...getColorByWord(category), border: `1px solid ${getColorByWord(category)?.color}`}} className="px-2.5 py-1 rounded-full bg-slate-200 w-max text-xs flex items-center justify-center gap-1" >{category}<button onClick={() => handleRemoveCategory(key as any, categoryIndex)}><CloseIcon className="!size-3 !stroke-2" /></button></div>))}
            </div>
          </div>
        ))}
      </div>
      {/* <FormTextArea name="description" value={formData.description} onChange={(e) => handleInputChange(e, formData, setFormData)} labelText="Description (optional)" placeholder="Enter a description..." /> */}
      {/* <div className="grid grid-cols-2 gap-3">
        <div onClick={() => setFormData({ ...formData, templateLayout: "CLASSIC" })} className=" flex cursor-pointer flex-col gap-2">
          <figure className={`aspect-[2.1/1] w-full h-auto bg-slate-100 rounded-lg lg:rounded-xl relative overflow-hidden border border-slate-300 ${ formData.templateLayout === "CLASSIC" && "ring-1 ring-slate-500"}`}><Image src="/images/shared/finance-tracker-classic-layout.png" fill alt="Classic Layout" /></figure>
          <figcaption className="text-slate-600 font-medium">Classic Layout</figcaption>
        </div>
        <div onClick={() => setFormData({ ...formData, templateLayout: "MODERN" })} className=" flex cursor-pointer flex-col gap-2">
          <figure className={`aspect-[2.1/1] w-full h-auto bg-slate-100 rounded-lg lg:rounded-xl relative overflow-hidden border border-slate-300 ${ formData.templateLayout === "MODERN" && "ring-1 ring-slate-500"}`}><Image src="/images/shared/finance-tracker-modern-layout.png" fill alt="Classic Layout" /></figure>
          <figcaption className="text-slate-600 font-medium">Modern Layout</figcaption>
        </div>
      </div> */}
      <div className="grid grid-cols- gap-3 mt-3">
        <button onClick={handleModalClose} type="button" className="btn bg-primary  !py-3 border-zinc-200 text-white">Close</button>
        {/* <LoadingButton type="submit" loading={isLoading} className="btn bg-primary text-white">Next</LoadingButton> */}
      </div>
    </div>
  )
}