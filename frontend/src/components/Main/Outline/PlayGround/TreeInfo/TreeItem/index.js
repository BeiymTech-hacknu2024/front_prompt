import React from "react";
import { useSelector } from "react-redux";
import ColorNode from "../../TreeLayout/ColorNode.json";
import "./styles.css";

export default function TreeItem({ node, depth }) {
  const darkTheme = useSelector((state) => state.darkTheme);
  const marginLeft = `${depth * 0}px`;
  const ItemColor = node.active
    ? ColorNode.ACTIVE_NODE
    : node.done
    ? ColorNode.DONE_NODE
    : node.focus
    ? ColorNode.FOCUS_NODE
    : node.isLeaf
    ? ColorNode.LEAF_NODE
    : darkTheme
    ? "white"
    : "black";

  return (
    <>
      <div
        className="TreeItem"
        style={{
          marginLeft: marginLeft,
          textDecorationLine: node.done ? "strikethrough" : "none",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
        >
          <circle cx="4.25" cy="4.5" r="4.25" fill={ItemColor} />
        </svg>
        <p
          style={{
            color: ItemColor,
            textDecoration: node.done ? "line-through" : "",
          }}
        >
          {node.nodeTitle}
        </p>
      </div>
      {node.children.length > 0 && (
        <ul className="TreeItemChildren">
          {node.children.map((childNode) => (
            <TreeItem key={childNode._id} node={childNode} depth={depth + 1} />
          ))}
        </ul>
      )}
    </>
  );
}
