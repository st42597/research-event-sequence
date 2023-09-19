import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function SentenceVis() {
  const [label, setLabel] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const canvas = useRef(null);

  const color = d3.schemeTableau10;
  let cnt = 0;
  const event2color: any = {};
  const row2idx: any = {};
  const rowOrder = [];

  useEffect(() => {
    let _label: any = [];
    const loadData = async () => {
      const data: any = await d3.json("/iraqwar.json");
      const numCol = Math.max(...data.map((x: Array<any>) => x.length));
      const numRow = data.length;
      const rectWidth = 100;
      const rectHeight = 4;
      const width = 2000;
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

      data.sort((a: any, b: any) => {
        return countKeyword(b) - countKeyword(a);
      });

      for (let i = 0; i < data.length; i++) {
        row2idx[data[i]] = i;
        rowOrder.push(i);
      }

      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain([...Array(numCol).keys()]);
      const yScale = d3
        .scaleBand()
        .range([0, height])
        .domain([...Array(numRow).keys()]);

      let svg: any;
      if (d3.select(canvas.current).select("svg").empty()) {
        svg = d3
          .select(canvas.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height);
      } else {
        svg = d3.select(canvas.current).select("svg");
      }

      svg
        .selectAll("g")
        .data(data)
        .join(
          (enter) =>
            enter
              .append("g")
              .attr(
                "transform",
                (d: any, i: number) => `translate(0, ${yScale(i)!})`,
              ),
          (update) =>
            update.attr(
              "transform",
              (d: any, i: number) => `translate(0, ${yScale(i)!})`,
            ),
        )
        .selectAll("g")
        .data((d) => d)
        .join((enter) =>
          enter
            .append("rect")
            .attr("width", (d: any) => xScale.bandwidth())
            .attr("height", rectHeight)
            .attr("x", (d: any, i: number) => xScale(i))
            .attr("fill", (d: any, i: number) => event2color[d[1]]),
        );
      svg
        .selectAll()
        .data(data, (d, i) => i)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr(
                "transform",
                (d: any, i: number) => `translate(0, ${yScale(i)!})`,
              )
              .attr("width", width)
              .attr("height", rectHeight)
              .attr("fill", (d: any) => {
                if (row2idx[d] == selectedRow) return "red";
                return "transparent";
              })
              .attr("opacity", 0.2)
              .on("mouseover", function (_, d) {
                if (row2idx[d] == selectedRow) return;
                d3.select(this).attr("fill", "black");
              })
              .on("mouseout", function (_, d) {
                if (row2idx[d] == selectedRow) return;
                d3.select(this).attr("fill", "transparent");
              })
              .on("click", function (_, d) {
                console.log(row2idx[d]);
                setSelectedRow(row2idx[d]);
              }),
          (update) =>
            update.attr("fill", (d: any) => {
              console.log("test");
              if (row2idx[d] == selectedRow) return "red";
              return "transparent";
            }),
        );
    };

    loadData().then(() => {
      setLabel(_label);
    });
  }, [selectedRow]);

  useEffect(() => {}, [label]);

  return (
    <>
      <div ref={canvas}></div>
      <div className="fixed bottom-0 right-0 h-80 w-60 bg-slate-300 p-4">
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
