import React, { useState } from "react";
import ChatAI from "./ChatAI";
import TreeLayout from "./TreeLayout";
import "./styles.css";

const PlayGround = React.memo(() => {
  const [openChat, setOpenChat] = useState(false);
  const toggleOpenChat = () => {
    setOpenChat(!openChat);
  };

  const [activeTree, setActiveTree] = useState(null);

  const [openTreeInfo, setOpenTreeInfo] = useState({
    prev: false,
    cur: false,
  });
  const toggleOpenTreeInfo = (tree) => {
    const now = {
      prev: openTreeInfo.cur,
      cur: true,
    };
    setActiveTree(tree);
    setOpenTreeInfo(now);
  };
  const outsideToggleOpenTreeInfo = () => {
    const now = {
      prev: openTreeInfo.cur,
      cur: false,
    };
    setOpenTreeInfo(now);
  };

  return (
    <div className="PlayGround">
      <ChatAI openChat={openChat} toggleOpenChat={toggleOpenChat}></ChatAI>
      <TreeLayout
        toggleOpenTreeInfo={toggleOpenTreeInfo}
        outsideToggleOpenTreeInfo={outsideToggleOpenTreeInfo}
      ></TreeLayout>
    </div>
  );
});

export default PlayGround;
