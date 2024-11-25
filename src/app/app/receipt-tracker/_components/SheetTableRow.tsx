import { SaveLoadingSpinner } from "@/sharedComponents/CustomIcons";
import { formatDateInput, splitInThousand, splitInThousandForTextInput } from "@/utils/miscelaneous";
import axios from "axios";
import { IReceiptTrackerPage, IReceiptTrackerTableRow } from "../_types/types";
import { ChangeEvent, useState } from "react";

interface ITableRowProps {
  row: IReceiptTrackerTableRow;
  pageIndex: number;
  rowIndex: number;
  inputRefs: any;
  handleInputChange: (pageIndex: number, rowIndex: number, field: string, value: string | number) => void;
  insertRow: (pageIndex: number, rowIndex: number, rowsToAdd?: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, pageIndex: number, rowIndex: number, columnKey: string) => void;
  tableWidth: number;
  cursorPositionRef: any;
  resetCursorPosition: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumericInputBlur: (pageIndex: number, rowIndex: number, field: string, event: ChangeEvent<HTMLInputElement>) => void;
  removeRow: (pageIndex: number, rowIndex: number) => void;
  isLoggedIn: boolean;
  pages: IReceiptTrackerPage[]
  setPages: React.Dispatch<React.SetStateAction<IReceiptTrackerPage[]>>;
  params: any;
}

