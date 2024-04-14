import { animated as a, useSpring } from "@react-spring/web";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useChatHistory } from "../../../../../../Contexts/ChatHistoryContext";
import { useData } from "../../../../../../Contexts/DataContext";
import { useNotifyInfo } from "../../../../../../Contexts/NotifyInfoContext";
import {
  appendNode,
  deleteNode,
  recreateNode,
  setFocusOnNode,
} from "../../../../../../Contexts/Services";
import { useTrees } from "../../../../../../Contexts/TreeContext";
import { ReactComponent as SUCCESS } from "../../../../../../assets/Icons/Success.svg";
import { ReactComponent as WARNING } from "../../../../../../assets/Icons/Warning.svg";

import ColorNode from "../ColorNode.json";
import "./styles.css";

export default function NodeToolkit({
  node,
  nodePosition,
  handleTooltipEnter,
  handleTooltipLeave,
  tooltipOpen,
  nodeRef,
}) {
  const darkTheme = useSelector((state) => state.darkTheme);

  const treesContext = useTrees();
  const { updateTrees } = treesContext;
  const notifyInfoContext = useNotifyInfo();
  const { notifyInfo } = notifyInfoContext;
  const dataContext = useData();
  const { updateData } = dataContext;
  const chatHistoryContext = useChatHistory();
  const { updateChatHistory } = chatHistoryContext;

  const somefun = () => new Promise((res) => setTimeout(res, 5000));

  const animatedProps = useSpring({
    from: {
      transform: tooltipOpen ? "scale(0, 0)" : "scale(1, 1)",
    },
    transform: tooltipOpen ? "scale(1, 1)" : "scale(0, 0)",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  const handleRecreateClick = async () => {
    toast
      .promise(
        recreateNode(node._id),
        {
          pending: {
            render() {
              return "Waiting for Server ~20 sec.";
            },
            progress: 100,
          },
          success: {
            render() {
              return "Successfully Recreated";
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
      });
  };
  const handleFocusClick = async () => {
    handleTooltipLeave();
    if (node.focus) {
      notifyInfo({
        message: "Already on WeekBan...",
        status: false,
      });
      return;
    }

    node.focus = true;
    nodeRef.style.fill = ColorNode.FOCUS_NODE;

    await setFocusOnNode(node._id).then(async (res) => {
      if (res.status) {
        notifyInfo({
          message: "See ya in WeekBan!",
          status: true,
        });
        // await updateTrees();
        updateData();
      } else {
        notifyInfo({
          message: "Server Error: Please, try again...",
          status: false,
        });
      }
    });
  };
  const handleAppendClick = async () => {
    toast
      .promise(
        appendNode(node.treeId, node._id),
        {
          pending: {
            render() {
              return "Waiting for Server ~20 sec.";
            },
            progress: 100,
          },
          success: {
            render() {
              return "Successfully Appended";
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
      });
  };
  const handleDeleteClick = async () => {
    handleTooltipLeave();
    await deleteNode(node._id).then(async (res) => {
      if (res.status) {
        notifyInfo({
          message: "Successfully Deleted...",
          status: true,
        });
        await updateTrees();
        await updateData();
      } else {
        notifyInfo({
          message: "Server Error: Please, try again...",
          status: false,
        });
      }
    });
  };

  return (
    <a.div
      className="parNodeToolkit"
      style={{
        // visibility: tooltipOpen ? "visible" : "hidden",
        top: `${nodePosition.y}px`,
        left: `${nodePosition.x}px`,
        ...animatedProps,
      }}
      onMouseEnter={() => handleTooltipEnter()}
      // onMouseLeave={() => handleTooltipLeave()}
    >
      <div
        className="NodeToolkit"
        style={{
          backgroundColor: darkTheme ? "#505050" : "#FFF",
          boxShadow: darkTheme
            ? "0px 5px 10px 5px rgba(255, 255, 255, 0.05)"
            : "0px 5px 10px 5px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          className="NodeToolkitTitle"
          style={{
            borderBottom: darkTheme ? "1px solid #FFF" : "1px solid #000",
          }}
        >
          <p
            style={{
              color: darkTheme ? "#FFF" : "#000",
            }}
          >
            {node.nodeTitle}
          </p>
        </div>
        <div className="NodeToolkitBelow">
          <div
            className="NodeToolkilChildren"
            style={{
              boxShadow: darkTheme
                ? "0px -20px 20px -25px rgba(50, 50, 50, 0.5) inset"
                : "0px -20px 20px -25px rgba(189, 189, 189, 0.5) inset",
            }}
          >
            {node.isLeaf && node.taskId
              ? node.taskId.todos.map((child) => (
                  <div className="NodeToolkitChildrenItem">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="8"
                      viewBox="0 0 7 8"
                      fill="none"
                    >
                      <circle
                        cx="3.5"
                        cy="4"
                        r="3.5"
                        fill={
                          child.done
                            ? ColorNode.DONE_NODE
                            : darkTheme
                            ? ColorNode.DEFAULT_LIGHT
                            : ColorNode.DEFAULT_DARK
                        }
                      />
                    </svg>
                    <p
                      style={{
                        color: child.done
                          ? ColorNode.DONE_NODE
                          : darkTheme
                          ? "white"
                          : "#000",
                        textDecoration: child.done ? "line-through" : "",
                      }}
                    >
                      {child.todoTitle}
                    </p>
                  </div>
                ))
              : node.children.map((child) => (
                  <div className="NodeToolkitChildrenItem">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="8"
                      viewBox="0 0 7 8"
                      fill="none"
                    >
                      <circle
                        cx="3.5"
                        cy="4"
                        r="3.5"
                        fill={
                          child.done
                            ? ColorNode.DONE_NODE
                            : darkTheme
                            ? ColorNode.DEFAULT_LIGHT
                            : ColorNode.DEFAULT_DARK
                        }
                      />
                    </svg>
                    <p
                      style={{
                        color: child.done
                          ? ColorNode.DONE_NODE
                          : darkTheme
                          ? "white"
                          : "#000",
                        textDecoration: child.done ? "line-through" : "",
                      }}
                    >
                      {child.nodeTitle}
                    </p>
                  </div>
                ))}
          </div>
          <div className="NodeTolkitButtons">
            {node.isLeaf && (
              <button
                style={{ backgroundColor: "#DF8D41" }}
                onClick={() => handleFocusClick()}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_500_14)">
                    <g clip-path="url(#clip1_500_14)">
                      <line
                        x1="2.3"
                        y1="0.9"
                        x2="2.3"
                        y2="11.1"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <line
                        x1="6.29999"
                        y1="2.9"
                        x2="6.29999"
                        y2="9.1"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <line
                        x1="10.3"
                        y1="4.9"
                        x2="10.3"
                        y2="7.1"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_500_14">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_500_14">
                      <rect
                        width="10.8"
                        height="12"
                        fill="white"
                        transform="translate(0.599998)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            )}
            {node.isLeaf && (
              <button
                style={{ backgroundColor: "#4679C7" }}
                onClick={handleAppendClick}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="5.94724"
                    cy="6.10538"
                    rx="2.10525"
                    ry="2.10526"
                    fill="white"
                  />
                  <ellipse
                    cx="10.3684"
                    cy="1.47368"
                    rx="1.47367"
                    ry="1.47368"
                    fill="white"
                  />
                  <ellipse
                    cx="1.5263"
                    cy="1.68401"
                    rx="1.47367"
                    ry="1.47368"
                    fill="white"
                  />
                  <ellipse
                    cx="1.5263"
                    cy="10.5262"
                    rx="1.47367"
                    ry="1.47368"
                    fill="white"
                  />
                  <ellipse
                    cx="10.3684"
                    cy="10.5262"
                    rx="1.47367"
                    ry="1.47368"
                    fill="white"
                  />
                  <path
                    d="M5.87292 6.03077L10.3388 1.56483"
                    stroke="white"
                    stroke-width="0.210526"
                  />
                  <path
                    d="M5.94732 6.10511L10.4132 10.571"
                    stroke="white"
                    stroke-width="0.210526"
                  />
                  <path
                    d="M5.94732 6.1051L1.48141 10.571"
                    stroke="white"
                    stroke-width="0.210526"
                  />
                  <path
                    d="M5.94733 6.1051L1.48142 1.63916"
                    stroke="white"
                    stroke-width="0.210526"
                  />
                </svg>
                Divide
              </button>
            )}
            {!node.isLeaf && (
              <button
                style={{ backgroundColor: "#39A16F" }}
                onClick={async () => await handleRecreateClick()}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_601_11)">
                    <path
                      d="M4.61278 2.19598C4.81722 2.16278 5.027 2.14595 5.23622 2.14595C5.64831 2.14595 5.98235 1.81191 5.98235 1.39982C5.98235 0.987731 5.64831 0.653687 5.23622 0.653687C4.94713 0.653687 4.65692 0.677003 4.37365 0.723002C3.96689 0.789035 3.69067 1.17232 3.75674 1.57908C3.81621 1.94532 4.13287 2.20572 4.49232 2.20572C4.53205 2.20572 4.5723 2.20255 4.61278 2.19598Z"
                      fill="white"
                    />
                    <path
                      d="M3.05045 9.17495C2.66104 8.90627 2.32748 8.57245 2.05913 8.18267C1.82544 7.84329 1.36086 7.75759 1.02148 7.99125C0.682068 8.22493 0.596337 8.68952 0.830064 9.02893C1.20171 9.56872 1.66368 10.0311 2.20306 10.4032C2.33244 10.4925 2.47999 10.5353 2.62612 10.5353C2.86309 10.5353 3.09618 10.4226 3.2409 10.2128C3.47492 9.87363 3.38964 9.40894 3.05045 9.17495Z"
                      fill="white"
                    />
                    <path
                      d="M1.47454 5.15671C1.57717 4.6965 1.76214 4.26329 2.02422 3.86911C2.25243 3.526 2.15923 3.06283 1.81612 2.83463C1.4729 2.60646 1.00981 2.69962 0.781646 3.04276C0.417607 3.59013 0.160676 4.19211 0.0180153 4.83192C-0.07167 5.23412 0.18168 5.63286 0.583846 5.72258C0.638575 5.73478 0.693155 5.74063 0.746951 5.74063C1.08879 5.74063 1.39706 5.50422 1.47454 5.15671Z"
                      fill="white"
                    />
                    <path
                      d="M11.928 5.61862L10.1567 2.77614C10.0752 2.64542 9.95268 2.57043 9.82046 2.57043C9.68844 2.57043 9.56618 2.6452 9.48493 2.77562L7.71353 5.61869C7.63034 5.75229 7.61873 5.89402 7.68175 6.0075C7.74491 6.12132 7.8719 6.18661 8.03008 6.18661H9.08541C9.08351 6.22627 9.08134 6.26593 9.07825 6.30547C9.0775 6.31487 9.07653 6.32424 9.07575 6.33364C9.07265 6.36986 9.06896 6.40597 9.06485 6.44201C9.06329 6.45582 9.06183 6.46969 9.06012 6.48346C9.0553 6.52189 9.04978 6.56016 9.04385 6.59829C8.80572 8.11996 7.67413 9.34933 6.2044 9.73097C6.17149 9.73948 6.13852 9.74772 6.10531 9.75537C5.82592 9.82002 5.53497 9.8542 5.23622 9.8542C4.82413 9.8542 4.49008 10.1882 4.49008 10.6003C4.49008 11.0124 4.82413 11.3465 5.23622 11.3465C5.62499 11.3465 6.0041 11.3043 6.36952 11.2252C6.37952 11.2234 6.38952 11.2216 6.39951 11.2194C7.03944 11.0773 7.64164 10.8209 8.18938 10.4574C8.20262 10.4486 8.21478 10.4389 8.22728 10.4294C9.41737 9.62319 10.2665 8.35033 10.5105 6.87582C10.5113 6.87138 10.5125 6.86712 10.5132 6.86268C10.5154 6.8494 10.5173 6.83605 10.5193 6.82273C10.5204 6.81564 10.5215 6.80855 10.5226 6.8015C10.5277 6.76718 10.5326 6.73278 10.5371 6.69831C10.5383 6.68891 10.5396 6.67951 10.5407 6.67007C10.5454 6.63295 10.5497 6.59575 10.5535 6.55845C10.5541 6.55352 10.5547 6.54864 10.5552 6.54371C10.5592 6.50338 10.5628 6.46294 10.566 6.42246C10.5671 6.40791 10.568 6.39329 10.5691 6.3787C10.571 6.35181 10.5727 6.32491 10.5742 6.29797C10.5751 6.28182 10.5759 6.26566 10.5766 6.24947C10.5776 6.22851 10.5785 6.20758 10.5792 6.18661H11.6116C11.7697 6.18661 11.8967 6.12132 11.9599 6.0075C12.0229 5.89398 12.0113 5.75225 11.928 5.61862Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_601_11">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Recreate
              </button>
            )}
            <button
              style={{ backgroundColor: "#DF4B41" }}
              onClick={async () => await handleDeleteClick()}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_500_29)">
                  <path
                    d="M9.49999 2.79163V9.79162C9.49999 10.436 8.97768 10.9583 8.33333 10.9583H3.66666C3.02233 10.9583 2.49999 10.436 2.49999 9.79162V2.79163M1.33333 2.79163H10.6667M7.74999 2.79163V2.20829C7.74999 1.56396 7.22768 1.04163 6.58333 1.04163H5.41666C4.77233 1.04163 4.24999 1.56396 4.24999 2.20829V2.79163"
                    stroke="white"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_500_29">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </a.div>
  );
}
