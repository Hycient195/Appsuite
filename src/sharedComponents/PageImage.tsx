import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { SaveLoadingSpinner } from "./CustomIcons";
import Image from "next/image";
import { handleUpdateStateProperty } from "@/utils/miscelaneous";

interface IProps<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  fileId?: string;
  imageProperty: string;
  propertyKey: string;
  isLoggedIn: boolean;
  height?: number;
  width?: number;
  placeholder?: string;
  className?: string;
}

export default function PageImage<T>({ isLoggedIn,  imageProperty, fileId, formData, setFormData, propertyKey, height = 70, width = 70, placeholder, className }: IProps<T>) {
  const [ isLoading, setIsLoading ] = useState({ uploading: false, deleting: false, removingPage: false });
  const [ isDragging, setIsDragging ] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Prevent the default behavior to allow the drop event
  const handleReceiptDragOver = (e: any) => {
    e.preventDefault();
    if (!imageProperty) setIsDragging(true);
  };

  // Optional: add styling or other effects when a file is dragged over
  const handleReceiptDragEnter = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    if (!imageProperty) setIsDragging(true);
  };

  const handleReceiptDragLeave = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    setIsDragging(false);
  };

  const handleReceiptDrop = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0 && (!imageProperty)) {
      // Call the provided upload handler with the event and indices
      handleUploadLogo(files[0]);
      e.dataTransfer.clearData();
    }
  };

  const fetchImageAsBase64 = async () => {
    try {
      // const response = await fetch('https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz');
      // const response = await fetch(`/api/google-drive/image?imageUrl=${encodeURIComponent("https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz")}`);
      const response = await fetch(`/api/google-drive/image?imageUrl=${encodeURIComponent((imageProperty?.split("<||>")[1] as string)?.replace("file/d/","uc?export=view&id=")?.replace("/view?usp=drivesdk",""))}`);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(blob);
      setIsLoading({ ...isLoading, uploading: false });
    } catch (error) {
      console.error('Failed to load image', error);
      setIsLoading({ ...isLoading, uploading: false });
    }
  };

  useEffect(() => {
    if (imageProperty) fetchImageAsBase64();
  }, [ ]);
  // Fetch and convert image to Base64
  useEffect(() => {
    if (imageProperty) fetchImageAsBase64();
  }, [ imageProperty ]);

  const handleUploadLogo = async (file: any) => {
    if (!file || !isLoggedIn || !fileId) return;
    setIsLoading({ ...isLoading, uploading: true });
    const imageFile = file;
    const data = new FormData();
    data.append("fileId", fileId);
    data.append("content", imageFile);

    axios.put<{ id: string, url: string }>("/api/google-drive/file-in-folder", data)
      .then((res) => {
        handleUpdateStateProperty(formData, setFormData, `${res.data?.id}<||>${res.data?.url}`, propertyKey);
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, uploading: false });
        console.log(err)
      })
  };

  const handleRemoveLogo = async (fileId: string, action?: any) => {
    setIsLoading({ ...isLoading, deleting: true, removingPage: action ? true : false });
    axios.delete(`/api/google-drive/file?fileId=${fileId}`)
      .then(() => {
        handleUpdateStateProperty(formData, setFormData, "", propertyKey);
        setImageSrc("");
        if (action) action();
        setIsLoading({ ...isLoading, deleting: false, removingPage: false });
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, deleting: false, removingPage: false });
        console.log(err)
      })
  }

  return (
    <>
      {
        (isLoading.uploading || isLoading.deleting || isLoading.removingPage || imageProperty)
        ? <div style={{ height: `${height}px`, width: `${width}px`}} className={`${isDragging ? "bg-green-500/40" : ""} relative !overflow-hidde z-[2] flex items-center justify-center ${className} `} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
          {
            (isLoading.uploading || isLoading.removingPage || isLoading.deleting)
            ? (
              <SaveLoadingSpinner height={height} width={height} className='' />
            ) : (imageProperty && imageSrc) && (
              <div className="relative w-full h-full ">
                <button onClick={() => handleRemoveLogo(imageProperty?.split("<||>")[0] as string)} className="absolute noExport cursor-pointer z-[10] w-max h-max -top-3 -left-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 !text-zinc-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
                <Image fill src={imageSrc as string}  alt='alternative'  className='object-contain w-full h-auto aspect-square'  onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop} />
              </div>
            )
          }
        </div>
        : (
          <label style={{ height: `${height}px`, width: `${width}px`}} htmlFor={`add-logo`} className={`${isDragging ? "bg-green-500/20" : "bg-zinc-100"} absolut cursor-pointer z-[1] flex items-center p-2 justify-center text-center rounded  -top-1  noExport ${className}`} onDragOver={handleReceiptDragOver} onDragEnter={handleReceiptDragEnter} onDragLeave={handleReceiptDragLeave} onDrop={handleReceiptDrop}>
            <span className="text-xs text-zinc-400">{placeholder??"Add/drop Image"}</span>
            <input id={`add-logo`} type="file" accept="image/jpeg, image/jpg, image/png" className='hidden' onChange={(e) => handleUploadLogo(e.target.files![0])} />
          </label>
        )
      }
    </>
  )
}