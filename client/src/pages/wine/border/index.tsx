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
        .get("/api/sequlet", {
          headers: {
            Accept: "application/json", // Remove extra whitespace
          },
        })
        .then((res) => res.data);

      _label = _json[0];
      const data = _json[1];

      const numCol = 8;
      const numRow = 6000;
      const width = 1920;
      const height = 1080;

      const _canvas = d3.select(canvas.current);

      const _svg = _canvas
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const sequlet = data;

      /*
      let stp = [0, 0];
      let lastSequlet = ["#ffffff", "#ffffff"];

      for (let j = 0; j < numCol - 1; j++) {
        let cnt = 0;
        for (let i = 0; i < numRow; i++) {
          if (data[i][j] === "#ffffff" || data[i][j + 1] === "#ffffff")
            continue;
          if (
            // sequlet이 연속으로 이어짐
            data[i][j] === lastSequlet[0] &&
            data[i][j + 1] === lastSequlet[1]
          ) {
            cnt++;
          } else {
            // sequlet이 끊어짐
            if (lastSequlet[0] !== "#ffffff" && lastSequlet[1] !== "#ffffff")
              // 저장할 필요 있는 경우
              sequlet.push([cnt, stp, [lastSequlet[0], lastSequlet[1]]]);
            stp = [i, j];
            lastSequlet[0] = data[i][j];
            lastSequlet[1] = data[i][j + 1];
            cnt = 1;
          }
        }
        if (lastSequlet[0] !== "#ffffff")
          // 저장할 필요 있는 경우
          sequlet.push([cnt, stp, [lastSequlet[0], lastSequlet[1]]]);
        lastSequlet = ["#ffffff", "#ffffff"];
      }
      */

      console.log(sequlet);

      const sequletWidth = width / numCol;
      const sequletHeight = height / numRow;

      for (let i = 0; i < sequlet.length; i++) {
        const [cnt, stp, color] = sequlet[i];
        const radius = 14;

        // sequlet 왼쪽
        let stx = sequletWidth * stp[1]; // 좌우
        let sty = sequletHeight * stp[0]; // 상하
        _svg
          .append("path")
          .attr(
            "d",
            `M${stx + radius},${sty}
                            L${stx + sequletWidth},${sty}
                            L${stx + sequletWidth},${sty + sequletHeight * cnt}
                            L${stx + radius},${sty + sequletHeight * cnt}
                            Q${stx},${sty + sequletHeight * cnt} ${stx},${
                              sty + sequletHeight * cnt - radius
                            }
                            L${stx},${sty + radius}
                            Q${stx},${sty} ${stx + radius},${sty}
                            Z`,
          )
          .style("fill", color[0]);

        // sequlet 오른쪽
        stx += sequletWidth;
        _svg
          .append("path")
          .attr(
            "d",
            `M${stx + radius},${sty}
                            L${stx + sequletWidth - radius},${sty}
                            Q${stx + sequletWidth},${sty} ${
                              stx + sequletWidth
                            },${sty + radius}
                            L${stx + sequletWidth},${
                              sty + sequletHeight * cnt - radius
                            }
                            Q${stx + sequletWidth},${
                              sty + sequletHeight * cnt
                            } ${stx + sequletWidth - radius},${
                              sty + sequletHeight * cnt
                            }
                            L${stx},${sty + sequletHeight * cnt}
                            L${stx},${sty}
                            Z`,
          )
          .style("fill", color[1]);
        /*
        _svg
          .append("rect")
          .attr("width", sequletWidth)
          .attr("height", sequletHeight * cnt)
          .attr("x", sequletWidth * stp[1])
          .attr("y", sequletHeight * stp[0])
          .attr("fill", color[0]);
        _svg
          .append("rect")
          .attr("width", sequletWidth)
          .attr("height", sequletHeight * cnt)
          .attr("x", sequletWidth * stp[1] + sequletWidth)
          .attr("y", sequletHeight * stp[0])
          .attr("fill", color[1]);
          */
      }
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
          {label.map((x, i) => (
            <li className="flex items-center" key={i}>
              <div
                style={{ backgroundColor: x[1] }}
                className="inline-block h-4 w-12"
              ></div>
              : {x[0]}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
