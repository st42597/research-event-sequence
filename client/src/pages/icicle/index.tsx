import { useEffect } from "react";
import * as d3 from "d3";

export default function IciclePlot() {
  const width = 800;
  const height = 600;
  useEffect(() => {
    const data: { ID: number; time: string } | {} = {};
    d3.csv("./events.csv").then((d: any) => {
      if (d.Venue in data) {
        data[d.Venue].push({
          ID: d.ID,
          time: d.time,
        });
      } else {
        data[d.Venue] = [
          {
            ID: d.ID,
            time: d.time,
          },
        ];
      }
    });

    /*
    const dataList = [];
    dataList.sort((a, b) => a.data.length - b.data.length);
    console.log(dataList);
    */
    /*
    const svg = d3
      .select("#icicle-plot")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const partition = d3.partition().size([width, height]).padding(1);

    const root: any = d3.hierarchy(data).sum((d: any) => d.size);

    partition(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
      .selectAll("rect")
      .data(root.descendants())
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => color(d.depth))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    function handleMouseOver(d) {
      // Handle mouseover event
    }

    function handleMouseOut(d) {
      // Handle mouseout event
    }
    */
  }, []);
  return <div id="icicle-plot"></div>;
}
