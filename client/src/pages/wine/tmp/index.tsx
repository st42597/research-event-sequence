import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

export default function SentenceVis() {
  const [col, setCol] = useState(-1);
  const [label, setLabel] = useState([]);
  const [json, setJson] = useState([]);
  const [svg, setSvg] = useState(undefined);
  const canvas = useRef(null);

  useEffect(() => {
    let _label = [];
    const loadData = async () => {
      const _json = await axios
        .get("/api/wine", {
          headers: {
            Accept: "application/json", // Remove extra whitespace
          },
          params: {
            col: col,
          },
        })
        .then((res) => res.data);

      _label = _json[0];
      const data = _json[1];

      const numCol = 12;
      const numRow = data.length;
      const rectHeight = [0.13, 0.2, 0.3, 0.4][1];
      const width = 1920;
      const height = rectHeight * numRow;

      const _svg = d3
        .select(canvas.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const xScale = d3.scaleBand().range([0, width]).domain([...Array(numCol).keys()]);
      const yScale = d3.scaleBand().range([0, height]).domain([...Array(numRow).keys()]);

      if(svg !== undefined) svg.remove();

      _svg
        .selectAll()
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(0, ${yScale(i)!})`)
        .selectAll("g")
        .data((d) => d)
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", rectHeight)
        .attr("x", (d, i) => xScale(i))
        .attr("fill", (d) => d);

      const A = [...Array(numCol).keys()];

      _svg
        .selectAll()
        .data(A)
        .join("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("width", xScale.bandwidth())
        .attr("height", 1000)
        .attr("fill", "transparent")
        .on("click", (_, d) => {
          setCol(d);
        });

      setJson(_json);
      setSvg(_svg);
    };

    loadData().then(() => {
      setLabel(_label);
    });
  }, [col]);

  useEffect(() => {
    if (svg === undefined) return;

    const _label = json[0];
    const data = json[1];

    const numCol = 12;
    const numRow = data.length;
    const rectHeight = [0.13, 0.2, 0.3, 0.4][1];
    const width = 1920;
    const height = rectHeight * numRow;

    const xScale = d3.scaleBand().range([0, width]).domain([...Array(numCol).keys()]);
    const yScale = d3.scaleBand().range([0, height]).domain([...Array(numRow).keys()]);

    svg.selectAll("*").remove();

    svg
      .selectAll()
      .data(data)
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${yScale(i)!})`)
      .selectAll("g")
      .data((d) => d)
      .join("rect")
      .attr("width", xScale.bandwidth())
      .attr("height", rectHeight)
      .attr("x", (d, i) => xScale(i))
      .attr("fill", (d) => d);

    const A = [...Array(numCol).keys()];

    svg
      .selectAll()
      .data(A)
      .join("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("width", xScale.bandwidth())
      .attr("height", 1000)
      .attr("fill", "transparent")
      .on("click", (_, d) => {
        setCol(d);
      });

    setSvg(svg);
  }, [json, svg]);

  return (
    <>
      <div ref={canvas}></div>
      <div className="fixed bottom-0 right-0 h-80 w-60 overflow-auto bg-slate-300 p-4">
        <ul>
          {label.map((x, i) => (
            <li className="flex items-center" key={i}>
              <div style={{ backgroundColor: x[1] }} className="inline-block h-4 w-12"></div>
              : {x[0]}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
