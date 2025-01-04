import api from "@/redux/api";
import { getFoldersWithPrimaryFile } from "@/services/googleDriveService";
import { useModalContext } from "@/sharedComponents/CustomModal";
import LoadingButton from "@/sharedComponents/LoadingButton";
import { Toast } from "@/sharedComponents/utilities/Toast";
import { useEffect } from "react";

export default function DeleteFileModal() {
  const { handleModalClose, modalData } = useModalContext<Awaited<ReturnType<typeof getFoldersWithPrimaryFile>>[0]>();
  const [ deleteDocument, { isLoading, isSuccess, isError }] = api.commonApis.useDeleteFolderAllFilesInFolderMutation();

  const handleDelete = () => {
    deleteDocument(modalData?.folderId as string)
  };

  useEffect(() => {
    if (isSuccess) {
      Toast("success", `Deleted ${modalData?.primaryFile?.fileName}`);
      handleModalClose();
    };
    if (isError) Toast("error", "Unable to delete file");
  }, [ isSuccess, isError ])

  return (
    <div className="md:min-h-[300px] w-full flex flex-col gap-4 max-md:justify-end justify-center">
      <p className="text-red-600 text-lg font-medium text-center">Are you sure you want to delete {modalData?.primaryFile?.fileName?.split(".")?.[0]}?</p>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button onClick={handleModalClose} type="button" className="btn bg-white border border-zinc-200 text-primary">Cancel</button>
        <LoadingButton onClick={handleDelete} loading={isLoading} className="btn bg-red-500 text-white">Delete</LoadingButton>
      </div>
    </div>
  )
}