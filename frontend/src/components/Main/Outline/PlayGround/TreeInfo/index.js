import { animated as a, useSpring } from "@react-spring/web";
import React from "react";
import { useSelector } from "react-redux";
import TreeItem from "./TreeItem";
import "./styles.css";

function TreeInfo({ openTreeInfo, activeTree }) {
  const darkTheme = useSelector((state) => state.darkTheme);

  // activeTree && console.log("Updated activeTree.treeId: " + activeTree.treeId);
  const animatedProps = useSpring({
    from: {
      right: openTreeInfo.prev ? "1%" : "-35%",
    },
    right: openTreeInfo.cur ? "1%" : "-35%",
    config: { mass: 1, tension: 100, friction: 20 },
  });

  return (
    <a.div
      style={{
        ...animatedProps,
        backgroundColor: darkTheme ? "#252525" : "#FFF",
        boxShadow: darkTheme
          ? "0px 0px 30px 3px rgba(255, 255, 255, 0.05)"
          : "0px 0px 20px 5px rgba(0, 0, 0, 0.25)",
      }}
      className="TreeInfo"
    >
      <div
        className="RootHolder"
        style={{
          borderBottom: darkTheme ? "1px solid #FFF" : "1px solid #000",
        }}
      >
        <p style={{ color: darkTheme ? "white" : "#000" }}>
          {activeTree && activeTree.tree.nodeTitle}
        </p>
      </div>
      <div className="TreeStructure">
        {activeTree && (
          <ul
            style={{ margin: "0px", paddingLeft: "0px" }}
            className="TreeItemChildren"
          >
            {activeTree.tree.children.map((node) => (
              <TreeItem node={node} depth={0}></TreeItem>
            ))}
          </ul>
        )}
      </div>
    </a.div>
  );
}

export default React.memo(TreeInfo);
