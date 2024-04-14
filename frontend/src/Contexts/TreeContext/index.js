import { createContext, useContext, useEffect, useState } from "react";
import { treesPull } from "../Services";

const treesContext = createContext();

export function useTrees() {
  return useContext(treesContext);
}

export function TreesProvider({ children }) {
  const [resTrees, setResTrees] = useState();
  const [trees, setTrees] = useState([]);

  function depth_first_search(curNode, nodesArr, linksArr) {
    // const { children, ...withoutChildrenCurNode } = curNode;
    // withoutChildrenCurNode.fx = null;
    // withoutChildrenCurNode.fy = null;
    // nodesArr.push(withoutChildrenCurNode);

    // For without children just comment below code and uncomment above code
    curNode.fx = null;
    curNode.fy = null;
    nodesArr.push(curNode);

    for (let childInd in curNode.children) {
      const child = curNode.children[childInd];
      linksArr.push({
        source: curNode._id,
        target: child._id,
      });
      depth_first_search(child, nodesArr, linksArr);
    }
  }

  async function getTrees() {
    setResTrees(await treesPull());
  }

  useEffect(() => {
    getTrees();
  }, []);

  useEffect(() => {
    let copyTrees = [];
    for (let treeInd in resTrees) {
      const tree = resTrees[treeInd];
      const nodes = [],
        links = [];

      depth_first_search(tree.tree, nodes, links);
      copyTrees.push({
        treeId: tree.treeId,
        nodes: nodes,
        links: links,
      });
    }
    setTrees(copyTrees);
  }, [resTrees]);

  const updateTrees = async () => {
    await getTrees();
  };

  const payload = {
    trees: trees,
    updateTrees: updateTrees,
    resTrees: resTrees,
  };

  return (
    <treesContext.Provider value={payload}>{children}</treesContext.Provider>
  );
}
