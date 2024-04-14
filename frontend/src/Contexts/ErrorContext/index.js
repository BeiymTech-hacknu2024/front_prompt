import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();
const ErrorUpdateContext = createContext();
export function useError() {
  return useContext(ErrorContext);
}

export function useErrorUpdate() {
  return useContext(ErrorUpdateContext);
}

export function ErrorProvider({ children }) {
  const [errMes, setErrMes] = useState();

  function toggleErrMes(mes) {
    setErrMes(mes);
  }

  return (
    <ErrorContext.Provider value={errMes}>
      <ErrorUpdateContext value={toggleErrMes}>{children}</ErrorUpdateContext>
    </ErrorContext.Provider>
  );
}
