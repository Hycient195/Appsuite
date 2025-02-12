"use client"

import store from "@/redux/store/store";
import ToastProvider from "@/sharedComponents/utilities/ToastContainer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Provider } from "react-redux";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface IProps {
  children: React.ReactNode
};

export default function ReduxProvider ({ children }: IProps) {
  return (
    <Provider store={store}>
      <ToastProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          {children}
        </LocalizationProvider>
      </ToastProvider>
    </Provider>
  )
}


// import api from "@redux/api"; // Your RTK Query API
// import { store } from "@redux/store/store";
// import { Provider } from "react-redux";

// export default function ReduxProvider({ children }: { children: React.ReactNode|JSX.Element }) {


//   return (
//     <Provider store={store}>
//       {children}
//     </Provider>
//   );
// }
