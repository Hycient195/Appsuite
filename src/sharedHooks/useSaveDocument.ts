import api from "@/redux/api";
import { isLoggedIn } from "@/sharedConstants/common";
import { IUpdateFileRequest, TMimeTypes } from "@/types/shared.types";
import { useEffect, useRef, useState } from "react";

interface IProps {
  fileId: string;
  contentToSave: any;
  contentMimeType: TMimeTypes;
  loadedSucessfully?: boolean;
}

export default function useSaveDocument({ fileId, contentToSave, contentMimeType, loadedSucessfully = true }: IProps) {
  const isFirstRender = useRef(true);

  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const [ saveFile, { isLoading: isSaving, isSuccess: saveFileIsSuccess, isError: saveFileIsError, data } ] = api.commonApis.useSaveFileMutation();

  const handleSaveFile = (saveType: IUpdateFileRequest["updateType"]) => {
    if (contentToSave && isLoggedIn && loadedSucessfully) {
      saveFile({ fileId, content: JSON.stringify(contentToSave), mimeType: contentMimeType, updateType: saveType })
    }
  }

  /* Autosave page change tracker debounce effect */
  useEffect(() => {
    // Skip the effect on the first render
    const newTimer: NodeJS.Timer|null = null;

    if (isFirstRender.current) {
      isFirstRender.current = false; // Set to false after first render
      return;
    } else {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      const newTimer = setTimeout(() => {
        if (!isFirstRender.current && isLoggedIn && loadedSucessfully && !isFirstRender.current) {
          handleSaveFile("autosave");
        }
        clearTimeout(newTimer);
      }, 3000);
  
      setSaveTimer(newTimer);
    }

    return () => {
      if (newTimer) {
        clearTimeout(newTimer);
      }
    };
  }, [ contentToSave ]);

  return {
    handleSaveFile,
    isSaving,
    saveFileIsSuccess,
    saveFileIsError,
    saveResponse: data
  }
}