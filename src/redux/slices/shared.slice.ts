import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  navContent: {
    isHidden: boolean,
    content: JSX.Element|React.ReactNode
  },
  sidebar: {
    isHidden: boolean,
    isHalfVisible: boolean
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
    isHidden: false,
    isHalfVisible: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("isSidebarhalfVisible") as string || "false" ) : false
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
      state.sidebar.isHalfVisible = false,
      localStorage.setItem("isSidebarhalfVisible", "false");
    },
    peekSidebar: (state) => {
      state.sidebar.isHidden = false;
      state.sidebar.isHalfVisible = true;
      localStorage.setItem("isSidebarhalfVisible", "true");
    },
    toggleSidebarPeek: (state) => {
      state.sidebar.isHidden = false;
      state.sidebar.isHalfVisible = !state.sidebar.isHalfVisible;
      localStorage.setItem("isSidebarhalfVisible", JSON.stringify(state.sidebar.isHalfVisible));
    },
    hideMobileSidebar: (state) => {
      state.mobileSidebar.isHidden = true;
    },
    showMobileSidebar: (state) => {
      state.mobileSidebar.isHidden = false;
      state.sidebar.isHalfVisible = false;
      localStorage.setItem("isSidebarhalfVisible", "false");
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