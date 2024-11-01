import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Papa from "papaparse";
import { IPage, IRow } from '../_types/types';

const defaultRow: IRow = {
  date: '',
  narration: '',
  credit: "",
  debit: "",
  balance: 0,
};

export const defaultPage: IPage = {
  title: "STATEMENT OF ACCOUNT",
  subTitle: "FROM PERIOD OF 1ST <MONTH> <YEAR> TO 31TH <MONTH> <YEAR>",
  rows: [{ ...defaultRow }], // Create a fresh copy for each default page
  totalCredit: 0,
  totalDebit: 0,
  finalBalance: 0,
  rowsToAdd: 1
};

export const useBalanceSheet = (fileName?: string) => {
  const [pages, setPages] = useState<IPage[]>([{ ...defaultPage, title: fileName??defaultPage.title, rows: [{ ...defaultRow }] }]);
  const [history, setHistory] = useState<IPage[][]>([]);
  const [future, setFuture] = useState<IPage[][]>([]);

  const prevPagesRef = useRef(pages);

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
    setPages(pageCopy)
  }

  const updatePageSubtitle = (value: string, pageNumber: number): void => {
    const pageCopy = [ ...pages ]
    pageCopy[pageNumber].subTitle = value;
    setPages(pageCopy)
  }

  const addPage = (afterPageIndex: number) => {
    const newPage = {
      ...defaultPage,
      rows: [{ ...defaultRow, narration: "BALANCE BROUGHT FORWARD" }]
    };
    const updatedPages = [...pages];
    updatedPages.splice(afterPageIndex + 1, 0, newPage);

    updatePages(updatedPages);
  };

  const removePage = (pageIndex: number) => {
    console.log(pageIndex)
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
      const previousBalance = (page.rows.length > 0 && rowIndex > 0) ? page.rows[rowIndex - 1].balance : 0;
      page.rows.splice(rowIndex + i, 0, { ...defaultRow, balance: previousBalance, date: page.rows[rowIndex-1].date.slice(0,8)});
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
    
    (row[field as keyof IRow] as string | number) =  value;
    page.rows[rowIndex] = row;

    calculatePageTotals(page);
    updatedPages[pageIndex] = page;
    updatePages(updatedPages);
  };

  const calculatePageBalances = useCallback((page: IPage, pageIndex: number) => {
    let previousBalance = 0;

    // Loop through each row to calculate balances
    page.rows.forEach((row, rowIndex) => {
      if (rowIndex === 0 && row.narration === 'BALANCE BROUGHT FORWARD') {
        // Set balance based on the previous page's final balance if it exists
        previousBalance = pages[pageIndex - 1]?.finalBalance || 0;
        row.balance = previousBalance;
      } else {
        // Calculate balance based on credit and debit
        row.balance =
          previousBalance +
          (!isNaN(parseFloat(row.credit)) ? parseFloat(row.credit) : 0) -
          (!isNaN(parseFloat(row.debit)) ? parseFloat(row.debit) : 0);
        previousBalance = row.balance;
      }
    });
  
    // Recalculate totals and final balance for the current page
    calculatePageTotals(page);
    pages[pageIndex] = page;
  
    // Trigger recalculation on subsequent pages that have "BALANCE BROUGHT FORWARD" in the first row
    if (pageIndex < pages.length - 1) {
      const nextPage = pages[pageIndex + 1];
      if (nextPage.rows[0]?.narration === 'BALANCE BROUGHT FORWARD') {
        calculatePageBalances(nextPage, pageIndex + 1);
      }
    }
    return page;
  },[ pages ]);

  // Calculate total credit, debit, and final balance for a page
  const calculatePageTotals = (page: IPage) => {
    let totalCredit = 0;
    let totalDebit = 0;
    let finalBalance = 0;

    page.rows.forEach(row => {
      totalCredit += !isNaN(parseFloat(row.credit as unknown as string)) ? parseFloat(row.credit as unknown as string) : 0;
      totalDebit += !isNaN(parseFloat(row.debit as unknown as string)) ? parseFloat(row.debit as unknown as string) : 0;
      finalBalance = row.balance; // The last row's balance
    });

    page.totalCredit = totalCredit;
    page.totalDebit = totalDebit;
    page.finalBalance = finalBalance;
  };

  // General function to update the pages and manage history for undo/redo
  const updatePages = (updatedPages: IPage[]) => {
    setHistory([...history, pages]); // Save the current state to history
    setFuture([]); // Clear future stack on new action
    setPages(updatedPages);
  };

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

  /** CSV Functionality section */

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
      
    }
  };


  const importCSV = async (file: File) => {
    const text = await file.text();
    const importedPages: IPage[] = [];
    
    const sections = text.split('\n,,,,\n,,,,\n'); // Split pages by the separator in 'downloadAllPagesCSV'
    
    for (const section of sections) {
      const lines = section.trim().split('\n');
      if (lines.length < 4) continue; // Ignore if not enough lines
      
      const title = lines[0];
      const subTitle = lines[1];
      const rowLines = lines.slice(3, lines.length - 1); // Rows are after headers and before totals
      const totalLine = lines[lines.length - 1].split(',');

      const rows: IRow[] = rowLines.map(line => {
        const [date, narration, credit, debit, balance] = line.split(',');
        return {
          date,
          narration,
          credit,
          debit,
          balance: parseFloat(balance) || 0,
        };
      });

      const totalCredit = parseFloat(totalLine[2]) || 0;
      const totalDebit = parseFloat(totalLine[3]) || 0;
      const finalBalance = parseFloat(totalLine[4]) || 0;

      const importedPage: IPage = {
        title,
        subTitle,
        rows,
        totalCredit,
        totalDebit,
        finalBalance,
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
      updatePages(pagesCopy)
    } else {
      const pagesData = convertToPages(csvData);
      setPages(pagesData);
      updatePages(pagesData)
    }   
  };

  function convertToPages(data: string[][]) {
    const pages = [];
    // let currentPage: { title: string, subTitle: string, rows: IRow[], totalCredit: number, totalDebit: number, finalBalance: number} = { title: '', subTitle: '', rows: [], totalCredit: 0, totalDebit: 0, finalBalance: 0 };
    let currentPage: IPage = { title: '', subTitle: '', rows: [], totalCredit: 0, totalDebit: 0, finalBalance: 0, rowsToAdd: 1 };
  
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
  
      // Check for page separator (two arrays of 5 empty strings)
      if (row.length === 5 && row.every(cell => cell === '') && i < data.length - 1 && data[i + 1].every(cell => cell === '')) {
        // Push current page to pages and reset for a new page
        pages.push(currentPage);
        currentPage = { title: '', subTitle: '', rows: [], totalCredit: 0, totalDebit: 0, finalBalance: 0, rowsToAdd: 1 };
        i++; // Skip the second separator row
        continue;
      }
  
      if (currentPage.title === '') {
        currentPage.title = row[0]; // First row is the title
      } else if (currentPage.subTitle === '') {
        currentPage.subTitle = row[0]; // Second row is the subTitle
      } else if (row[0] === '' && row[1] === 'TOTAL') {
        // Parse total row
        currentPage.totalCredit = parseFloat(row[2] || "0");
        currentPage.totalDebit = parseFloat(row[3] || "0");
        currentPage.finalBalance = parseFloat(row[4] || "0");
        currentPage.rowsToAdd = 1
      } else if (row[0] !== 'Date') { // Skip header row
        // Parse row data
        const [date, narration, credit, debit, balance] = row;
        currentPage.rows.push({
          date: date || '',
          narration: narration || '',
          credit: String( parseFloat(credit?.replace(/,/ig,"") || "0")),
          debit: String(parseFloat(debit?.replace(/,/ig,"") || "0")),
          balance: parseFloat(balance || "0"),
        });
      }
    }
  
    // Add the last page if it exists
    if (currentPage.rows.length > 0) {
      pages.push(currentPage);
    }
  
    return pages;
  }

  const downloadPageCSV = (pageIndex: number) => {
    const page = pages[pageIndex];
    const csvData = generateCSVData(page);
    pages[pageIndex].title
    downloadCSV(csvData, pages[pageIndex].title ? `${pages[pageIndex].title}.csv` : `balance_sheet_page_${pageIndex + 1}.csv`);
  };

  const downloadAllPagesCSV = () => {
    const csvData = pages.map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
    downloadCSV(csvData, pages[0]?.title ? `${pages[0]?.title}.csv` : 'balance_sheet_all_pages.csv');
  };

  const generateCSVData = (page: IPage) => {
    const rowsCSV = page.rows
      .map(row => `${row.date},${row.narration},${row.credit},${row.debit},${row.balance}`)
      .join('\n');
    const totalCSV = `,TOTAL,${page.totalCredit},${page.totalDebit},${page.finalBalance}`
    return `${page.title}\n${page.subTitle}\nDate,Narration,Credit,Debit,Balance\n${rowsCSV}\n${totalCSV}`;
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
    handleCSVImport,
    importCSV,
    loadCSVData,
    generateCSVData,
    downloadPageCSV,
    downloadAllPagesCSV,
    handleInputChange,
    updateRowsToAdd,
    setPages,
    updatePages
  };
};