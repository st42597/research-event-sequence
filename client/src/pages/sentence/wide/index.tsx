import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export default function SentenceVis() {
  const [label, setLabel] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowOrder, setRowOrder] = useState([...Array(20000).keys()]);
  const previousValues = useRef({ selectedRow, rowOrder });
  const firstLoad = useRef(false);
  const canvas = useRef(null);

  const color = d3.schemeTableau10;
  let cnt = 0;
  const event2color: any = {};

  useEffect(() => {
    let _label: any = [];
    const row2idx: any = {};
    const loadData = async () => {
      if (
        firstLoad.current &&
        previousValues.current.selectedRow === selectedRow &&
        previousValues.current.rowOrder === rowOrder
      )
        return;
      if (!firstLoad.current) {
        firstLoad.current = true;
        // tmp1
        // order1
        const _rowOrder = localStorage.getItem("aba");
        if (_rowOrder !== null) {
          setRowOrder(JSON.parse(_rowOrder));
          return;
        }
      }
      for (let i = 0; i < window.localStorage.length; i++) {
        // console.log(window.localStorage.key(i));
      }
      if (previousValues.current.rowOrder !== rowOrder) {
        localStorage.setItem("aba", JSON.stringify(rowOrder));
      }
      previousValues.current = { selectedRow, rowOrder };
      // iraqwar
      // demian
      let data: any = await d3.json("/wine.json");

      // const numCol = Math.max(...data.map((x: Array<any>) => x.length));
      const numCol = 50;
      const numRow = data.length;
      const rectWidth = 100;
      const rectHeight = 1;
      const width = 1400;
      const height = rectHeight * numRow;

      for (let i = 0; i < data.length; i++) {
        for (let j = data[i].length - 1; j >= 0; j--) {
          if (
            j + 1 < data[i].length &&
            data[i][j][1][0] === "#" &&
            data[i][j + 1][1][0] !== "#"
          ) {
            data[i][j + 1][1] = data[i][j][1];
          }
          if (data[i][j][1][0] !== "#") {
            event2color[data[i][j][1]] = "lightgray";
          }
          if (!(data[i][j][1] in event2color)) {
            event2color[data[i][j][1]] = color[cnt];
            console.log(data[i][j][0], color[cnt]);
            _label.push([data[i][j][0], color[cnt]]);
            cnt++;
          }
        }
      }

      function countKeyword(a: any) {
        return a.filter((d: any) => d[1][0] === "#").length;
      }
      /*
      data.sort((a: any, b: any) => {
        return countKeyword(b) - countKeyword(a);
      });
      */
      function posKeyword(a: any) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
          if (a[i][1] === "#A") {
            sum += 10000 * (50 - i);
            break;
          }
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i][1] === "#P") {
            sum += 50 - i;
            break;
          }
        }
        return sum;
      }
      data.sort((a: any, b: any) => {
        return posKeyword(b) - posKeyword(a);
      });
      /*
      data.sort((a: any, b: any) => {
        const cntA = countKeyword(a);
        const cntB = countKeyword(b);
        if (cntA == 0 && cntB == 0) return;
      });
      */
      for (let i = 0; i < data.length; i++) {
        row2idx[data[i]] = rowOrder[i];
      }
      let _data = [...data];
      for (let i = 0; i < data.length; i++) {
        _data[rowOrder[i]] = data[i];
      }
      data = _data;

      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain([...Array(numCol).keys()]);
      const yScale = d3
        .scaleBand()
        .range([0, height])
        .domain([...Array(numRow).keys()]);

      let svg: any;
      let rectG: any;
      let selectG: any;
      if (d3.select(canvas.current).select("svg").empty()) {
        svg = d3
          .select(canvas.current)
          .append("svg")
          .attr("width", width)
          .attr("height", height);
        rectG = svg.append("g").attr("id", "rectG");
        selectG = svg.append("g").attr("id", "selectG");
      } else {
        svg = d3.select(canvas.current).select("svg");
        rectG = svg.select("#rectG");
        selectG = svg.select("#selectG");
      }

      rectG
        .selectAll("g")
        .data(data, (d) => d)
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
        .selectAll("rect")
        .data((d) => d)
        .join((enter) =>
          enter
            .append("rect")
            .attr("width", (d: any) => xScale.bandwidth())
            .attr("height", rectHeight)
            .attr("x", (d: any, i: number) => xScale(i))
            .attr("fill", (d: any, i: number) => event2color[d[1]]),
        );

      selectG
        .selectAll("rect")
        .data(data)
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
                return "transparent";
              })
              .attr("opacity", 0.2)
              .on("mouseover", function (_, d) {
                d3.select(this).attr("fill", "black");
              })
              .on("mouseout", function (_, d) {
                d3.select(this).attr("fill", "transparent");
              })
              .on("click", function (_, d) {
                setSelectedRow(row2idx[d]);
              })
              .on("keydown", function (e, d) {
                const src = selectedRow;
                let target: number;
                if (e.keyCode === 87) {
                  target = Math.max(0, src - 1);
                } else if (e.keyCode === 83) {
                  target = Math.min(numRow - 1, src + 1);
                }
                let _rowOrder = [...rowOrder];
                let srcIdx = 0;
                let targetIdx = 0;
                for (let i = 0; i < data.length; i++) {
                  if (rowOrder[i] === src) srcIdx = i;
                  if (rowOrder[i] === target) targetIdx = i;
                }
                _rowOrder[srcIdx] = target;
                _rowOrder[targetIdx] = src;
                setRowOrder(_rowOrder);
                setSelectedRow(target);
              })
              .on("focus", function () {
                d3.select(this).attr("fill", "red").style("outline", "none");
              }),
          (update) =>
            update
              .attr(
                "transform",
                (d: any, i: number) => `translate(0, ${yScale(i)!})`,
              )
              .attr("fill", (d: any) => {
                if (row2idx[d] === selectedRow) return "red";
                return "transparent";
              })
              .on("mouseover", function (_, d) {
                if (row2idx[d] === selectedRow) return;
                d3.select(this).attr("fill", "black");
              })
              .on("mouseout", function (_, d) {
                if (row2idx[d] === selectedRow) return;
                d3.select(this).attr("fill", "transparent");
              })
              .on("click", function (_, d) {
                setSelectedRow(row2idx[d]);
              })
              .on("keydown", function (e, d) {
                const src = selectedRow;
                let target: number;
                if (e.keyCode === 87) {
                  target = Math.max(0, src - 1);
                } else if (e.keyCode === 83) {
                  target = Math.min(numRow - 1, src + 1);
                } else return;
                let _rowOrder = [...rowOrder];
                let srcIdx = 0;
                let targetIdx = 0;
                for (let i = 0; i < data.length; i++) {
                  if (rowOrder[i] === src) srcIdx = i;
                  if (rowOrder[i] === target) targetIdx = i;
                }
                _rowOrder[srcIdx] = target;
                _rowOrder[targetIdx] = src;
                setRowOrder(_rowOrder);
                setSelectedRow(target);
              })
              .on("focus", function () {
                d3.select(this).attr("fill", "red").style("outline", "none");
              }),
        );
    };

    loadData().then(() => {
      setLabel(_label);
    });
  }, [selectedRow, rowOrder]);

  return (
    <>
      <div className="overflow" ref={canvas}></div>
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
