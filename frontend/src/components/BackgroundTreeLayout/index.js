import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import Color from "./Color.json";
import data from "./data.json";
import "./styles.css";

const BackgroundTreeLayout = () => {
  const svgRef = useRef(null);

  const screenRes = JSON.parse(localStorage.getItem("screenRes"));
  const WIDTH = screenRes.width;
  const HEIGHT = screenRes.height;

  const nodeRadius = 20;
  const strokeColor = "lightgray";

  const randomColor = () => {
    const indColor = Math.floor(Math.random() * 6);
    return Color[indColor];
  };

  // Displaying Grid
  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    svgContainer.attr("width", WIDTH).attr("height", HEIGHT);

    // Add background grid
    const gridSize = 50;
    const numHorizontalLines = Math.ceil(HEIGHT / gridSize);
    const numVerticalLines = Math.ceil(WIDTH / gridSize);
    const verticalLineX = d3.range(-gridSize, WIDTH + gridSize, gridSize); // Extend beyond the left and right boundaries
    const horizontalLineY = d3.range(-gridSize, HEIGHT + gridSize, gridSize);

    svgContainer
      .selectAll(".vertical-lineSmall")
      .data(verticalLineX)
      .enter()
      .append("line")
      .attr("class", "vertical-lineSmall")
      .attr("x1", (d) => d)
      .attr("y1", 0)
      .attr("x2", (d) => d)
      .attr("y2", HEIGHT)
      .style("stroke", (d) => (d === 0 || d === WIDTH ? "none" : strokeColor))
      .style("stroke-width", 1);

    svgContainer
      .selectAll(".horizontal-lineSmall")
      .data(horizontalLineY)
      .enter()
      .append("line")
      .attr("class", "horizontal-lineSmall")
      .attr("x1", 0)
      .attr("y1", (d) => d)
      .attr("x2", WIDTH)
      .attr("y2", (d) => d)
      .style("stroke", (d) => (d === 0 || d === HEIGHT ? "none" : strokeColor))
      .style("stroke-width", 1);
  }, []);

  //Displaying Trees
  useEffect(() => {
    const svgContainer = d3.select(svgRef.current);
    svgContainer.selectAll(".tree").remove();

    data.forEach((tree) => {
      const { nodes, links } = tree;

      // Create a group for the current tree
      const treeGroup = svgContainer.append("g").attr("class", "tree");

      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-300))
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(100)
        )
        .force(
          "center",
          d3.forceCenter(WIDTH * Math.random(), HEIGHT * Math.random())
        )
        .alphaTarget(0.7);

      const linkElements = treeGroup
        .selectAll(".linkSmall")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "linkSmall")
        .style("stroke", "gray")
        .style("stroke-width", 3);

      const nodeElements = treeGroup
        .selectAll(".nodeSmall")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "nodeSmall")
        .attr("r", nodeRadius)
        .style("fill", () => randomColor());

      simulation.on("tick", () => {
        linkElements
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });
    });
  }, [data, WIDTH, HEIGHT]);

  return (
    <>
      <div className="BackgroundTreeLayout-Blur"></div>
      <svg
        style={{ position: "absolute", overflow: "hidden", height: "100vh" }}
        ref={svgRef}
      ></svg>
    </>
  );
};

export default React.memo(BackgroundTreeLayout);
