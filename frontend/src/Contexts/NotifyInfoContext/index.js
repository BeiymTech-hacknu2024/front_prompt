import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ReactComponent as SUCCESS } from "../../assets/Icons/Success.svg";
import { ReactComponent as WARNING } from "../../assets/Icons/Warning.svg";

const notifyInfoContext = createContext();

export function useNotifyInfo() {
  return useContext(notifyInfoContext);
}

export function NotifyInfoProvider({ children }) {
  const notifyInfo = ({ message, status }) => {
    toast.warning(message, {
      icon: status ? <SUCCESS></SUCCESS> : <WARNING></WARNING>,
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light",
    });
  };

  const payload = {
    notifyInfo: notifyInfo,
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <notifyInfoContext.Provider value={payload}>
        {children}
      </notifyInfoContext.Provider>
    </>
  );
}
