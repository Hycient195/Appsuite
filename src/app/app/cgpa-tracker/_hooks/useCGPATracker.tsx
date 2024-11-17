import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Papa from "papaparse";
import { ICGPATrackerConfig, ICGPATrackerPage, ICGPATrackerRow, TGradeScales, TGradeTypes } from '../_types/types';
import { gradeValueMap } from '../_constants/gradeValue';

const defaultRow: ICGPATrackerRow = {
  courseCode: '',
  courseTitle: '',
  unitLoad: "",
  grade: "",
  gradePoint: "",
};

export const defaultPage: ICGPATrackerPage = {
  title: "",
  subTitle: "",
  rows: [{ ...defaultRow }], // Create a fresh copy for each default page
  totalUnitLoad: "0",
  totalGradePoint: "0",
  gradePointAverage: "0",
  cummulativeGradePointAverage: "0",
  cgpaScale: "OVER5",
  rowsToAdd: 1,
  imageUrl: ""
};

export const useCGPATracker = (fileName?: string) => {
  // const [ config, setConfig ] = useState<ICGPATrackerConfig>({ cgpaScale: gradeScale });
  const [pages, setPages] = useState<ICGPATrackerPage[]>([{ ...defaultPage, title: fileName??defaultPage.title, rows: [{ ...defaultRow }] }]);
  const [history, setHistory] = useState<ICGPATrackerPage[][]>([]);
  const [future, setFuture] = useState<ICGPATrackerPage[][]>([]);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [ tempHistoryStack, setTempHistoryStack ] = useState<ICGPATrackerPage[]|null>(null);


  const prevPagesRef = useRef(pages);
  const inputRefs = useRef<Map<string, HTMLInputElement | HTMLTextAreaElement | null>>(new Map());

  const updateImageUrl = (url: string, pageIndex: number) => {
    const pageCopy = [...pages];
    pageCopy[pageIndex].imageUrl = url;
    updatePages(pageCopy);
  };

  const updateCGPAScale = (scale: TGradeScales): void => {
    const pageCopy = [...pages];
    pageCopy[0].cgpaScale = scale;
    setPages(pageCopy);
    updatePages(pageCopy);
  }

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
    console.log(afterPageIndex)
    const newPage = {
      ...defaultPage,
      rows: [{ ...defaultRow }],
      imageUrl: pages[afterPageIndex]?.imageUrl||""
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
        // const previousBalance = (page.rows.length > 0 && rowIndex > 0) ? page.rows[rowIndex - 1].gradePoint : "0";
        page.rows.splice(rowIndex + i, 0, { ...defaultRow });
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
    (row[field as keyof ICGPATrackerRow] as string | number) =  value;
    page.rows[rowIndex] = row;
    calculatePageTotals(page);
    updatedPages[pageIndex] = page;
    updatePages(updatedPages);
  };

  const calculatePageBalances = useCallback((page: ICGPATrackerPage, pageIndex: number) => {

    page.rows.forEach((row) => {
      row.gradePoint = String((Number(row.unitLoad) * gradeValueMap[pages[0].cgpaScale as TGradeScales][row.grade]));
    });
  
    // Recalculate totals and final gradePoint for the current page
    calculatePageTotals(page);
    pages[pageIndex] = page;
  
    // Trigger recalculation on subsequent pages that have "BALANCE BROUGHT FORWARD" in the first row
    if (pageIndex < pages.length - 1) {
      const nextPage = pages[pageIndex + 1];
      if (nextPage.rows[0]?.courseTitle === 'BALANCE BROUGHT FORWARD') {
        calculatePageBalances(nextPage, pageIndex + 1);
      }
    }

    return page;
  },[ pages ]);

  // Calculate total unitLoad, grade, and final gradePoint for a page
  const calculatePageTotals = (page: ICGPATrackerPage) => {
    let totalUnitLoad = 0;
    let totalGradePoint = 0;
    let gradePointAverage = 0;
    let cummulativeGradePointAverage = 0;

    page.rows.forEach(row => {
      totalUnitLoad += !isNaN(Number(row.unitLoad as unknown as string)) ? Number(row.unitLoad?.replace(/,/ig,"") as unknown as string) : 0;
      totalGradePoint += !isNaN(Number(row.gradePoint as unknown as string)) ? Number(row.gradePoint?.replace(/,/ig,"") as unknown as string) : 0;
      gradePointAverage = !isNaN(parseFloat(row.gradePoint as unknown as string)) ? parseFloat(row.gradePoint?.replace(/,/ig,"") as unknown as string) : 0; // The last row's gradePoint
    });

    page.totalUnitLoad = String(totalUnitLoad);
    page.totalGradePoint = String(totalGradePoint);
    page.gradePointAverage = !isNaN((totalGradePoint / totalUnitLoad)) ? String((totalGradePoint / totalUnitLoad)?.toFixed(4)) : "0";

    // const { totalGradePoints, totalUnits } = pages.reduce(
    //   (acc, page) => {
    //     const pageUnitLoad = parseFloat(page.totalUnitLoad) || 0;
    //     const pageGradePoint = parseFloat(page.totalGradePoint) || 0;
  
    //     return {
    //       totalGradePoints: acc.totalGradePoints + pageGradePoint,
    //       totalUnits: acc.totalUnits + pageUnitLoad,
    //     };
    //   },
    //   { totalGradePoints: 0, totalUnits: 0 } // Initial accumulator
    // );
  
    // const cummulativeGPA = totalUnits > 0 ? totalGradePoints / totalUnits : 0;
    // page.cummulativeGradePointAverage = cummulativeGPA.toFixed(4); // Format to two decimal places

    // const calculateCummulativeGPAForPages = (pages: ICGPATrackerPage[]) => {
      let runningTotalGradePoints = 0;
      let runningTotalUnitLoads = 0;
    
      pages.forEach((page) => {
        const pageUnitLoad = parseFloat(page.totalUnitLoad) || 0;
        const pageGradePoint = parseFloat(page.totalGradePoint) || 0;
    
        runningTotalGradePoints += pageGradePoint;
        runningTotalUnitLoads += pageUnitLoad;
    
        const cummulativeGPA = runningTotalUnitLoads > 0 
          ? runningTotalGradePoints / runningTotalUnitLoads 
          : 0;
    
          page.cummulativeGradePointAverage = cummulativeGPA.toFixed(4);
      });
    // };
    
  };

  const updatePages = (updatedPages: ICGPATrackerPage[]) => {
    setPages(updatedPages);
    setHistory([...history, pages]); // Save the current state to history
    setFuture([]); // Clear future stack on new action
  };

  // const updatePages = (updatedPages: ICGPATrackerPage[]) => {
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
    const importedPages: ICGPATrackerPage[] = [];
    
    const sections = text.split('\n,,,,\n,,,,\n'); // Split pages by the separator in 'downloadAllPagesCSV'
    
    for (const section of sections) {
      const lines = section.trim().split('\n');
      if (lines.length < 4) continue; // Ignore if not enough lines
      
      const title = lines[0];
      const subTitle = lines[1];
      const rowLines = lines.slice(3, lines.length - 1); // Rows are after headers and before totals
      const totalLine = lines[lines.length - 3].split(',');
      const gpaLine = lines[lines.length - 2].split(',');
      const cgpaLine = lines[lines.length - 1].split(',');

      const rows: ICGPATrackerRow[] = rowLines.map(line => {
        const [courseCode, courseTitle, unitLoad, grade, gradePoint] = line.split(',');
        return {
          courseCode,
          courseTitle,
          unitLoad,
          grade: grade as TGradeTypes,
          gradePoint: gradePoint || "0",
        };
      });

      const totalUnitLoad = (String(totalLine[2] || 0)) ;
      const totalGradePoint = (String(totalLine[4] || 0));

      const gradePointAverage = (String(gpaLine[4] || 0));

      const cummulativeGradePointAverage = (String(cgpaLine[4] || 0));

      const importedPage: ICGPATrackerPage = {
        title,
        subTitle,
        rows,
        totalUnitLoad,
        totalGradePoint,
        gradePointAverage,
        cummulativeGradePointAverage,
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
      // console.log(pagesData)
      setPages(pagesData);
      // updatePages(pagesData)
    }   
  };

  function convertToPages(data: string[][]) {
    const pages = [];
    // let currentPage: { title: string, subTitle: string, rows: ICGPATrackerRow[], totalUnitLoad: number, totalGradePoint: number, gradePointAverage: number} = { title: '', subTitle: '', rows: [], totalUnitLoad: 0, totalGradePoint: 0, gradePointAverage: 0 };
    let currentPage: ICGPATrackerPage = { title: '', subTitle: '', rows: [], totalUnitLoad: "0", totalGradePoint: "0", gradePointAverage: "0", cummulativeGradePointAverage: "0", rowsToAdd: 1, imageUrl: "" };
  
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
  
      // Check for page separator (two arrays of 5 empty strings)
      if (row.length === 5 && row.every(cell => cell === '') && i < data.length - 1 && data[i + 1].every(cell => cell === '')) {
        // Push current page to pages and reset for a new page
        pages.push(currentPage);
        currentPage = { title: '', subTitle: '', rows: [], totalUnitLoad: "0", totalGradePoint: "0", gradePointAverage: "0", cummulativeGradePointAverage: "0", rowsToAdd: 1, imageUrl: "" };
        i++; // Skip the second separator row
        continue;
      }

      if (["GRADE POINT AVERAGE (GPA)","CUMMULATIVE GRADE POINT AVERAGE (CGPA)"].includes(row[1])) {
        continue;
      }
  
      if (currentPage.title === '') {
        currentPage.title = row[0]; // First row is the title
      } else if (currentPage.subTitle === '') {
        currentPage.subTitle = row[0]; // Second row is the subTitle
      } else if (row[1] === 'TOTAL') {
        console.log(row[i])
        // Parse total row
        currentPage.imageUrl = row[0]||"";
        currentPage.totalUnitLoad = (parseFloat(row[2] || "0"))?.toFixed(2);
        currentPage.cgpaScale = row[3] as TGradeScales;
        currentPage.totalGradePoint = (parseFloat(row[4] || "0"))?.toFixed(2);
        // currentPage.gradePointAverage = (parseFloat(row[4] || "0"))?.toFixed(2);
        currentPage.rowsToAdd = 1
      } else if ((row[0] !== 'Course Code')) { // Skip header row
        // Parse row data
        const [courseCode, courseTitle, unitLoad, grade, gradePoint] = row;

        currentPage.rows.push({
          courseCode: courseCode || '',
          courseTitle: courseTitle || '',
          unitLoad: String( unitLoad || "0"),
          grade: String(grade || "0") as TGradeTypes,
          gradePoint: String(gradePoint || "0")
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
    downloadCSV(csvData, pages[pageIndex].title ? `${pages[pageIndex].title}.csv` : `balance_sheet_page_${pageIndex + 1}.csv`);
  };

  const downloadAllPagesCSV = () => {
    const csvData = pages.map((page) => generateCSVData(page)).join('\n,,,,\n,,,,\n');
    downloadCSV(csvData, pages[0]?.title ? `${pages[0]?.title}.csv` : 'balance_sheet_all_pages.csv');
  };

  const generateCSVData = (page: ICGPATrackerPage) => {
    const rowsCSV = page.rows
      .map(row => `"${row.courseCode}","${row.courseTitle}","${row.unitLoad}","${row.grade}","${row.gradePoint}"`)
      .join('\n');
    const totalCSV = `${page.imageUrl??""},"TOTAL","${page.totalUnitLoad}",${page.cgpaScale},"${page.totalGradePoint}"`
    const gpaCSV = `,"GRADE POINT AVERAGE (GPA)",,,"${page.gradePointAverage}"`
    const cgpaCSV = `,"CUMMULATIVE GRADE POINT AVERAGE (CGPA)",,,${page.cummulativeGradePointAverage}`
    return `"${page.title}",,,,\n"${page.subTitle}",,,,\n"Course Code","Course Title","Unit Load","Grade","Grade Point"\n${rowsCSV}\n${totalCSV}\n${gpaCSV}\n${cgpaCSV}`;
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
    updateCGPAScale,
  };
};