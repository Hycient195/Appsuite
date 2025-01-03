import { Reorder } from "motion/react"
import { useBalanceSheetContext } from "../_contexts/financeTrackerContext"
import { IBalanceSheetFile, IBalanceSheetPage } from "../_types/types";
import { formatDateInput, splitInThousand, splitInThousandForTextInput } from "@/utils/miscelaneous";
import { memo, MutableRefObject, RefObject } from "react";

interface IProps {
  rowIndex: number;
  row: IBalanceSheetPage["rows"][0]
  pageIndex: number;
  cursorPositionRef: MutableRefObject<any|null>;
  resetCursorPosition: any
}
function BalanceSheetRow({ rowIndex, pageIndex, cursorPositionRef, resetCursorPosition, row }: IProps) {

  const { insertRow, inputRefs, handleInputChange, handleKeyDown, handleNumericInputBlur, removeRow } = useBalanceSheetContext();
  return (
    <>
      <td  className="  items-center relative ">
        <div style={{ width: `100%`}} className="bg-transparen bg-green-500 opacity-0 hover:opacity-100 !border-none group/line absolute z-[2] left-[-1px] bottom-0 translate-y-[4px] cursor-pointer h-1 rounded">
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
        <p className='w-full h-full p-1 px-2 !m-0 invisible font-medium'>.{row.narration}</p> {/* Placeholder to hold textarea height autoresize */}
        <textarea
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-narration`, el)}}
          value={row.narration}
          rows={1}
          className={`w-full ${(row.narration === "BALANCE BROUGHT FORWARD" && rowIndex === 0) ? "text-zinc-400 font-sans tracking-wide font-bold" : "font-medium"} absolute px-2 items-center resize-none h-full p-1 left-0 top-0 text-left bg-transparent focus:outline !overflow-visible no-scrollbar focus:outline-2 focus:outline-zinc-400`}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'narration', e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "narration")}
        />
      </td>
      <td className="flex items-center">
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-credit`, el)}}
          className='w-full h-full px-1 text-right text-red-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={splitInThousandForTextInput(row.debit === "0" ? "" : row.debit)}
          disabled={(!!row.credit&&row.credit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'debit', e.target.value?.replace(/[^0-9.]/g, ""))}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "credit")}
          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "debit", e)}
        />
      </td>
      <td className="items-center" >
        <input
          ref={(el) => {inputRefs.current.set(`${pageIndex}-${rowIndex}-debit`, el)}}
          className='w-full h-full px-1 text-right text-green-600 focus:outline focus:outline-2 focus:outline-zinc-400 disabled:bg-zinc-50 disabled:cursor-not-allowed font-medium'
          value={splitInThousandForTextInput(row.credit === "0" ? "" : row.credit)}
          disabled={(!!row.debit&&row.debit!=="0") || row.narration === "BALANCE BROUGHT FORWARD"}
          onChange={e => handleInputChange(pageIndex, rowIndex, 'credit', e.target.value?.replace(/[^0-9.]/g, ""))}
          onKeyDown={(e) => handleKeyDown(e, pageIndex, rowIndex, "debit")}
          onBlur={(e) => handleNumericInputBlur(pageIndex, rowIndex, "credit", e)}
        />
      </td>
      <td className={`peer/test  px-1 relative text-right flex justify-end text-black/80 items-center ${parseFloat(row.balance) < 0 && "text-red-600"} ${(rowIndex === 0 && row?.narration === "BALANCE BROUGHT FORWARD") ? "!font-bold" : "font-medium"}`}>
        <div className="bg-transparen bg-transparent bg-tes w-[calc(100%+10px)] -right-3 !border-none z-[-1 absolute bg-green-30 bottom- cursor-pointer h-full">
          <button onClick={() => removeRow(pageIndex, rowIndex)} className="peer/removeBtn bg-red-400  duration-300 z-[3] hidden group-hover/row:flex animate-fade-in [animation-duration:200ms] h-5 w-5 rounded-full absolute top-0 bottom-0 my-auto -right-3 items-center justify-center font-semibold">-</button>
          <div style={{ width: `100%`}} className="remove-hover w-full h-full hidden peer-hover/removeBtn:block bg-red-400/20 -translate-x-3 top-0 right-0 absolute "></div>
        </div>
        {splitInThousand(row.balance)}
      </td>
    </>
  )
}

export default memo(BalanceSheetRow)