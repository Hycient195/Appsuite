import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Papa from "papaparse";
import { IReceiptTrackerPage, IReceiptTrackerTableRow } from '../_types/types';
import { useCancelableDebounce } from '@/sharedHooks/useCancellableDebounce';

const defaultRow: IReceiptTrackerTableRow = {
  date: '',
  receiptName: '',
  amount: "",
  subTotal: "",
  receipt: "",
};

export const defaultPage: IReceiptTrackerPage = {
  title: "",
  subTitle: "",
  rows: [{ ...defaultRow }], // Create a fresh copy for each default page
  totalAmount: "0",
  totalSubTotal: "0",
  receipt: "",
  
  rowsToAdd: 1,
  imageUrl: ""
};

export const useReceiptTracker = (fileName?: string) => {
  const [pages, setPages] = useState<IReceiptTrackerPage[]>([{ ...defaultPage, title: fileName??defaultPage.title, rows: [{ ...defaultRow }] }]);
  const [history, setHistory] = useState<IReceiptTrackerPage[][]>([]);
  const [future, setFuture] = useState<IReceiptTrackerPage[][]>([]);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [ tempHistoryStack, setTempHistoryStack ] = useState<IReceiptTrackerPage[]|null>(null);


  const prevPagesRef = useRef(pages);
  const inputRefs = useRef<Map<string, HTMLInputElement | HTMLTextAreaElement | null>>(new Map());

  const updateImageUrl = (url: string, pageIndex: number) => {
    const pageCopy = [...pages];
    pageCopy[pageIndex].imageUrl = url;
    updatePages(pageCopy);
  };



  const updateRowsToAdd = (pageNumber: number, action: ("increament"|"decreament"|null), defaltValue?: number): void => {
    const pageCopy = [ ...pages ]
    if (defaltValue) {
      pageCopy[pageNumber].rowsToAdd = defaltValue
    } else {
      pageCopy[pageNumber].rowsToAdd = action === "increament" ? pageCopy[pageNumber].rowsToAdd+=1 : (pageCopy[pageNumber]?.rowsToAdd > 1) ? pageCopy[pageNumber].rowsToAdd-=1 : pageCopy[pageNumber]?.rowsToAdd
    }
    setPages(pageCopy)
  }

  const updatePageTitle = (value: string, pageNumber: number): void => {
    const pageCopy = [ ...pages ]
    pageCopy[pageNumber].title = value;
    setPages(pageCopy);
    updatePages(pageCopy)
  }

  const updatePageSubtitle = (value: string, pageNumber: number): void => {
    const pageCopy = [ ...pages ]
    pageCopy[pageNumber].subTitle = value;
    updatePages(pageCopy)
    setPages(pageCopy)
  }

  const addPage = (afterPageIndex: number) => {
    const newPage = {
      ...defaultPage,
      // rows: [{ ...defaultRow, receiptName: "BALANCE BROUGHT FORWARD" }]
      rows: [{ ...defaultRow }]
    };
    const updatedPages = [...pages];
    updatedPages.splice(afterPageIndex + 1, 0, newPage);
    updatePages(updatedPages);
  };

  const removePage = (pageIndex: number) => {
    if (pages.length === 1) return; // Prevent removing all pages
    const updatedPages = pages.filter((_, idx) => idx !== pageIndex);
    updatePages(updatedPages);
  };

  const addRow = (pageIndex: number) => {
    const updatedPages = [...pages];
    const page = { ...updatedPages[pageIndex], rows: [...updatedPages[pageIndex].rows] };
    page.rows.splice(page.rows.length - 1, 0, { ...defaultRow });
    calculatePageTotals(page);
    updatedPages[pageIndex] = page;
    updatePages(updatedPages);
  };

  const insertRow = (pageIndex: number, rowIndex: number, rowsToAdd: number = 1) => {
    const updatedPages = [...pages];
    const page = { ...updatedPages[pageIndex], rows: [...updatedPages[pageIndex].rows] };
  
    for (let i = 0; i < rowsToAdd; i++) {
      if (page?.rows?.length > 1) {
        const previousBalance = (page.rows.length > 0 && rowIndex > 0) ? page.rows[rowIndex - 1].subTotal : "0";
        page.rows.splice(rowIndex + i, 0, { ...defaultRow, subTotal: previousBalance, date: (page.rows.length > 0 && rowIndex > 0) ? page.rows[rowIndex-1].date.slice(2,10) : ""});
      } else {
        page.rows.push({ ...defaultRow });
      }
    }
    
    calculatePageTotals(page);
    updatedPages[pageIndex] = page;
    updatePages(updatedPages);
    page.rowsToAdd = 1
  };

  const removeRow = (pageIndex: number, rowIndex: number) => {
    const updatedPages = [...pages];
    const page = { ...updatedPages[pageIndex], rows: [...updatedPages[pageIndex].rows] };
    page.rows.splice(rowIndex, 1);
    calculatePageTotals(page);
    updatedPages[pageIndex] = page;
    updatePages(updatedPages);
  };

  const handleInputChange = (pageIndex: number, rowIndex: number, field: string, value: string | number) => {
    const updatedPages = [...pages];
    const page = { ...updatedPages[pageIndex], rows: [...updatedPages[pageIndex].rows] };
    const row = { ...page.rows[rowIndex] };
    (row[field as keyof IReceiptTrackerTableRow] as string | number) =  value;
    page.rows[rowIndex] = row;
    calculatePageTotals(page);
    updatedPages[pageIndex] = page;
    updatePages(updatedPages);
  };

  const calculatePageBalances = useCallback((page: IReceiptTrackerPage, pageIndex: number) => {
    let previousBalance = "0";

    // Loop through each row to calculate balances
    page.rows.forEach((row, rowIndex) => {
      if (rowIndex === 0 && row.receiptName === 'BALANCE BROUGHT FORWARD') {
        // Set subTotal based on the previous page's final subTotal if it exists
        previousBalance = String((pages[pageIndex - 1]?.totalSubTotal || "0"));
        row.subTotal = previousBalance;
        row.amount = "0";
        // row.receipt = ""
      } else {
        // Calculate subTotal based on amount and receipt
        row.subTotal = String(
          ((!isNaN(parseFloat(previousBalance)) ? parseFloat(previousBalance) : 0) +(!isNaN(parseFloat(row.amount)) ? parseFloat(row.amount?.replace(/,/ig,"")) : 0))?.toFixed(2)
        );
        previousBalance = row.subTotal;
      }
    });
  
    // Recalculate totals and final subTotal for the current page
    calculatePageTotals(page);
    pages[pageIndex] = page;
  
    // Trigger recalculation on subsequent pages that have "BALANCE BROUGHT FORWARD" in the first row
    if (pageIndex < pages.length - 1) {
      const nextPage = pages[pageIndex + 1];
      if (nextPage.rows[0]?.receiptName === 'BALANCE BROUGHT FORWARD') {
        calculatePageBalances(nextPage, pageIndex + 1);
      }
    }
    return page;
  },[ pages ]);

  // Calculate total amount, receipt, and final subTotal for a page
  const calculatePageTotals = (page: IReceiptTrackerPage) => {
    let totalAmount = 0;
    // let receipt = 0;
    let totalSubTotal = 0;

    page.rows.forEach(row => {
      totalAmount += !isNaN(parseFloat(row.amount as unknown as string)) ? parseFloat(row.amount?.replace(/,/ig,"") as unknown as string) : 0;
      // receipt += !isNaN(parseFloat(row.receipt as unknown as string)) ? parseFloat(row.receipt?.replace(/,/ig,"") as unknown as string) : 0;
      totalSubTotal = !isNaN(parseFloat(row.subTotal as unknown as string)) ? parseFloat(row.subTotal?.replace(/,/ig,"") as unknown as string) : 0; // The last row's subTotal
    });

    page.totalAmount = String(totalAmount?.toFixed(2));
    // page.receipt = String(receipt?.toFixed(2));
    page.totalSubTotal = String(totalSubTotal?.toFixed(2));
  };

  const updatePages = (updatedPages: IReceiptTrackerPage[]) => {
    setPages(updatedPages);
    setHistory([...history, pages]); // Save the current state to history
    setFuture([]); // Clear future stack on new action
  };

  // const updatePages = (updatedPages: IReceiptTrackerPage[]) => {
  //   setPages(updatedPages);
  //   if (!tempHistoryStack) setTempHistoryStack(pages);

  //   if (saveTimer) clearTimeout(saveTimer);
  //   const newTimer = setTimeout(() => {
  //     if (tempHistoryStack) {
  //       setHistory([...history, tempHistoryStack]);
  //       setFuture([]);
  //     }
  //     setTempHistoryStack(null);
  //   }, 300);

  //   setSaveTimer(newTimer);
  // };


  const undo = () => {
    if (!canUndo) return;
    const lastState = history[history.length - 1];
    setFuture([pages, ...future]);
    setHistory(history.slice(0, -1));
    setPages(lastState);
  };

  const redo = () => {
    if (!canRedo) return;
    const nextState = future[0];
    setHistory([...history, pages]);
    setFuture(future.slice(1));
    setPages(nextState);
  };

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;


  /* ============================================= */
  /** CSV, Load and Download Functionality Section */
  /* ============================================= */
  const handleCSVImport = (event: ChangeEvent<HTMLInputElement>, pageIndex?: number) => {
    const file = event.target.files![0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const csvData = result.data;
          loadCSVData(csvData as string[][], pageIndex); // Use the method to load CSV data
        },
        skipEmptyLines: true,
      });
      updatePages([ ...pages ]);
    }
  };

  const importCSV = async (file: File) => {
    const text = await file.text();
    const importedPages: IReceiptTrackerPage[] = [];
    
    const sections = text.split('\n,,,,\n,,,,\n'); // Split pages by the separator in 'downloadAllPagesCSV'
    
    for (const section of sections) {
      const lines = section.trim().split('\n');
      if (lines.length < 4) continue; // Ignore if not enough lines
      
      const title = lines[0];
      const subTitle = lines[1];
      const rowLines = lines.slice(3, lines.length - 1); // Rows are after headers and before totals
      const totalLine = lines[lines.length - 1].split(',');

      const rows: IReceiptTrackerTableRow[] = rowLines.map(line => {
        const [date, receiptName, amount, receipt, subTotal] = line.split(',');
        return {
          date,
          receiptName,
          amount,
          receipt,
          subTotal: subTotal || "0",
        };
      });

      const totalAmount = (parseFloat(totalLine[2]) || 0)?.toFixed(2);
      const receipt = totalLine[3] || ""
      const totalSubTotal = (parseFloat(totalLine[4]) || 0)?.toFixed(2);

      const importedPage: IReceiptTrackerPage = {
        title,
        subTitle,
        rows,
        totalAmount,
        receipt,
        totalSubTotal,
        rowsToAdd: 1,
      };

      importedPages.push(importedPage);
    }

    setPages(importedPages);
  };

  const loadCSVData = (csvData: string[][], pageIndex?: number) => {
    if (pageIndex) {
      const pagesCopy = [ ...pages ];
      pagesCopy.splice(pageIndex, 1, ...convertToPages(csvData))
      setPages(pagesCopy);
      // updatePages(pagesCopy)
    } else {
      const pagesData = convertToPages(csvData);
      setPages(pagesData);
      // updatePages(pagesData)
    }   
  };

  function convertToPages(data: string[][]) {
    const pages = [];
    // let currentPage: { title: string, subTitle: string, rows: IReceiptTrackerTableRow[], totalAmount: number, receipt: number, totalSubTotal: number} = { title: '', subTitle: '', rows: [], totalAmount: 0, receipt: 0, totalSubTotal: 0 };
    let currentPage: IReceiptTrackerPage = { title: '', subTitle: '', rows: [], totalAmount: "0", receipt: "", totalSubTotal: "0", rowsToAdd: 1 };
  
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
  
      // Check for page separator (two arrays of 5 empty strings)
      if (row.length === 5 && row.every(cell => cell === '') && i < data.length - 1 && data[i + 1].every(cell => cell === '')) {
        // Push current page to pages and reset for a new page
        pages.push(currentPage);
        currentPage = { title: '', subTitle: '', rows: [], totalAmount: "0", receipt: "", totalSubTotal: "0", rowsToAdd: 1 };
        i++; // Skip the second separator row
        continue;
      }
  
      if (currentPage.title === '') {
        currentPage.title = row[0]; // First row is the title
      } else if (currentPage.subTitle === '') {
        currentPage.subTitle = row[0]; // Second row is the subTitle
      } else if (row[1] === 'TOTAL') {
        console.log(row[i])
        // Parse total row
        currentPage.imageUrl = row[0];
        currentPage.totalAmount = (parseFloat(row[2] || "0"))?.toFixed(2);
        currentPage.receipt = row[4]||"";
        currentPage.totalSubTotal = (parseFloat(row[3] || "0"))?.toFixed(2);
        currentPage.rowsToAdd = 1
      } else if (row[0] !== 'Date') { // Skip header row
        // Parse row data
        const [date, receiptName, amount, subTotal, receipt] = row;

        currentPage.rows.push({
          date: date || '',
          receiptName: receiptName || '',
          amount: String( amount || "0"),
          subTotal: String(subTotal || "0"),
          receipt: receipt || "",
        });
        
      }
    }
  
    // Add the last page if it exists
    if (currentPage.rows.length > 0) {
      pages.push(currentPage);
    }
    // console.log(pages)
    return pages;
  }

  const downloadPageCSV = (pageIndex: number) => {
    const page = pages[pageIndex];
    const csvData = generateCSVData(page);
    pages[pageIndex].title
    downloadCSV(csvData, pages[pageIndex].title ? `${pages[pageIndex].title}.csv` : `receipt-tracker${pageIndex + 1}.csv`);
  };

  const downloadAllPagesCSV = () => {
    const csvData = pages.map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
    downloadCSV(csvData, pages[0]?.title ? `${pages[0]?.title}.csv` : 'balance_sheet_all_pages.csv');
  };

  const generateCSVData = (page: IReceiptTrackerPage) => {
    const rowsCSV = page.rows
      .map(row => `"${row.date}","${row.receiptName}","${row.amount}","${row.subTotal}","${row.receipt}"`)
      .join('\n');
    const totalCSV = `${page.imageUrl??""},"TOTAL","${page.totalAmount}","${page.totalSubTotal}","${page.receipt}"`
    return `"${page.title}",,,,\n"${page.subTitle}",,,,\n"Date","Name","Amount","Sub Total","Receipt"\n${rowsCSV}\n${totalCSV}`;
  };

  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const updatedPages = pages.flatMap((page, pageIndex) => calculatePageBalances(page, pageIndex));
    if (JSON.stringify(updatedPages) !== JSON.stringify(prevPagesRef.current)) {
      setPages(updatedPages);
      prevPagesRef.current = updatedPages;
    }

  }, [pages, history, future, calculatePageBalances]);


  /* ===================================== */
  /** Event Handlers Functionality Section */
  /* ===================================== */
  const handleNumericInputBlur = (pageIndex: number, rowIndex: number, field: string, event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value?.replace(/,/ig,"");

    // Parse the value to a number to ensure it's valid, then format with two decimal places.
    if (!isNaN(Number(value))) {
      const formattedValue = !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : "0";
      handleInputChange(pageIndex, rowIndex, field, formattedValue);
    } else {
      console.error("Invalid input: Please enter a valid number.");
    }
  };

  /* Sample for row reorder by drag and drop functionality not yet implemented */
  const moveRow = (draggedRowIndex: number, targetRowIndex: number, pageIndex: number) => {
    const pagesCopy = [ ...pages ];
    const currentPageRows = pages[pageIndex];
    
    if (!currentPageRows || draggedRowIndex === targetRowIndex) {
      return;
    }
  
    const updatedRows = [...currentPageRows.rows];
    const [movedRow] = updatedRows.splice(draggedRowIndex, 1);
    updatedRows.splice(targetRowIndex, 0, movedRow);
    pagesCopy[pageIndex].rows = updatedRows;
    setPages(pagesCopy);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>, pageIndex: number, rowIndex: number, columnKey: string) => {
    const directionMap: Record<string, { rowOffset: number; colOffset: number }> = {
      ArrowUp: { rowOffset: -1, colOffset: 0 },
      ArrowDown: { rowOffset: 1, colOffset: 0 },
      ArrowLeft: { rowOffset: 0, colOffset: -1 },
      ArrowRight: { rowOffset: 0, colOffset: 1 },
    };

    const { rowOffset, colOffset } = directionMap[event.key] || {};
    if (rowOffset === undefined || colOffset === undefined) return;

    event.preventDefault();

    // Get next row and column based on offset
    const nextRowIndex = rowIndex + rowOffset;
    const nextColumnIndex = Object.keys(pages[pageIndex].rows[rowIndex]).indexOf(columnKey) + colOffset;
    const nextColumnKey = Object.keys(pages[pageIndex].rows[rowIndex])[nextColumnIndex];
    
    if (nextColumnKey && pages[pageIndex].rows[nextRowIndex]) {
      const nextCellId = `${pageIndex}-${nextRowIndex}-${nextColumnKey}`;
      const nextInput = inputRefs.current.get(nextCellId);
      nextInput?.focus();
    }
  };

  const movePage = (fromIndex: number, toIndex: number) => {
    const updatedPages = [...pages];
    const [movedPage] = updatedPages.splice(fromIndex, 1);
    updatedPages.splice(toIndex, 0, movedPage);
    setPages(updatedPages);
    updatePages(updatedPages);
  };

  return {
    updatePageTitle,
    updatePageSubtitle,
    pages,
    addPage,
    removePage,
    addRow,
    insertRow,
    removeRow,
    undo,
    redo,
    canUndo,
    canRedo,
    updateImageUrl,

    handleCSVImport,
    importCSV,
    loadCSVData,
    generateCSVData,
    downloadPageCSV,
    downloadAllPagesCSV,
    handleInputChange,
    updateRowsToAdd,
    setPages,
    updatePages,

    handleNumericInputBlur,
    moveRow,
    handleKeyDown,
    inputRefs,
    movePage,
  };
};