import authSlice from "./auth.slice";
import sharedSlice from "./shared.slice";


const indexSlices =  {
  authReducer: authSlice.reducer, authActions: authSlice.actions, authSlice,
  sharedReducer: sharedSlice.reducer, sharedActions: sharedSlice.actions, sharedSlice
}

export default indexSlices;