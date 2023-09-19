import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function SentenceVis() {
  const [label, setLabel] = useState([]);
  const canvas = useRef(null);

  const color = d3.schemeTableau10;
  let cnt = 0;
  const event2color: any = {};

  useEffect(() => {
    let _label: any = [];
    const loadData = async () => {
      const data: any = await d3.json("/iraqwar.json");
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          if (data[i][j][1][0] != "#") {
            event2color[data[i][j][1]] = "lightgray";
          }
          if (!(data[i][j][1] in event2color)) {
            event2color[data[i][j][1]] = color[cnt];
            _label.push([data[i][j][0], color[cnt]]);
            cnt++;
          }
        }
      }

      function countKeyword(a: any) {
        return a.filter((d: any) => d[1][0] == "#").length;
      }

      data.sort((a: any, b: any) => {
        return countKeyword(b) - countKeyword(a);
      });

      const numCol = Math.max(...data.map((x: Array<any>) => x.length));
      const numRow = data.length;
      const rectWidth = 100;
      const rectHeight = 4;
      const width = 2000;
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
        .attr("width", (d: any) => xScale.bandwidth())
        .attr("height", rectHeight)
        .attr("x", (d: any, i: number) => xScale(i))
        .attr("fill", (d: any, i: number) => event2color[d[1]]);
    };

    loadData().then(() => {
      setLabel(_label);
    });
  }, []);

  useEffect(() => {
    console.log(label);
  }, [label]);

  return (
    <>
      <div ref={canvas}></div>
      <div className="fixed bottom-0 right-0 h-80 w-60 bg-slate-300 p-4">
        <ul>
          {label.map((x) => {
            return (
              <li className="flex items-center">
                <div
                  className={`${
                    x[1] ? "bg-[" + x[1] + "]" : ""
                  } inline-block h-4 w-12`}
                ></div>
                : {x[0]}
              </li>
            );
            <li className="bg-[#ff9da7]"></li>;
          })}
        </ul>
      </div>
    </>
  );
}
