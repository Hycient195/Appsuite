import api from "@/redux/api";
import { isLoggedIn } from "@/sharedConstants/common";
import { IUpdateFileRequest, TMimeTypes } from "@/types/shared.types";
import { MutationDefinition, TypedMutationTrigger } from "@reduxjs/toolkit/query/react";
import { useEffect, useRef, useState } from "react";

interface IProps<T> {
  autoSaveTrigger: any;
  functionTrigger: TypedMutationTrigger<(any|void), (any|void), any>
  triggerFunctionArguments?: any;
  loadedSucessfully?: boolean;
  shouleExecuteTrigger?: boolean
  autoSaveInterval?: number
}

export default function useAutoSave<T>({ autoSaveTrigger, functionTrigger, triggerFunctionArguments, loadedSucessfully = true, shouleExecuteTrigger = true, autoSaveInterval = 3000 }: IProps<T>) {
  const isFirstRender = useRef(true);

  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSaveFile = (saveType: IUpdateFileRequest["updateType"]) => {
    if (loadedSucessfully && shouleExecuteTrigger) {
      // @ts-ignore
      functionTrigger(triggerFunctionArguments)
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
        if (loadedSucessfully && shouleExecuteTrigger) {
          handleSaveFile("autosave");
        }
        clearTimeout(newTimer);
      }, autoSaveInterval);
  
      setSaveTimer(newTimer);
    }

    return () => {
      if (newTimer) {
        clearTimeout(newTimer);
      }
    };
  }, [ autoSaveTrigger ]);
}