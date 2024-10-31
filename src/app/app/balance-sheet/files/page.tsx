"use client"

import {  useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/sharedComponents/skeletons/TableSkeleton";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { IBalanceSheetFile } from "../_types/types";
import api from "@/redux/api";


export default function BalanceSheetFiles() {
  // const bsContext = useContext(BalanceSheetFilesContext);
  const [ hasDeleted, sethasDeleted ] = useState<boolean>(false);

  // const loadFiles = async () => {  
  //   bsContext!.setResponse({ data: null, loading: true, success: false, error: null });
  //   sethasDeleted(false);
  //   const folderInit = await initializeFolders("BALANCE_SHEET");

  //   if (folderInit.success) {
  //     const filesResponse = await getAllFilesInFolder(folderInit.data);
  //     console.log(filesResponse.data)
  //     bsContext!.setResponse({ data: filesResponse.data || null, loading: false, success: filesResponse.success, error: filesResponse.error });
  //   } else {
  //     bsContext!.setResponse({ data: null, loading: false, success: false, error: folderInit.error });
  //   }
  // };

  // useEffect(() => {
  //   if (!bsContext?.response?.data) loadFiles();
  // }, []);

  // useEffect(() => {
  //   if (hasDeleted) {
  //     loadFiles();
  //   }
  // }, [ hasDeleted ])

  const [ getFiles, { data, isLoading } ] = api.commonApis.useLazyGetFilesQuery();

  useEffect(() => {
    getFiles("BALANCE_SHEET")
  }, [getFiles, hasDeleted])

  console.log(api)

  console.log(data)

  return (
    <main className="h-full relative">
      <div className="bg-white border-[12px] border-white min-h-full  max-h-[50vh] overflow-y-auto ring-1 ring-zinc-200 rounded-md">
        <table cellPadding={10} className=" w-full">
          <thead className="head sticky top-0 w-full z-[1]">
            <tr className="bg-black w-full text-white font-bold">
              <td className="cell">NAME</td>
              <td className="cell">SIZE</td>
              <td className="cell">ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {
              isLoading
              ? (
                <TableSkeleton numCols={3} numRows={28} />
              ) : (
                data && data?.map((file, index) => (
                  <TableRow key={`balance-sheet-file-${index}`} file={file} hasDeleted={hasDeleted} sethasDeleted={sethasDeleted} />
                ))
              )
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

interface ITableRowProps {
  file: IBalanceSheetFile;
  hasDeleted: boolean;
  sethasDeleted: React.Dispatch<React.SetStateAction<boolean>>
}

function TableRow({ file , hasDeleted, sethasDeleted }: ITableRowProps) {
  const router = useRouter();
  const [ fileName, setFileName ] = useState<string>(file?.name)
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement|null>(null);

  const [ deleteDocument, { isLoading, isSuccess }] = api.commonApis.useDeleteFileMutation();

  useEffect(() => {
    if (isSuccess) {
      sethasDeleted(!hasDeleted);
    }
  }, [isSuccess])

  return (
    <tr onClick={() => router.push(file?.id)} className="border-b border-dashed cursor-pointer odd:bg-zinc-100 border-b-zinc-300 duration-300 hover:bg-green-100" >
      <td>
        <div className="">
          <input
            type="text"
            value={`${fileName}`}
            ref={inputRef}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); setFileName(e.target.value)}}
            className="inline-block w-full bg-transparent outline-none py-2 h-full"
          />
        </div>
      </td>
      <td>{file?.size}Kb</td>
      <td>
        <div className="flex flex-row items-center gap-2">
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.focus()}}
          >
            { (isEditing) ? "Save" : "Rename" }
          </button>
          <LoadingButton
            loading={isLoading}
            className="px-4 !py-2 bg-red-600 text-white rounded"
            onClick={(e) => { e.stopPropagation(); deleteDocument(file?.id)}}
          >
            Delete
          </LoadingButton>
        </div>
      </td>
    </tr>
  )
}