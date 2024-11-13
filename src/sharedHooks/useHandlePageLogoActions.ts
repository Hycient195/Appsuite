import axios from "axios";
import { useEffect, useMemo, useState } from "react";

type WithImageUrl = { imageUrl?: string };

interface IProps<T extends WithImageUrl> {
  pages: T[];
  page: T;
  setPages: React.Dispatch<React.SetStateAction<T[]>>;
  isLoggedIn: boolean;
  removePage: (pageIndex: number) => void;
  pageIndex: number;
  params: any;
}

export default function useHandlePageLogoActions<T extends WithImageUrl>({ pages, page, setPages, isLoggedIn, removePage, pageIndex, params }: IProps<T>) {
  const [ isLoading, setIsLoading ] = useState({ uploading: false, deleting: false, removingPage: false });
  const [ isDragging, setIsDragging ] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Prevent the default behavior to allow the drop event
  const handleReceiptDragOver = (e: any) => {
    e.preventDefault();
    if (!page?.imageUrl) setIsDragging(true);
  };

  // Optional: add styling or other effects when a file is dragged over
  const handleReceiptDragEnter = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    if (!page?.imageUrl) setIsDragging(true);
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

    if (files && files.length > 0 && (!page?.imageUrl)) {
      // Call the provided upload handler with the event and indices
      handleUploadLogo(files[0], pageIndex);
      e.dataTransfer.clearData();
    }
  };

  const fetchImageAsBase64 = async () => {
    try {
      // const response = await fetch('https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz');
      // const response = await fetch(`/api/google-drive/image?imageUrl=${encodeURIComponent("https://drive.google.com/uc?export=view&id=1AEHAhbjEsRzVrdBGEDYNNsS7GtkkHFDz")}`);
      const response = await fetch(`/api/google-drive/image?imageUrl=${encodeURIComponent((page.imageUrl?.split("<||>")[1] as string)?.replace("file/d/","uc?export=view&id=")?.replace("/view?usp=drivesdk",""))}`);
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
    if (page?.imageUrl) fetchImageAsBase64();
  }, [ ]);

  // Fetch and convert image to Base64
  useEffect(() => {
    if (page?.imageUrl) fetchImageAsBase64();
  }, [ page?.imageUrl ]);

  const handleUploadLogo = async (file: any, pageIndex: number) => {
    if (!file || !isLoggedIn) return;
    setIsLoading({ ...isLoading, uploading: true });
    const imageFile = file;
    const data = new FormData();
    data.append("fileId", params?.fileId);
    data.append("content", imageFile);

    axios.put<{ id: string, url: string }>("/api/google-drive/file-in-folder", data)
      .then((res) => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].imageUrl = `${res.data?.id}<||>${res.data?.url}`;
        setPages(pagesCopy);
        
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
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].imageUrl = "";
        setPages(pagesCopy);
        setImageSrc("");
        if (action) action();
        setIsLoading({ ...isLoading, deleting: false, removingPage: false });
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, deleting: false, removingPage: false });
        console.log(err)
      })
  }

  const handleRemovePage = async (pageIndex: number) => {
    if (page?.imageUrl) {
      await handleRemoveLogo(
        page.imageUrl?.split("<||>")[0], () => {
          removePage(pageIndex);
        }
      );
      removePage(pageIndex);
    } else {
      removePage(pageIndex);
    }
  };

  const hasLogoOrSpinner = useMemo(() => (isLoading.uploading || isLoading.deleting || isLoading.removingPage || page?.imageUrl), [ isLoading, page.imageUrl])

  return {
    handleReceiptDragEnter,
    handleReceiptDragLeave,
    handleReceiptDragOver,
    handleReceiptDrop,
    handleRemoveLogo,
    handleRemovePage,
    handleUploadLogo,
    isDragging,
    isLoading,
    imageSrc,
    hasLogoOrSpinner
  }
}