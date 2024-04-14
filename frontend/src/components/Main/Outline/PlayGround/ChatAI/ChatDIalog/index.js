import React from "react";
import ChatItem from "./ChatItem";
import "./styles.css";

export default function ChatDialog({ request, response }) {
  return (
    <div className="ChatDialog">
      <ChatItem user={true} message={request}></ChatItem>
      <ChatItem user={false} message={response}></ChatItem>
    </div>
  );
}
