import { animated as a, useSpring } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CircleLoader from "react-spinners/CircleLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatHistory } from "../../../../../Contexts/ChatHistoryContext";
import { useNotifyInfo } from "../../../../../Contexts/NotifyInfoContext";
import { generateTree } from "../../../../../Contexts/Services";
import { useTrees } from "../../../../../Contexts/TreeContext";
import { ReactComponent as SUCCESS } from "../../../../../assets/Icons/Success.svg";
import { ReactComponent as WARNING } from "../../../../../assets/Icons/Warning.svg";
import ChatDialog from "./ChatDIalog";
import "./styles.css";

const ChatAI = ({ openChat, toggleOpenChat }) => {
  const darkTheme = useSelector((state) => state.darkTheme);

  const treesContext = useTrees();
  const { updateTrees } = treesContext;
  const chatHistoryContext = useChatHistory();
  const { chatHistory, updateChatHistory } = chatHistoryContext;
  const notifyInfoContext = useNotifyInfo();
  const { notifyInfo } = notifyInfoContext;

  // const loading = useRef(false);
  const [loading, setLoading] = useState(false);

  const overflowRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 1000);
  }, [overflowRef]);

  const scrollToBottom = () => {
    const elem = overflowRef.current;
    if (elem) elem.scrollTop = elem.scrollHeight;
  };

  const animatedProps = useSpring({
    from: {
      bottom: openChat ? "-37.75%" : "5%",
    },
    bottom: openChat ? "5%" : "-37.75%",
    config: { mass: 1, tension: 100, friction: 20 },
  });
  const animatedShadow = useSpring({
    from: {
      boxShadow: openChat ? "none" : "0px 10px 20px 10px rgba(0, 0, 0, 0.25)",
    },
    boxShadow: openChat
      ? "0px 10px 20px 10px rgba(0, 0, 0, 0.25)"
      : "0px 0px 0px 0px rgba(0, 0, 0, 0)",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  const handleSubmitRequest = async () => {
    setRequest("");
    let req = request;
    req = req.trim();
    if (req === "") {
      notifyInfo({ message: "Invalid Request...", status: false });
      return;
    }
    setLoading(true);

    toast
      .promise(
        generateTree(req),
        {
          pending: {
            render() {
              return "Generating Tree ~20 sec.";
            },
            progress: 100,
          },
          success: {
            render() {
              return "Successfully Generated";
            },
            icon: <SUCCESS></SUCCESS>,
            autoClose: 2000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: true,
            theme: "light",
          },
          error: {
            render() {
              return "Server Error: Try Again";
            },
            icon: <WARNING></WARNING>,
            autoClose: 2000,
            hideProgressBar: false,
            pauseOnHover: false,
            draggable: true,
            theme: "light",
          },
        },
        {
          position: "top-center",
          progress: 0,
        }
      )
      .then((res) => {
        updateTrees();
        updateChatHistory();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        scrollToBottom();
      });
  };

  const [request, setRequest] = useState("");

  const requestInput = document.getElementById("requestInput");

  requestInput &&
    requestInput.addEventListener("input", (event) => {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    });

  return (
    <>
      <a.div
        className="ChatAI"
        style={{
          ...animatedProps,
        }}
      >
        <button
          className="btn-openChatAI"
          onClick={() => toggleOpenChat()}
          style={{ background: darkTheme ? "#EAEAEA" : "#2F2F2F" }}
        >
          <svg
            style={{
              scale: openChat ? "1" : "-1",
            }}
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.95752 1.36621L5 5.76619L1.04248 1.36621"
              stroke={darkTheme ? "black" : "white"}
              stroke-width="0.819362"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.95752 4.23401L5 8.63398L1.04248 4.23401"
              stroke={darkTheme ? "black" : "white"}
              stroke-width="0.819362"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <a.div
          className="ChatWindow"
          // style={{ ...animatedShadow }} // revealing animation with drop shadow
          style={{ background: darkTheme ? "#252525" : "#FFF" }}
        >
          <div ref={overflowRef} className="ChatHistory">
            {chatHistory &&
              chatHistory.map((dialog) => (
                <ChatDialog
                  request={dialog.request}
                  response={dialog.response}
                ></ChatDialog>
              ))}
          </div>
          <div
            className="ChatRequest"
            style={{ background: darkTheme ? "#252525" : "#FFF" }}
          >
            <input
              id="requestInput"
              style={{
                caretColor: loading
                  ? "transparent"
                  : darkTheme
                  ? "white"
                  : "black",
                color: darkTheme ? "white" : "",
              }}
              placeholder={
                loading
                  ? "Waiting a little bit..."
                  : "Describe what you need..."
              }
              value={loading ? "" : request}
              onKeyDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                setRequest(e.target.value);
              }}
            />

            <div style={{ backgroundColor: "transparent" }}>
              {loading ? (
                <div style={{ paddingLeft: "2px" }}>
                  <CircleLoader
                    loading={loading}
                    color={darkTheme ? "#EAEAEA" : "#292D32"}
                    size={15}
                  ></CircleLoader>
                </div>
              ) : (
                <svg
                  onClick={handleSubmitRequest}
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.0085 1.66663H13.9918C17.0252 1.66663 18.8335 3.47496 18.8335 6.50829V13.4833C18.8335 16.525 17.0252 18.3333 13.9918 18.3333H7.01683C3.9835 18.3333 2.17516 16.525 2.17516 13.4916V6.50829C2.16683 3.47496 3.97516 1.66663 7.0085 1.66663ZM13.4418 7.48329L10.9418 4.98329C10.8835 4.92496 10.8168 4.88329 10.7418 4.84996C10.5918 4.78329 10.4168 4.78329 10.2668 4.84996C10.1918 4.88329 10.1252 4.92496 10.0668 4.98329L7.56683 7.48329C7.32516 7.72496 7.32516 8.12496 7.56683 8.36663C7.69183 8.49163 7.85016 8.54996 8.0085 8.54996C8.16683 8.54996 8.32516 8.49163 8.45016 8.36663L9.8835 6.93329V12.0916C9.8835 12.4333 10.1668 12.7166 10.5085 12.7166C10.8502 12.7166 11.1335 12.4333 11.1335 12.0916V6.93329L12.5668 8.36663C12.8085 8.60829 13.2085 8.60829 13.4502 8.36663C13.6918 8.12496 13.6835 7.73329 13.4418 7.48329ZM5.30016 14.35C6.97516 14.9083 8.7335 15.1916 10.5002 15.1916C12.2668 15.1916 14.0252 14.9083 15.7002 14.35C16.0252 14.2416 16.2002 13.8833 16.0918 13.5583C15.9835 13.2333 15.6252 13.05 15.3002 13.1666C12.2002 14.2 8.79183 14.2 5.69183 13.1666C5.36683 13.0583 5.0085 13.2333 4.90016 13.5583C4.80016 13.8916 4.97516 14.2416 5.30016 14.35Z"
                    fill={darkTheme ? "#EAEAEA" : "#292D32"}
                  />
                </svg>
              )}
            </div>
          </div>
        </a.div>
      </a.div>
    </>
  );
};

export default React.memo(ChatAI);
