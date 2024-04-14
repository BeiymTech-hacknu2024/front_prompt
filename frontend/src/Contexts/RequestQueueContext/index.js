import { useChatHistory } from "../ChatHistoryContext";
import { useTrees } from "../TreeContext";

const {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} = require("react");

const requestQueueContext = createContext();

export function useRequestQueue() {
  return useContext(requestQueueContext);
}

export function RequestQueueProvider({ children }) {
  const treesContext = useTrees();
  const { updateTrees } = treesContext;
  const chatHistoryContext = useChatHistory();
  const { chatHistory, updateChatHistory } = chatHistoryContext;

  const [loading, setLoading] = useState(false);
  const overflowRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    const elem = overflowRef.current;
    if (elem) elem.scrollTop = elem.scrollHeight;
  };

  const handleSubmitRequest = async (req) => {
    setLoading(true);
    // await generateTree(req);
    // await updateTrees();
    // await updateChatHistory();
    // setLoading(false);
    // scrollToBottom();
  };

  const payload = {
    handleSubmitRequest: handleSubmitRequest,
    loading: loading,
    chatHistory: chatHistory,
    overflowRef: overflowRef,
  };
  return (
    <requestQueueContext.Provider value={payload}>
      {children}
    </requestQueueContext.Provider>
  );
}
