import { getHistory } from "../Services";

const { createContext, useState, useEffect, useContext } = require("react");

const ChatHistoryContext = createContext();

export function useChatHistory() {
  return useContext(ChatHistoryContext);
}

export function ChatHistoryProvider({ children }) {
  const [chatHistory, setChatHistory] = useState([]);

  async function getChatHistory() {
    setChatHistory(await getHistory());
  }
  useEffect(() => {
    getChatHistory();
  }, []);
  // useEffect(() => {
  //   console.log("printing chatHistory:");
  //   console.log(chatHistory);
  // }, [chatHistory]);

  async function updateChatHistory() {
    await getChatHistory();
  }

  const payload = {
    chatHistory: chatHistory,
    updateChatHistory: updateChatHistory,
  };

  return (
    <ChatHistoryContext.Provider value={payload}>
      {children}
    </ChatHistoryContext.Provider>
  );
}
