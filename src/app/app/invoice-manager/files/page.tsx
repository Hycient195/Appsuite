"use client"

import {  MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/sharedComponents/skeletons/TableSkeleton";
import LoadingButton from "@/sharedComponents/LoadingButton";
import api from "@/redux/api";
import TableEmpty from "@/sharedComponents/emptyState/TableEmpty";
import Link from "next/link";
import { parseCookies } from "nookies";
import { MenuItem, Select } from "@mui/material";
import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import { splitInThousand } from "@/utils/miscelaneous";


export default function BalanceSheetFiles() {
  const cookieAccessToken = parseCookies().asAccessToken;

  const [ hasDeleted, sethasDeleted ] = useState<boolean>(false);
  const [ getFiles, { data, isLoading } ] = api.commonApis.useLazyGetFoldersWithPrimaryFileQuery();

  useEffect(() => {
    getFiles({ folderName: "INVOICE_MANAGER", primaryFileMimeType: "application/json" });
  }, [ getFiles, hasDeleted ]);

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
              cookieAccessToken
              ? (
                isLoading
              ? (
                <TableSkeleton numCols={3} numRows={28} />
                ) : (
                  data && (
                    data?.length === 0
                    ? (
                      <TableEmpty colSpan={3} >
                        <div className="flex flex-col gap-3">
                          <p className="">No records to display. {!cookieAccessToken && "Sign in"}</p>
                          <Link href={!cookieAccessToken ? "/sign-in" : "create"} className="btn bg-black/90 w-max mx-auto text-white">{!cookieAccessToken ? "Sign in" : "Create Sheet"}</Link>
                        </div>
                      </TableEmpty>
                    ) : (
                      data?.map((file, index) => (
                        <TableRow key={`finance-tracker-file-${index}`} file={file} hasDeleted={hasDeleted} sethasDeleted={sethasDeleted} />
                      ))
                    )
                  )
                )
              ) : (
                <TableEmpty colSpan={3} >
                  <div className="flex flex-col gap-3">
                    <p className="">No records to display. {!cookieAccessToken && "Sign in"}</p>
                    <Link href={!cookieAccessToken ? "/sign-in" : "create"} className="btn bg-black/90 w-max mx-auto text-white">{!cookieAccessToken ? "Sign in" : "Create Sheet"}</Link>
                  </div>
                </TableEmpty>
              )
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}

interface ITableRowProps {
  file: Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0];
  hasDeleted: boolean;
  sethasDeleted: React.Dispatch<React.SetStateAction<boolean>>
}

function TableRow({ file , hasDeleted, sethasDeleted }: ITableRowProps) {
  const router = useRouter();
  const [ fileName, setFileName ] = useState<string>(file?.folderName?.replace(".csv", "") as string)
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement|null>(null);

  const [ deleteDocument, { isLoading, isSuccess }] = api.commonApis.useDeleteFolderAllFilesInFolderMutation();
  const [ updateFileName, { isLoading: isUpdatingFile, isSuccess: fileNameUpdateSuccess }] = api.commonApis.useRenameFolderAndPrimaryFileMutation();
  const [ getFileVersions, { data: fileVersions, isLoading: isGettingFileVersions, isError: fileVersionsIsError }] = api.commonApis.useLazyGetFileVersionsQuery();
  const [ restoreFileVersion, { isLoading: isRestoringFileVersion, isError: fileRestoreIsError, isSuccess: fileRestoreIsSuccess }] = api.commonApis.useRestoreFileVersionMutation();

  useEffect(() => {
    if (isSuccess) {
      sethasDeleted(!hasDeleted);
    }
  }, [ isSuccess ]);

  useEffect(() => {
    if (fileRestoreIsSuccess) {
      router.push(file?.primaryFile?.fileId as string);
    }
  }, [ fileRestoreIsSuccess ])

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isEditing) {
      inputRef.current?.focus();
      setIsEditing(true);
    } else {
      setIsEditing(false)
      updateFileName({ folderId: file.folderId as string, primaryFileMimeType: "text/csv", newFileName: `${fileName}.csv` });
    }
  };

  const handleGetFileVersions = (e: MouseEvent<HTMLButtonElement|any>, fileId: string) => {
    e.stopPropagation();
    getFileVersions(fileId);
  }

  // const handleGetFileVersions

  console.log(fileVersions)

  return (
    <tr onClick={() => router.push(file?.primaryFile?.fileId as string)} className="border-b border-dashed cursor-pointer odd:bg-zinc-100 border-b-zinc-300 duration-300 hover:bg-green-100" >
      <td>
        <div className="">
          <input
            type="text"
            value={fileName}
            ref={inputRef}
            // onFocus={() => setIsEditing(true)}
            onBlur={() => !isEditing && setIsEditing(false)}
            // onClick={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); setFileName(e.target.value)}}
            className="inline-block w-full bg-transparent outline-none py-2 h-full"
          />
        </div>
      </td>
      <td>{splitInThousand(file?.primaryFile?.size as string)} Kb</td>
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
          {/* <LoadingButton loading={isRestoringFileVersion} success={fileRestoreIsSuccess} onClick={(e) => e.stopPropagation()} className="!px-4 !py-2 !bg-amber-400 rounded-md relative">
            <span>Versions</span>
            <Select
              onMouseDown={(e) => handleGetFileVersions(e, file?.id)}
              itemID="location"
              defaultValue={0}
              value={0}
              className="[&>*]:!py-0 [&>*]:!px-0 !absolute !w-full !opacity-0 !bg-tes !left-0 !h-full !top-0 [&>*]:!border-none  pr- font-semibold text-md text-zinc-600 min-w-[40px]"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
            >
              <MenuItem className="">Versions</MenuItem>
              {
                !isGettingFileVersions
                ? (
                  !fileVersionsIsError
                  ? (
                    fileVersions && fileVersions?.map((version, index) => (
                      <MenuItem onClick={() => restoreFileVersion({ fileId: file?.id, revisionId: version?.id, mimeType: "text/csv" })} key={`file-version-${index}`} className="flex gap-2"><span className="text-zinc-400">Timestamp: </span> {version?.modifiedTime?.split(".")[0]?.replace("T", " ")}</MenuItem>
                    ))
                  ) : (
                    <MenuItem className="">No file versions</MenuItem>
                  )
                  
                ) : (
                  <MenuItem className="">Loading ...</MenuItem>
                )
              }
              
            </Select>
          </LoadingButton> */}
          <LoadingButton
            loading={isLoading}
            className="px-4 !py-2 bg-red-600 text-white rounded"
            onClick={(e) => { e.stopPropagation(); deleteDocument(file?.folderId as string)}}
          >
            Delete
          </LoadingButton>
        </div>
      </td>
    </tr>
  )
}