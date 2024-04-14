import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { DataProvider } from "../../Contexts/DataContext";
import { ModalProvider } from "../../Contexts/OpenModalContext";
import { TreesProvider } from "../../Contexts/TreeContext";
import store from "../../store/store";
import Outline from "./Outline";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  const [isAuthorised, setIsAuthrorised] = React.useState(false);

  useEffect(() => {
    const actoken = sessionStorage.getItem("actoken");
    if (actoken == null) {
      navigate("/login");
    }
    setIsAuthrorised(true);
  }, []);

  return (
    isAuthorised && (
      <Provider store={store}>
        <TreesProvider>
          <DataProvider>
            <ModalProvider>
              <Outline></Outline>
            </ModalProvider>
          </DataProvider>
        </TreesProvider>
      </Provider>
    )
  );
}
