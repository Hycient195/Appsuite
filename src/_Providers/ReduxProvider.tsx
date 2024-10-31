"use client"

import store from "@/redux/store/store";
import { Provider } from "react-redux";

interface IProps {
  children: React.ReactNode
};

export default function ReduxProvider ({ children }: IProps) {
  return (
    <Provider store={store}>
      {children}
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
