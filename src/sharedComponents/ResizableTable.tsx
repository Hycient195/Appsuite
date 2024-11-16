import { useState, useCallback, useEffect, useRef, useLayoutEffect, createRef } from "react";

type Header = {
  text: string;
  ref: React.RefObject<HTMLTableCellElement>;
};

type TableProps = {
  headers: string[];
  minCellWidth: number;
  tableContent: React.ReactNode;
  tableClassName?: string;
};

const ResizableTable: React.FC<TableProps> = ({ headers, minCellWidth, tableContent, tableClassName }) => {
  const [tableHeight, setTableHeight] = useState<string>("auto");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tableElement = useRef<HTMLTableElement>(null);

  const columns: Header[] = useRef(
    Array.from({ length: headers.length }, (_, index) => ({
      text: headers[index],
      ref: createRef<HTMLTableCellElement>(),
    }))
  ).current;

  useEffect(() => {
    if (tableElement.current) {
      setTableHeight(`${tableElement.current.offsetHeight}px`);
    }
  }, [ tableContent]);

  const mouseDown = (index: number) => {
    setActiveIndex(index);
  };

  const fractions = useRef<number[]>([11.5,48,13.5,13.5,13.5]);

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      if (!tableElement.current || activeIndex === null) return;

      const tableWidth = tableElement.current.clientWidth;
      const currentCol = columns[activeIndex];
      const nextCol = columns[activeIndex + 1];
      
      if (currentCol.ref.current && nextCol?.ref.current) {
        const newWidth = (e.clientX - currentCol.ref.current.getBoundingClientRect().left);
        const nextWidth = (nextCol.ref.current.getBoundingClientRect().right - e.clientX)

        if (newWidth > minCellWidth && newWidth < tableWidth && nextWidth > minCellWidth && nextWidth < tableWidth) {
          const newColFraction = (newWidth / tableWidth) * 100;
          const nextColFraction = (nextWidth / tableWidth) * 100;
          fractions.current[activeIndex] = newColFraction;
          fractions.current[activeIndex + 1] = nextColFraction;
          const gridColumns = fractions.current.map(fr => `${fr}%`).join(" ");
          tableElement.current.style.gridTemplateColumns = gridColumns;
        }
      }
    },
    [activeIndex, columns, minCellWidth,]
  );
  

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
  }, []);
  
  const removeListeners = useCallback(() => {
    const tableSelector = document.querySelectorAll(".resizeable-table");
    tableSelector.forEach((s) => {
      s.removeEventListener("mousemove", mouseMove as EventListener);
      s.removeEventListener("mouseup", mouseUp);
    });
  }, [mouseMove, mouseUp]);
  
  useEffect(() => {
    if (activeIndex !== null) {
      const tableSelector = document.querySelectorAll(".resizeable-table");
  
      tableSelector.forEach((s) => {
        s.addEventListener("mousemove", mouseMove as EventListener);
        s.addEventListener("mouseup", mouseUp);
      });
  
      return () => {
        removeListeners();
      };
    }
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  return (
    <div className="containe max-w-screen-lg mx-auto">
      <div className="table-wrapper grid bg-green-5">
        <table className={`relative resizeable-table w-full [&_th]:relative
          [&_td]:border-t [&_td:not(:last-of-type)]:border-r [&_th]:border-t [&_th:not(:last-of-type)]:border-r [&]:border-zinc-500 [&_*]:border-zinc-500 border-x border-b
          [&_thead]:!contents [&_tbody]:!contents [&_tr]:!contents
          grid grid-cols-[11.5%_48%_13.5%_13.5%_13.5%] ${tableClassName}`}
          ref={tableElement}>
          <thead className="w-full">
            <tr style={{ fontFamily: "sans-serif"}} className=" select-none  w-full">
              {columns.map(({ ref, text }, i) => (
                <td ref={ref} key={text} className="font-bold text-center py-1.5 relative">
                  <span className=" whitespace-nowrap overflow-ellipsis overflow-hidden block">{text}</span>
                  <div
                    style={{ height: tableHeight }}
                    onMouseDown={() => mouseDown(i)}
                    className={`resize-handle block hover:bg-[#ccc] absolute cursor-col-resize w-[3px] right-0 !top-0 z-[1] border-r-2 !border-r-transparent  ${activeIndex === i ? "!border-r !border-r-[#517ea5]" : "idle"}`}
                  />
                </td>
              ))}
            </tr>
          </thead>
          {tableContent}
        </table>
      </div>
      {/* <button onClick={resetTableCells}>Reset</button> */}
    </div>
  );
};

export default ResizableTable;