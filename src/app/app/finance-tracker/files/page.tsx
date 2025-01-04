"use client"

import {  MouseEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/sharedComponents/skeletons/TableSkeleton";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { IBalanceSheetFile } from "../_types/types";
import api from "@/redux/api";
import TableEmpty from "@/sharedComponents/emptyState/TableEmpty";
import Link from "next/link";
import { parseCookies } from "nookies";
import { Checkbox, CircularProgress, MenuItem, Select } from "@mui/material";
import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import ModuleFilesHeader from "@/sharedComponents/ModuleFilesHeader";
import EmptyFileList from "@/sharedComponents/emptyState/EmptyFileList";
import CustomModal from "@/sharedComponents/CustomModal";
import ModuleLandingPageNav from "../../_components/ModuleLandingPageNav";
import CreateFinanceTrackerSheet from "../_components/CreateSheet";
import { AnimatePresence } from "motion/react";
import { ClockTimeIcon, PenIcon, TickIcon, TrashIcon } from "@/sharedComponents/CustomIcons";
import DeleteFileModal from "../_components/DeleteFileModal";
import { ResponsiveTextInput } from "@/sharedComponents/FormInputs";
import { Toast } from "@/sharedComponents/utilities/Toast";
import { splitInThousand } from "@/utils/miscelaneous";


export default function BalanceSheetFiles() {
  const cookieAccessToken = parseCookies().asAccessToken;

  const [ getFiles, { data, isLoading } ] = api.commonApis.useLazyGetFoldersWithPrimaryFileQuery();
  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState<boolean>(false);
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState<boolean>(false);
  const [ selectedFile, setSelectedFile ] = useState<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0] | null>(null);

  useEffect(() => {
    getFiles({ folderName: "FINANCE_TRACKER", primaryFileMimeType: "text/csv" });
  }, [ ])

  return (
    <main className="h-full relative p-3 rounded-md grid grid-rows-[max-content_1fr] gap-3 lg:gap-4">
      <div className="">
        <ModuleLandingPageNav className="lg:hidden !pt-0 pb-3" /> 
        <ModuleFilesHeader />
      </div>
      
      <div className="file-list h-full grid">
        <div className="bg-white border-[12px] border-white shadow min-h-full w-full  max-h-[50vh] overflow-y-auto max-md:overflow-x-auto ring-1 ring-zinc-200 rounded-md">
          <table cellPadding={10} className=" min-w-max w-full">
            <thead className="head sticky top-0 w-full z-[1] text-slate-500">
              <tr className=" w-full text-sm font-medium">
                <td className="cell">
                  <div className="line-in">
                    <Checkbox className="!p-0" />
                    Name
                  </div>
                </td>
                <td className="cell max-md:hidden">Last Updated</td>
                <td className="cell max-md:hidden">Size (in kB)</td>
                <td className="cell"></td>
              </tr>
            </thead>
            <tbody>
              {
                cookieAccessToken
                ? (
                  isLoading
                ? (
                  <TableSkeleton numCols={4} numRows={28} />
                  ) : (
                    data && (
                      data?.length === 0
                      ? (
                        <TableEmpty colSpan={4} >
                          <div className="flex flex-col gap-3">
                            <p className="">No records to display. {!cookieAccessToken && "Sign in"}</p>
                            <Link href={!cookieAccessToken ? "/sign-in" : "create"} className="btn bg-black/90 w-max mx-auto text-white">{!cookieAccessToken ? "Sign in" : "Create Sheet"}</Link>
                          </div>
                        </TableEmpty>
                      ) : (
                        data?.map((file, index) => (
                          <TableRow key={`finance-tracker-file-${index}`} file={file} setIsDeleteModalOpen={setIsDeleteModalOpen} setSelectedFile={setSelectedFile} />
                        ))
                      )
                    )
                  )
                ) : (
                  <TableEmpty colSpan={4} >
                    <div className="flex items-center justify-center h-full w-full"><EmptyFileList handleInitiateCreateSheet={() => setIsCreateModalOpen(true)} /></div>
                  </TableEmpty>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
      
      <AnimatePresence>
        { isCreateModalOpen && <CustomModal handleModalClose={() => setIsCreateModalOpen(false)}><CreateFinanceTrackerSheet handleModalClose={() => setIsCreateModalOpen(false)} /></CustomModal> }
        { isDeleteModalOpen && <CustomModal setIsModalOpen={setIsDeleteModalOpen} modalData={selectedFile}><DeleteFileModal /></CustomModal> }
      </AnimatePresence>
    </main>
  )
}

interface ITableRowProps {
  file: Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0];
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedFile: React.Dispatch<React.SetStateAction<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]|null>>
}

