import { useEffect } from "react";
import { IGlobalInvoice } from "../_types/types";

function resetUnusedPropertiesToDefault(
  obj: any,
  template: any,
  defaultValues: any
) {
  // Helper function to determine if a value is an object
  const isObject = (val: any) => val && typeof val === "object" && !Array.isArray(val);

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(template, key)) {
      // If the property does not exist in the template, reset it to its default value
      obj[key] = defaultValues[key];
    } else if (isObject(obj[key]) && isObject(template[key])) {
      // If the property is a nested object, recurse
      resetUnusedPropertiesToDefault(obj[key], template[key], defaultValues[key]);
    } else if (Array.isArray(obj[key]) && Array.isArray(template[key])) {
      // If the property is an array, handle each element
      obj[key].forEach((item: any, index: number) => {
        if (isObject(item) && template[key][index]) {
          resetUnusedPropertiesToDefault(item, template[key][index], defaultValues[key]?.[index]);
        } else if (!template[key][index]) {
          obj[key][index] = defaultValues[key]?.[index] || null;
        }
      });
    }
  }
}

export function useTemplateDefaults(
  stateObject: IGlobalInvoice,
  setStateObject: React.Dispatch<React.SetStateAction<IGlobalInvoice>>,
  template: Partial<IGlobalInvoice>,
  defaultValues: IGlobalInvoice
) {
  useEffect(() => {
    const updatedState = JSON.parse(JSON.stringify(stateObject)); // Deep clone to avoid mutations
    resetUnusedPropertiesToDefault(updatedState, template, defaultValues);
    setStateObject(updatedState);
  }, [template, defaultValues, stateObject, setStateObject]);
}