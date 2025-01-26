import { useEffect, useState, useRef, useLayoutEffect } from "react";

const usePageTracker = (totalPages: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageRefs = useRef<(HTMLDivElement | null)[]>(Array(totalPages).fill(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Is intersecting")
            const pageNumber = Number(entry.target.getAttribute("data-page"));
            setCurrentPage(pageNumber);
          }
        });
      },
      { threshold: 0.5 } // Fires when at least 60% of the page is visible
    );
    
    console.log(currentPage)
    pageRefs.current.forEach((page) => {
      
      if (page) observer.observe(page);
    });

    return () => observer.disconnect();
  }, [totalPages]);

  console.log(pageRefs.current)

  return { currentPage, pageRefs };
};

export default usePageTracker;