export default function SheetTableRow({ row, pageIndex, rowIndex, inputRefs, handleInputChange, insertRow, handleKeyDown, tableWidth, cursorPositionRef, resetCursorPosition, handleNumericInputBlur, removeRow, isLoggedIn, pages, setPages, params }: ITableRowProps) {

  const [ isLoading, setIsLoading ] = useState({ uploading: false, deleting: false, removingRow: false });
  const [ isDragging, setIsDragging ] = useState<boolean>(false);
  
  const handleUploadReceipt = async (file: any, pageIndex: number, rowIndex: number) => {
    if (!file || !isLoggedIn) return;
    setIsLoading({ ...isLoading, uploading: true });
    const imageFile = file;
    const data = new FormData();
    data.append("fileId", params?.fileId);
    data.append("content", imageFile);

    axios.put<{ id: string, url: string }>("/api/google-drive/file-in-folder", data)
      .then((res) => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].rows[rowIndex].receipt = `${res.data?.id}<||>${res.data?.url}`;
        setPages(pagesCopy);
        setIsLoading({ ...isLoading, uploading: false });
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, uploading: false });
        console.log(err)
      })
  };


  const handleDeleteReceipt = async (fileId: string, action?: any) => {
    setIsLoading({ ...isLoading, deleting: true, removingRow: action ? true : false });
    axios.delete(`/api/google-drive/file?fileId=${fileId}`)
      .then(() => {
        const pagesCopy = [ ...pages ]
        pagesCopy[pageIndex].rows[rowIndex].receipt = "";
        setPages(pagesCopy);
        if (action) action();
        setIsLoading({ ...isLoading, deleting: false, removingRow: false });
      })
      .catch((err) => {
        setIsLoading({ ...isLoading, deleting: false, removingRow: false });
        console.log(err)
      })
  }

  const handleRemoveRow = async (pageIndex: number, rowIndex: number, row: IReceiptTrackerTableRow) => {
    if (row?.receipt) {
      await handleDeleteReceipt(
        row?.receipt?.split("<||>")[0], () => {
          removeRow(pageIndex, rowIndex)
        }
      );
    } else {
      removeRow(pageIndex, rowIndex);
    }
  };

  // Prevent the default behavior to allow the drop event
  const handleReceiptDragOver = (e: any) => {
    e.preventDefault();
    if (!row?.receipt || row?.receipt === "0") setIsDragging(true);
  };

  // Optional: add styling or other effects when a file is dragged over
  const handleReceiptDragEnter = (e: any) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
    if (!row?.receipt || row?.receipt === "0") setIsDragging(true);
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

    if (files && files.length > 0 && (!row?.receipt || row?.receipt === "0")) {
      // Call the provided upload handler with the event and indices
      handleUploadReceipt(files[0], pageIndex, rowIndex, );
      e.dataTransfer.clearData();
    }
  };

  return (
    <tr style={{ fontFamily: "sans-serif"}} className={`relative group/row hover:cursor-pointer group-has-[button.remove-btn]:hover:[&_div.remove-hover]:!hidden`}>
      <td  className="  items-center relative ">
        <div style={{ width: `${tableWidth}px`}} className="bg-transparen bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
          <button onClick={() => insertRow(pageIndex, rowIndex+1)} className="bg-green-500 hidden duration-300 group-hover/line:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-2 items-center justify-center font-semibold">+</button>
        </div>
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-date`, el)}}
          type="text"
          value={row.date}
          className='w-full h-full px-1 text-right focus:outline focus:outline-2 focus:outline-zinc-400 font-medium'
          onChange={e => { handleInputChange(pageIndex, rowIndex, 'date', formatDateInput(e.target.value)), cursorPositionRef.current = e.target.selectionStart, resetCursorPosition(e) }}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "date")}
        />
      </td>

      <td className="  items-center relative">
        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.receiptName}</p> {/* Placeholder to hold textarea height autoresize */}
        <textarea
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-receiptName`, el)}}
          value={row.receiptName}
          rows={1}
          className={`w-full ${(row.receiptName === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-zinc-400 font-sans tracking-wide font-bold" : "font-medium"} absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'receiptName', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "receiptName")}
        />
      </td>

      <td className="items-center relative">
        {/* <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.receiptName}</p> Placeholder to hold textarea height autoresize */}
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-receiptName`, el)}}
          value={row.payerId}
          className='w-full h-full px-1 text-center focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          onChange={e => handleInputChange(pageIndex, rowIndex, 'payerId', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "payerId")}
        />
      </td>
      
      <td className="items-center " >
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-receipt`, el)}}
          className='w-full h-full px-1 text-right text-green-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={splitInThousandForTextInput(row.amount === "0" ? "" : row.amount)}
          // disabled={(!!row.receipt&&row.receipt!=="0") || row.receiptName === "BALANCE BROUGHT FORWARD"}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'amount', e.target.value?.replace(/[^0-9.]/g, ""))}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "receipt")}
          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "amount", e)}
        />
      </td>

      {/* <td className={`px-1 relative text-right flex justify-end text-black/80 items-center ${parseFloat(row.subTotal) < 0 && "text-red-600"} ${(rowIndex === 0 && row?.receiptName === "BALANCE BROUGHT FORWARD") ? "!font-bold" : "font-medium"}`}>
        {splitInThousand(row.subTotal)}
      </td> */}

      <td className="items-center relative">
        {/* <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.receiptName}</p> Placeholder to hold textarea height autoresize */}
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-receiptName`, el)}}
          value={row.paymentType}
          className='w-full h-full px-1 text-center focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          onChange={e => handleInputChange(pageIndex, rowIndex, 'paymentType', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "paymentType")}
        />
      </td>

      <td onDragOver={handleReceiptDragOver}
        onDragEnter={handleReceiptDragEnter}
        onDragLeave={handleReceiptDragLeave}
        onDrop={handleReceiptDrop}
        className={`flex items-center ${!isLoading ? "cursor-not-allowed" : ""}`}
      >
        <div className="bg-transparen bg-transparent peer/test flex flex-row gap-2 items-center relative bg-tes w-[calc(100%+10px)] -right-3 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
          {/* {row.receipt} */}
          {
            (row?.receipt) ? (
              !isLoading.deleting
              ? (
                <>
                  <a href={row.receipt?.split("<||>")[1]} target='_blank' rel='noreferrer' className="!text-blue-600 underline">Link</a>
                  <button onClick={() => handleDeleteReceipt(row.receipt?.split("<||>")[0])} className='noExport'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </button>
                </>
              ) : (
                <SaveLoadingSpinner height={25} width={25} />
              )
              
            ) : (
              !isLoading.uploading
              ? (
                <label htmlFor={`file-input-${pageIndex}-${rowIndex}`} className='noExport' title='You can drag and drop in the column cell to upload a receipt'>
                  <p className="text-purple-600 underline">Upload or Drop</p>
                  <input disabled={!isLoggedIn} type="file" accept="image/jpeg, image/jpg, image/png, image/svg, application/pdf" id={`file-input-${pageIndex}-${rowIndex}`} className='hidden' onChange={(e) => handleUploadReceipt(e.target.files![0], pageIndex, rowIndex)} />
                </label>
              ) : (
                <SaveLoadingSpinner height={25} width={25} />
              )
            )
          }
          <button onClick={() => handleRemoveRow(pageIndex, rowIndex, row)} className="peer/removeBtn bg-red-400  duration-300 z-[3] hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-3 items-center justify-center font-semibold">-</button>
          <div style={{ width: `${tableWidth}px`}} className={`${isDragging ? "!block !bg-green-500/60" : ""} ${(isLoading.deleting && isLoading.removingRow) ? "!bg-red-500/70 animate-pulse !block" : ""}  remove-hover w-full h-full hidden peer-hover/removeBtn:block bg-red-400/20 -translate-x-3 top-0 right-0 absolute`}></div>
        </div>
      </td>
    </tr>
  )
}