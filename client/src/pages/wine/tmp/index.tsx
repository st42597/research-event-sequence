import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function SentenceVis() {
  const [label, setLabel] = useState([]);
  const canvas = useRef(null);


  useEffect(() => {
    let _label: any = [];
    const loadData = async () => {
      const json: any = await d3.json("/wine.json");

      _label = json[0];
      const data = json[1];

      const numCol = 12;
      const numRow = data.length;
      const rectHeight = [0.13, 0.2, 0.3, 0.4][1];
      const width = 1920;
      const height = rectHeight * numRow;

      const svg = d3
        .select(canvas.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain([...Array(numCol).keys()]);
      const yScale = d3
        .scaleBand()
        .range([0, height])
        .domain([...Array(numRow).keys()]);
      svg
        .selectAll()
        .data(data)
        .join("g")
        .attr("transform", (d: any, i: number) => `translate(0, ${yScale(i)!})`)
        .selectAll("g")
        .data((d: any) => d)
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", rectHeight)
        .attr("x", (d: any, i: number) => xScale(i))
        .attr("fill", (d: any, i: number) => d);
    };

    loadData().then(() => {
      setLabel(_label);
    });
  }, []);


  return (
    <>
      <div ref={canvas}></div>
      <div className="fixed bottom-0 right-0 h-80 w-60 overflow-auto bg-slate-300 p-4">
        <ul>
          {label.map((x, i) => {
            return (
              <li className="flex items-center" key={i}>
                <div
                  style={{ backgroundColor: x[1] }}
                  className="inline-block h-4 w-12"
                ></div>
                : {x[0]}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
