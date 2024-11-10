import { useState, useRef, useEffect } from 'react';

// export function useCancelableDebounce(callback: any, delay: number) {
//   const [args, setArgs] = useState<any[]>([]); // Store arguments to use for the latest invocation
//   const timerRef = useRef<NodeJS.Timeout|null>(null); // Reference for the timeout timer

//   // Function to be called when the debounced method is invoked
//   const debouncedFunction = (...params: any[]) => {
//     // Store the latest arguments for the callback
//     setArgs(params);

//     // Clear any pending execution if the function is called again within the delay period
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     // Set a new timer to call the callback after the delay
//     timerRef.current = setTimeout(() => {
//       callback(...params);
//       timerRef.current = null; // Reset timer reference after execution
//     }, delay);
//   };

//   // Clean up timer when the component using this hook is unmounted
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, []);

//   return debouncedFunction;
// }

export function useCancelableDebounce<T extends (...args: any[]) => void> (func: T, timeInMs: number) {
  let timeout: NodeJS.Timeout|null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(this, args);
      if (timeout) clearTimeout(timeout);
    }, timeInMs);
  }
}