function TableRow({ file, setIsDeleteModalOpen, setSelectedFile }: ITableRowProps) {
  const router = useRouter();
  const [ fileName, setFileName ] = useState<string>(file?.folderName?.replace(".csv", "") as string)
  const [ isEditing, setIsEditing ] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement|null>(null);



  const [ updateFileName, { isLoading: isUpdatingFile, isSuccess: fileNameUpdateSuccess, isError: updateFileNameIsError }] = api.commonApis.useRenameFolderAndPrimaryFileMutation();
  const [ getFileVersions, { data: fileVersions, isLoading: isGettingFileVersions, isError: fileVersionsIsError }] = api.commonApis.useLazyGetFileVersionsQuery();
  const [ restoreFileVersion, { isLoading: isRestoringFileVersion, isError: fileRestoreIsError, isSuccess: fileRestoreIsSuccess }] = api.commonApis.useRestoreFileVersionMutation();

  useEffect(() => {
    if (fileRestoreIsSuccess) {
      router.push(file?.primaryFile?.fileId as string);
      Toast("success", `Restored version on ${file?.primaryFile?.fileName}`);
    }
    if (fileRestoreIsError) Toast("error", `Could not restore ${file?.primaryFile?.fileName} version`)
  }, [ fileRestoreIsSuccess, fileRestoreIsError ])

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    inputRef.current?.focus();
    setIsEditing(true);
    if (isEditing) updateFileName({ folderId: file.folderId as string, primaryFileMimeType: "text/csv", newFileName: `${fileName}.csv` });
    // if (!isEditing) {
    //   inputRef.current?.focus();
    //   setIsEditing(true);
    // } else {
    //   setIsEditing(false)
    //   updateFileName({ folderId: file.folderId as string, primaryFileMimeType: "text/csv", newFileName: `${fileName}.csv` });
    // }
  };

  const handleGetFileVersions = (e: MouseEvent<HTMLButtonElement|any>, fileId: string) => {
    e.stopPropagation();
    getFileVersions(fileId);
  };

  const initiateDelete = (file: Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]) => {
    setSelectedFile(file);
    setIsDeleteModalOpen(true);
  }

  useEffect(() => {
    if (fileNameUpdateSuccess) {
      Toast("success", `${file?.primaryFile?.fileName} file name updated`);
      setIsEditing(false);
    }
    if (updateFileNameIsError) Toast("error", `Unable to update file name ${file?.primaryFile?.fileName}`);
  }, [ fileNameUpdateSuccess, updateFileNameIsError ]);
  console.log(file)
  return (
    <tr onClick={() => router.push(file?.primaryFile?.fileId as string)} className="border-b border-dashed cursor-pointer text-slate-500 odd:bg-zinc-100 border-b-zinc-300 duration-300 hover:bg-green-100" >
      <td className="cursor-pointer">
        <div onClick={(e) => e.stopPropagation()} className="line-in bg-tes w-max">
          <Checkbox className="!p-0" />
          <div className="flex flex-col">
            <ResponsiveTextInput
              type="text"
              value={fileName}
              ref={inputRef}
              onFocus={() => setIsEditing(true)}
              // onBlur={() => (!isUpdatingFile || isEditing) && setIsEditing(false)}
              onChange={(e) => { e.stopPropagation(); setFileName(e.target.value)}}
              className="inline-block w-max text-slate-800 pr-2 outline-none h-full"
            />
            <div className="text-xs flex flex-row gap-3">
              <span className="">Jan 6 2024</span>
              <span className="">{splitInThousand(file?.primaryFile?.size as string)} Kb</span>
            </div>
          </div>
          { isEditing && <button onClick={(e) => { e.stopPropagation(), inputRef.current?.focus(), handleEdit(e)}} className="z-[3] text-green-600 rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-green-500">
            { isUpdatingFile ? <CircularProgress size={14} /> : <TickIcon className="!size-5" /> }
          </button>}
        </div>
      </td>
      <td className="max-md:hidden">Jan 6 2024</td>
      <td className="max-md:hidden">{splitInThousand(file?.primaryFile?.size as string)} Kb</td>
      <td>
        <div className="flex flex-row items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(), handleEdit(e)}} className=""><PenIcon className="size-5 lg:size-6" /></button>
          <button onClick={(e) => { e.stopPropagation(), handleGetFileVersions(e, file?.primaryFile?.fileId as string)}} className="relative">
            { isRestoringFileVersion ? <CircularProgress size={14} /> : <ClockTimeIcon className="size-6 lg:size-6" /> }
            <Select
              onMouseDown={(e) => handleGetFileVersions(e, file?.primaryFile?.fileId as string)}
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
                      <MenuItem onClick={() => restoreFileVersion({ fileId: file?.primaryFile?.fileId as string, revisionId: version?.id, mimeType: "text/csv" })} key={`file-version-${index}`} className="flex gap-2"><span className="text-zinc-400">Timestamp: </span> {version?.modifiedTime?.split(".")[0]?.replace("T", " ")}</MenuItem>
                    ))
                  ) : (
                    <MenuItem className="">No file versions</MenuItem>
                  )
                  
                ) : (
                  <MenuItem className="">Loading ...</MenuItem>
                )
              }
              
            </Select>
          </button>
          <button onClick={(e) => { e.stopPropagation(), initiateDelete(file)}} className=""><TrashIcon className="size-5 lg:size-6" /></button>
          {/* <LoadingButton
            loading={isUpdatingFile}
            success={fileNameUpdateSuccess}
            successResetDuration={1500}
            successText="Sucessful"
            className="px-4 !py-2 bg-violet-500 text-white rounded"
            onClick={handleEdit}
          >
            { isEditing ? "Save" : "Rename" }
          </LoadingButton> */}
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
                      <MenuItem onClick={() => restoreFileVersion({ fileId: file?.primaryFile?.fileId, revisionId: version?.id, mimeType: "text/csv" })} key={`file-version-${index}`} className="flex gap-2"><span className="text-zinc-400">Timestamp: </span> {version?.modifiedTime?.split(".")[0]?.replace("T", " ")}</MenuItem>
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
          {/* <LoadingButton
            loading={isLoading}
            className="px-4 !py-2 bg-red-600 text-white rounded"
            onClick={(e) => { e.stopPropagation(); deleteDocument(file?.folderId as string)}}
          >
            Delete
          </LoadingButton> */}
        </div>
      </td>
    </tr>
  )
}