import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function SentenceVis() {
  const [label, setLabel] = useState([]);
  const canvas = useRef(null);

  const color = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#aec7e8",
    "#ffbb78",
    "#98df8a",
    "#ff9896",
    "#c5b0d5",
    "#c49c94",
    "#f7b6d2",
    "#c7c7c7",
    "#dbdb8d",
    "#9edae5",
  ];
  let cnt = 0;
  const event2color: any = {};

  useEffect(() => {
    let _label: any = [];
    const loadData = async () => {
      const data: any = await d3.json("/wine.json");

      const numCol = 50;
      const numRow = data.length;
      const rectWidth = 100;
      const rectHeight = 2;
      const width = 1920;
      const height = rectHeight * numRow;

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

      function eventScore(a: any) {
        let sum = 0;
        let i = 0;
        console.log(a);
        for (; i < a.length; i++) {
          if (a[i][1] === "#F") {
            sum += 100 * (numCol - i);
            break;
          }
        }
        for (; i < a.length; i++) {
          if (a[i][1] === "#AA") {
            sum += numCol - i;
            break;
          }
        }
        return sum;
      }

      data.sort((a: any, b: any) => {
        // return countKeyword(b) - countKeyword(a);
        return eventScore(b) - eventScore(a);
      });

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

  useEffect(() => {}, [label]);

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
