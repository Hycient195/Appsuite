import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  navContent: {
    isHidden: boolean,
    content: JSX.Element|React.ReactNode
  },
  sidebar: {
    isHidden: boolean
  },
  mobileSidebar: {
    isHidden: boolean
  },
  notificationModal: {
    isHidden: boolean
  }
} = {
  navContent: {
    isHidden: false,
    content: null
  },
  sidebar: {
    isHidden: false
  },
  mobileSidebar: {
    isHidden: true
  },
  notificationModal: {
    isHidden: true
  }
}

const sharedSlice = createSlice({
  name: "sharedSlice",
  initialState,
  reducers: {
    hideNavContent: (state) => {
      state.navContent.isHidden = true;
    },
    showNavContent: (state) => {
      state.navContent.isHidden = false;
    },
    hideSidebar: (state) => {
      state.sidebar.isHidden = true;
    },
    showSidebar: (state) => {
      state.sidebar.isHidden = false;
    },
    hideMobileSidebar: (state) => {
      state.mobileSidebar.isHidden = true;
    },
    showMobileSidebar: (state) => {
      state.mobileSidebar.isHidden = false;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebar.isHidden = !state.mobileSidebar.isHidden;
    },
    hideNotificationModal: (state) => {
      state.notificationModal.isHidden = true;
    },
    showNotificationModal: (state) => {
      state.notificationModal.isHidden = false;
    },
    toggleNotificationModal: (state) => {
      state.notificationModal.isHidden = !state.notificationModal.isHidden;
    }
  }
});

export default sharedSlice;