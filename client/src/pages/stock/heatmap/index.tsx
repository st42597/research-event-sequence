import { useEffect, useState } from "react";
import * as d3 from "d3";

const desendingSort = (data: any, idx: number) => {
  const compareWidth = 2;
  data.sort((a: any, b: any) => {
    let scoreA = 0,
      scoreB = 0;
    for (let i = 0; i < compareWidth; i++) {
      if (idx - i > 0) {
        scoreA += a.data[idx - i].Class * 10 ** (compareWidth - i);
        scoreB += b.data[idx - i].Class * 10 ** (compareWidth - i);
      }
      if (idx + i < data.length) {
        scoreA += a.data[idx + i].Class * 10 ** (compareWidth - i);
        scoreB += b.data[idx + i].Class * 10 ** (compareWidth - i);
      }
    }
    // console.log(a, b, scoreA, scoreB);
    // console.log(a.stock, b.stock);
    return scoreB - scoreA;
  });
  return data;
};

export default function HeatMap() {
  const [pointer, setPointer] = useState("2022-08-19");
  useEffect(() => {
    d3.json("/stock.json").then((data: any) => {
      const dateList = data[0].data.map((x: any) => x.date);
      const date2idx = {};
      dateList.forEach((d: string, i: number) => {
        date2idx[d] = i;
      });
      data = desendingSort(data, date2idx[pointer]);
      const color = d3.scaleOrdinal([0, 1, 2, 3], d3.schemeRdBu[4]);
      const stockList = data.map((x: any) => x.stock);
      const numberOfStock = stockList.length;
      const numberOfDate = dateList.length;
      const rectSize = 20;
      const padSize = 2;
      const width = numberOfDate * rectSize + (numberOfDate - 1) * padSize;
      const height = numberOfStock * rectSize + (numberOfStock - 1) * padSize;
      const x = d3.scaleBand().range([0, width]).domain(dateList).padding(0.01);
      const y = d3
        .scaleBand()
        .range([0, height])
        .domain(stockList)
        .padding(0.01);

      let svg;
      let header;
      let body;
      let label;
      let heatmap;

      if (d3.select("#stock-container").select("svg").empty()) {
        svg = d3
          .select("#stock-container")
          .append("svg")
          .attr("id", "svg")
          .attr("width", x.range()[1] + 70)
          .attr("height", y.range()[1] + 20);
        header = svg
          .append("g")
          .attr("id", "svg-header")
          .attr("transform", "translate(70, 0)");
        body = svg
          .append("g")
          .attr("id", "svg-body")
          .attr("transform", "translate(0, 20)");
        label = body.append("g").attr("id", "svg-label");
        heatmap = body
          .append("g")
          .attr("id", "svg-heatmap")
          .attr("transform", "translate(70)");
      } else {
        svg = d3.select("#svg");
        header = d3.select("#svg-header");
        body = d3.select("#svg-body");
        label = d3.select("#svg-label");
        heatmap = d3.select("#svg-heatmap");
      }

      header
        .selectAll("circle")
        .data(dateList)
        .join(
          (enter) =>
            enter
              .append("circle")
              .attr("cx", (d: any) => x(d)! + 10)
              .attr("cy", 10)
              .attr("r", 5)
              .attr("fill", (d: any) => {
                return d === pointer ? "red" : "steelblue";
              })
              .style("cursor", "pointer")
              .on("mouseover", function () {
                d3.select(this).attr("fill", "red");
              })
              .on("mouseout", function (e: any, d: string) {
                if (d === pointer) return;
                d3.select(this).attr("fill", "steelblue");
              })
              .on("click", function (e: any, d: string) {
                setPointer(d);
              }),
          (update) =>
            update
              .attr("fill", (d: any) => {
                return d === pointer ? "red" : "steelblue";
              })
              .on("mouseout", function (e: any, d: string) {
                if (d === pointer) return;
                d3.select(this).attr("fill", "steelblue");
              }),
        );

      label
        .selectAll("text")
        .data(data)
        .join(
          (enter) =>
            enter
              .append("text")
              .text((d: any) => d.stock)
              .attr("x", 60)
              .attr("y", (d: any) => y(d.stock)! + 16)
              .attr("text-anchor", "end"),
          (update) =>
            update
              .text((d: any) => d.stock)
              .attr("y", (d: any) => {
                return y(d.stock)! + 16;
              })
              .selection(),
        );

      heatmap
        .selectAll()
        .data(data)
        .join(
          (enter) =>
            enter
              .append("g")
              .attr("transform", (d: any) => `translate(0, ${y(d.stock)!})`)
              .selectAll("g")
              .data((stock: any) => {
                const stockName = stock.stock;
                const stockData = stock.data;
                const ret = [];
                for (const d in stockData) {
                  ret.push({
                    date: stockData[d].date,
                    name: stockName,
                    class: 3 - stockData[d].Class,
                  });
                }
                return ret;
              })
              .join((enter) =>
                enter
                  .append("rect")
                  .attr("x", (d: any) => x(d.date)!)
                  .attr("height", rectSize)
                  .attr("width", rectSize)
                  .attr("fill", (d: any) => color(d.class)),
              ),
          (update) =>
            update.attr("transform", (d: any) => `translate(${y(d.name)!}, 0)`),
        );
    });
  }, [pointer]);

  return (
    <div className="h-full w-full overflow-auto p-8">
      <h1 className="mb-4 text-2xl">Stock Event Sequence</h1>
      <div className="overflow-auto">
        <div id="stock-container"></div>
      </div>
    </div>
  );
}
