import { useState, useEffect } from 'react';

// Custom hook to manage email input and list with external state sync
export function useManageArrayItem<T> ( stateValue: string[], setStateValue: React.Dispatch<React.SetStateAction<T>>, propertyKey: string, maxLimit: number = 5) {
  const [value, setValue] = useState<string>('');
  const [list, setList] = useState<string[]>(stateValue || []);



  // Sync the list with the external state value whenever stateValue changes
  useEffect(() => {
    setList(stateValue);
  }, [stateValue]);

  // Update the external state when the list changes
  useEffect(() => {
    // Utility function to update a nested property in an object based on a dot-notated path
    const updateNestedState = (obj: T, path: string, value: string[]) => {
      const keys = path.split('.');
      const lastKey = keys.pop();

      // Traverse the object based on the path
      const deepObj = keys.reduce((acc: any, key: string) => {
        if (!acc[key]) acc[key] = {};  // If key does not exist, create it
        return acc[key];
      }, obj);

      // Update the nested property
      if (lastKey) {
        deepObj[lastKey] = value;
      }
      return obj;
    };

    setStateValue((prevState: T) => {
      const updatedState = { ...prevState };
      
      // Use the utility function to update the nested array
      updateNestedState(updatedState, propertyKey, list);
      
      return updatedState;
    });
  }, [ list, setStateValue, propertyKey ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleAddToList = (arg?: string) => {
    console.log(arg)
    // if (list.length >= 5 || !validateEmail(value)) {
    if (list.length >= maxLimit || !(value||arg)) {
      return;
    }
    console.log(arg)
    if (arg) {
      setList([...list, arg]);
    } else {
      setList([...list, value]);
    }
    setValue(''); // Clear input after adding
  };

  const handleRemoveEmail = (index: (number|null), value?: string) => {
    if (!value) {
      setList(list.filter((_, ind) => ind !== index));
    } else {
      setList(list.filter(x => x!== value));
    }
  };

  // const validateEmail = (email: string) => {
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailPattern.test(email);
  // };

  return { value, onChange, handleAddToList, list, handleRemoveEmail };
}
