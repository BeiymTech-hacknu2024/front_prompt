import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatHistoryProvider } from "../../../Contexts/ChatHistoryContext";
import { NotifyInfoProvider } from "../../../Contexts/NotifyInfoContext";
import PlayGround from "./PlayGround";
import "./styles.css";

export const PageContext = createContext();

export default function Outline() {
  const darkTheme = useSelector((state) => state.darkTheme);
  const [page, setPage] = useState();

  const [openChat, setOpenChat] = useState(false);
  const toggleOpenChat = () => {
    setOpenChat(!openChat);
  };

  function togglePage(val) {
    setPage(val);
    localStorage.setItem("page", JSON.stringify(val));
  }

  useEffect(() => {
    const pageLocal = localStorage.getItem("page");
    if (pageLocal !== null) setPage(JSON.parse(pageLocal));
    else setPage("PlayGround");
  }, []);

  return (
    <div
      className="Outline easeTransition"
      style={{
        backgroundColor: darkTheme ? "#181818" : "#EAEAEA",
      }}
    >
      {/* background color */}
      <ChatHistoryProvider>
        <NotifyInfoProvider>
          {page === "PlayGround" && <PlayGround></PlayGround>}
        </NotifyInfoProvider>
      </ChatHistoryProvider>
    </div>
  );
}
