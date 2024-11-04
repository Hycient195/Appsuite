"use client"

import { FormText } from "@/sharedComponents/FormInputs";
import LoadingButton from "@/sharedComponents/LoadingButton";
import SuccessBlock from "@/sharedComponents/SuccessBlock";
import {  useEffect, useState } from "react";
import { defaultPage, useBalanceSheet } from "../_hooks/useBalanceSheet";
import api from "@/redux/api";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

export default function CreateBalanceSheet() {
  const router = useRouter();

  const [ fileName, setFileName ] = useState<string>("");

  const { generateCSVData } = useBalanceSheet();

  const [ createFile, { isLoading, isSuccess, isError, data }] = api.commonApis.useCreateFileMutation();
  const cookieAccessToken = parseCookies().asAccessToken;

  const handleCreateFile = async () => {
    const pageDefault = [{ ...defaultPage, title: fileName }].map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
    createFile({ appName: "ACCOUNT_LEDGER", fileName: `${fileName}.csv`, content: pageDefault, mimeType: "text/csv"});
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
        <div className="max-w-lg mx-auto w-full border border-zinc-200 -translate-y-[clamp(10px,3vh,100px)] rounded-lg bg-white flex gap-3 flex-col p-[clamp(16px,2%,40px)] shadow-inne">
          <h2 className="text-xl font-sans font-semibold text-center tracking-wide">Create Sheet</h2>
            <FormText placeholder="Enter file name (eg. Statement of Account)" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            <SuccessBlock className="animate-fade-in" isSuccess={isSuccess}>
              File Created
            </SuccessBlock>
            <SuccessBlock className="animate-fade-in !bg-red-100 !text-red-600" isSuccess={isError}> {/* Success block but used for error */}
            {!cookieAccessToken ? "Sign in to create file" : "Unable to create file"}
            </SuccessBlock>
          <LoadingButton loading={isLoading} onClick={handleCreateFile} className="btn bg-black text-white">Create File</LoadingButton>
        </div>
      </div>
    </main>
  )
}