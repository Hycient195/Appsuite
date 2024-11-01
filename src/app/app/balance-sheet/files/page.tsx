"use client"

import {  MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/sharedComponents/skeletons/TableSkeleton";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { IBalanceSheetFile } from "../_types/types";
import api from "@/redux/api";
import TableEmpty from "@/sharedComponents/emptyState/TableEmpty";
import Link from "next/link";


export default function BalanceSheetFiles() {
  const [ hasDeleted, sethasDeleted ] = useState<boolean>(false);
  const [ getFiles, { data, isLoading } ] = api.commonApis.useLazyGetFilesQuery();

  useEffect(() => {
    getFiles("BALANCE_SHEET")
  }, [ getFiles, hasDeleted ])

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
                data && (
                  data?.length === 0
                  ? (
                    <TableEmpty colSpan={3} >
                      <div className="flex flex-col gap-3">
                        <p className="">No records to display.</p>
                        <Link href="create" className="btn bg-black/90 w-max mx-auto text-white">Create Sheet</Link>
                      </div>
                    </TableEmpty>
                  ) : (
                    data?.map((file, index) => (
                      <TableRow key={`balance-sheet-file-${index}`} file={file} hasDeleted={hasDeleted} sethasDeleted={sethasDeleted} />
                    ))
                  )
                )
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
  const [ fileName, setFileName ] = useState<string>(file?.name?.replace(".csv", ""))
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement|null>(null);

  const [ deleteDocument, { isLoading, isSuccess }] = api.commonApis.useDeleteFileMutation();
  const [ updateFileName, { isLoading: isUpdatingFile, isSuccess: fileNameUpdateSuccess }] = api.commonApis.useUpdateFileNameMutation();

  useEffect(() => {
    if (isSuccess) {
      sethasDeleted(!hasDeleted);
    }
  }, [isSuccess]);

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isEditing) {
      inputRef.current?.focus();
      setIsEditing(true);
    } else {
      setIsEditing(false)
      updateFileName({ fileId: file.id, fileName: `${fileName}.csv` });
    }
  };


  return (
    <tr onClick={() => router.push(file?.id)} className="border-b border-dashed cursor-pointer odd:bg-zinc-100 border-b-zinc-300 duration-300 hover:bg-green-100" >
      <td>
        <div className="">
          <input
            type="text"
            value={fileName}
            ref={inputRef}
            onFocus={() => setIsEditing(true)}
            onBlur={() => !isEditing && setIsEditing(false)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); setFileName(e.target.value)}}
            className="inline-block w-full bg-transparent outline-none py-2 h-full"
          />
        </div>
      </td>
      <td>{file?.size}Kb</td>
      <td>
        <div className="flex flex-row items-center gap-2">
          <LoadingButton
            loading={isUpdatingFile}
            success={fileNameUpdateSuccess}
            successResetDuration={1500}
            successText="Sucessful"
            className="px-4 !py-2 bg-violet-500 text-white rounded"
            onClick={handleEdit}
          >
            { isEditing ? "Save" : "Rename" }
          </LoadingButton>
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