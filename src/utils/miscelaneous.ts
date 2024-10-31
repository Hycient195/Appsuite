import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent } from "react";

export const currencyMap = {
  NGN: "₦",
  USD: "$"
};

export function handleInputChange<T>(
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement  | any> | SelectChangeEvent<number|string>,
  formData: T,
  setFormData: React.Dispatch<React.SetStateAction<T>>
): void {
  const { name, type, checked, value } = e.target;

  // Determine the value based on the input type (checkboxes use `checked`, others use `value`)
  const inputValue = (type === 'checkbox') ? checked : value;

  // Helper function to set nested value
  const setNestedValue = (obj: any, path: string[], value: any): any => {
    const [first, ...rest] = path;

    if (rest.length === 0) {
      // Set the value once the end of the path is reached
      obj[first] = value;
    } else {
      // Handle array indices in path like "emails[0]"
      const arrayMatch = first.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, key, index] = arrayMatch;
        obj[key][Number(index)] = setNestedValue(obj[key][Number(index)], rest, value);
      } else {
        // Recursively set the value for nested paths
        obj[first] = setNestedValue(obj[first] || {}, rest, value);
      }
    }

    return obj;
  };

  // Split the name by dots to handle nested paths
  const path = name.split('.');

  // Create a new copy of formData and modify the specific nested property
  const newFormData = { ...formData };
  setNestedValue(newFormData, path, inputValue);

  // Update state
  setFormData(newFormData);
}

export function handleUpdateStateProperty<T>(formData: T, setFormData: React.Dispatch<React.SetStateAction<T>>, value: any, propertyKey: string): void {
  const setNestedValue = (obj: any, path: string[], value: any): any => {
    const [first, ...rest] = path;

    if (rest.length === 0) {
      obj[first] = value;
    } else {
      const arrayMatch = first.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, key, index] = arrayMatch;
        obj[key][Number(index)] = setNestedValue(obj[key][Number(index)], rest, value);
      } else {
        obj[first] = setNestedValue(obj[first] || {}, rest, value);
      }
    }

    return obj;
  };

  if (propertyKey === "") {
    // If propertyKey is empty, update the root object entirely
    setFormData(value); 
  } else {
    const path = propertyKey.split('.');
    const newFormData = { ...formData };
    setNestedValue(newFormData, path, value);

    setFormData(newFormData);
  }
}

export const splitInThousand = (num: string | number) => {
  const numStr = typeof num === "number" ? num?.toString() : num;
  const integerPart = numStr?.includes(".") ? numStr?.split(".")?.[0] : numStr;
  const decimalPart = numStr?.includes(".") ?  numStr?.split(".")?.[1] : "";
  const addCommas = (num: string) => num?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formattedInteger = addCommas(integerPart)??"";

  if (numStr && formattedInteger !== "undefined") {
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  } else {
    return ""
  }
};

export const convertToMinutes = (seconds?: number): string => {
  const minutes = Math.floor(seconds as number / 60);
  const remainingSeconds = seconds as number % 60;
  if (seconds) {
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
  } else {
    if (seconds === 0) {
      return `0:00`
    } else {
      return "";
    }
  }
};

export const gaugeDueDate = (
  dueDate: string | Date,
  startDate: string | Date
): { percentage: number, color: string } => {
  const currentDate = new Date();
  const parsedDueDate = new Date(dueDate);
  const parsedStartDate = new Date(startDate);

  if (isNaN(parsedDueDate.getTime()) || isNaN(parsedStartDate.getTime())) {
    throw new Error("Invalid date format");
  }

  // Calculate the total time duration between startDate and dueDate in milliseconds
  const totalDuration = parsedDueDate.getTime() - parsedStartDate.getTime();

  // If due date is in the past or startDate is after dueDate, return 100% red
  if (totalDuration <= 0 || currentDate.getTime() > parsedDueDate.getTime()) {
    return { percentage: 100, color: "rgba(255, 0, 0, 0.5)" }; // Full red with 0.2 alpha
  }

  // Calculate the time elapsed between startDate and the current date
  const elapsedDuration = currentDate.getTime() - parsedStartDate.getTime();

  // If the current date is before the start date, return 0% green
  if (elapsedDuration <= 0) {
    return { percentage: 0, color: "rgba(0, 255, 0, 0.2)" }; // Full green with 0.2 alpha
  }

  // Calculate the percentage of elapsed time relative to the total time between start and due dates
  const percentage = Math.min((elapsedDuration / totalDuration) * 100, 100);

  // Function to interpolate between two colors based on a percentage (0 -> 1)
  const interpolateColor = (
    startColor: [number, number, number],
    endColor: [number, number, number],
    t: number
  ) => {
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);
    return `rgba(${r}, ${g}, ${b}, 0.15)`; // Add alpha of 0.2
  };

  // Colors for green, yellow, and red (in RGB)
  const green: [number, number, number] = [0, 255, 0];
  const yellow: [number, number, number] = [255, 255, 0];
  const red: [number, number, number] = [255, 0, 0];

  // Interpolate between green (0%) to yellow (50%) to red (100%)
  let color: string;
  if (percentage <= 50) {
    // Interpolate between green and yellow
    color = interpolateColor(green, yellow, percentage / 50);
  } else {
    // Interpolate between yellow and red
    color = interpolateColor(yellow, red, (percentage - 50) / 50);
  }

  return { percentage, color };
};

export const formatDateInput = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  // const cleaned = value.replace(/[^\d-]/g, '');

  const year = cleaned.slice(0, 4);
  const month = cleaned.slice(4, 6);
  const day = cleaned.slice(6, 8);

  if (cleaned.length <= 4) return year;
  if (cleaned.length <= 6) return `${year}-${month}`;
  return `${year}-${month}-${day}`;
};

export function parseCSV(data: string): string[][] {
  const rows = data.split("\n");
  const result: string[][] = [];

  rows.forEach((row) => {
    const cells: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      // Toggle the insideQuotes flag if we encounter a quote
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        // If we encounter a comma and we're not inside quotes, end the current cell
        cells.push(currentCell.trim());
        currentCell = "";
      } else {
        // Append the character to the current cell
        currentCell += char;
      }
    }

    // Push the final cell in the row
    if (currentCell) {
      cells.push(currentCell.trim());
    }

    // Add the parsed row to the result array
    result.push(cells);
  });

  return result;
}
