"use client"

import { FormSelect, FormText } from "@/sharedComponents/FormInputs";
import LoadingButton from "@/sharedComponents/LoadingButton";
import SuccessBlock from "@/sharedComponents/SuccessBlock";
import {  FormEvent, useEffect, useState } from "react";
import { defaultPage, useCGPATracker } from "../_hooks/useCGPATracker";
import api from "@/redux/api";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { TGradeScales } from "../_types/types";

export default function CreateCGPATrackerSheet() {
  const router = useRouter();

  const [ formData, setFormData ] = useState<{ fileName: string, gpaScale: TGradeScales }>({
    fileName: "",
    gpaScale: "OVER5"
  });

  const { generateCSVData } = useCGPATracker(formData.gpaScale);

  const [ createFile, { isLoading, isSuccess, isError, data }] = api.commonApis.useCreateFileInFolderMutation();
  const cookieAccessToken = parseCookies().asAccessToken;

  const handleCreateFile = (e: FormEvent) => {
    const pageDefault = [{ ...defaultPage, title: formData.fileName }].map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
    createFile({ appName: "CGPA_TRACKER", fileName: `${formData.fileName}.csv`, content: pageDefault, mimeType: "text/csv"});
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        router.push(data?.data?.id)
        clearTimeout(timeout);
      }, 1000);
    }
  }, [ isSuccess, data?.data?.id, router ]);

  return (
    <main className="h-full">
      <div className="bg-whit border border-zinc-200 rounded-md min-h-full flex items-center justify-center">
        <form onSubmit={handleCreateFile} className="max-w-lg mx-auto w-full border border-zinc-200 -translate-y-[clamp(10px,3vh,100px)] rounded-lg bg-white flex gap-3 flex-col p-[clamp(16px,2%,40px)] shadow-inne">
          <h2 className="text-xl font-sans font-semibold text-center tracking-wide">Create Sheet</h2>
            <FormText placeholder="Enter file name (eg. Statement of Account)" value={formData.fileName} onChange={(e) => setFormData({ ...formData, fileName: e.target.value })} />
            <FormSelect onChange={(e) => setFormData({ ...formData, gpaScale: e.target.value })} options={[ { text: "5 Point Scale", value: "OVER5" }, { text: "4 Point Scale", value: "OVER4"} ]} />
            <SuccessBlock className="animate-fade-in" isSuccess={isSuccess}>
              File Created
            </SuccessBlock>
            <SuccessBlock className="animate-fade-in !bg-red-100 !text-red-600" isSuccess={isError}> {/* Success block but used for error */}
            {!cookieAccessToken ? "Sign in to create file" : "Unable to create file"}
            </SuccessBlock>
          <LoadingButton loading={isLoading} className="btn bg-black text-white">Create File</LoadingButton>
        </form>
      </div>
    </main>
  )
}