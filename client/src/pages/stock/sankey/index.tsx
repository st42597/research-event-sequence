import { useEffect, useState } from "react";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import * as d3 from "d3";

export default function HeatMap() {
  useEffect(() => {
    d3.json("/stock.json").then((data: any) => {
      const graph = {
        nodes: [{ name: "A" }, { name: "B" }, { name: "C" }],
        links: [
          { source: 0, target: 1, value: 20 },
          { source: 1, target: 2, value: 10 },
        ],
      };

      const width = 1000;
      const height = 500;
      let color = d3.scaleOrdinal(d3.schemeTableau10);

      let sankey = d3Sankey()
        .nodeWidth(36)
        .nodePadding(290)
        .size([width, height]);

      sankey.nodes(graph.nodes).links(graph.links);

      const svg = d3
        .select("#sankey-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      var link = svg
        .append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankey.links())
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

      var node = svg
        .append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      node
        .append("rect")
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          return (d.color = color(d.name.replace(/ .*/, "")));
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })
        // Add hover text
        .append("title")
        .text(function (d) {
          return d.name + "\n" + "There is " + d.value + " stuff in this node";
        });

      // add in the title for the nodes
      node
        .append("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
          return d.name;
        })
        .filter(function (d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr(
          "transform",
          "translate(" +
            d.x +
            "," +
            (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
            ")",
        );
        sankey.relayout();
        link.attr("d", sankey.link());
      }
    });
  }, []);

  return (
    <div className="h-full w-full overflow-auto p-8">
      <h1 className="mb-4 text-2xl">Stock Event Sequence - Sankey Diagram</h1>
      <div className="overflow-auto">
        <div id="sankey-container"></div>
      </div>
    </div>
  );
}
