import { configureStore } from "@reduxjs/toolkit";
import api from "@/redux/api";
import slices from "@/redux/slices";

const store = configureStore({
  reducer: {
    /* Auth */
    [ api.authApis.reducerPath ]: api.authApis.reducer,
    [ api.commonApis.reducerPath ]: api.commonApis.reducer,
    [ slices.authSlice.reducerPath ]: slices.authReducer,

    /* Shared */
    [ slices.sharedSlice.reducerPath ]: slices.sharedReducer,



  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare()
     /* Auth */
    .concat(api.authApis.middleware)
    .concat(api.commonApis.middleware)
})

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
