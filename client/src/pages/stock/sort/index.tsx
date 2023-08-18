import { useEffect, useState } from "react";
import * as d3 from "d3";

const desendingSort = (data: any) => {
  data.sort((a: any, b: any) => {
    let scoreA = 0,
      scoreB = 0;
    for (let i = 0; i < 5; i++) {
      scoreA += a.data[i].Class * 10 ** (5 - i);
      scoreB += b.data[i].Class * 10 ** (5 - i);
    }
    return scoreB - scoreA;
  });
  return data;
};

export default function Stock() {
  const [pointer, setPointer] = useState("2022-08-19");
  useEffect(() => {
    d3.json("/stock.json").then((data: any) => {
      data = desendingSort(data);
      const color = d3.scaleOrdinal([0, 1, 2, 3], d3.schemeRdBu[4]);
      const stockList = data.map((x: any) => x.stock);
      const dateList = data[0].data.map((x: any) => x.date);
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

      const svg = d3
        .select("#stock-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const header = svg.append("g").attr("transform", "translate(70, 0)");
      const body = svg.append("g").attr("transform", "translate(0, 20)");

      header
        .selectAll("circle")
        .data(data[0].data)
        .join("circle")
        .attr("cx", (d: any) => x(d.date)! + 10)
        .attr("cy", 10)
        .attr("r", 5)
        .attr("fill", (d: any) => {
          return d.date == pointer ? "red" : "steelblue";
        })
        .style("cursor", "pointer");

      header
        .selectAll("circle")
        .on("mouseover", (e, d) => {
          console.log(this, e, d);
          return d3.select(this).attr("fill", "red");
        })
        .on("mouseout", () => {})
        .on("click", (e, d) => {
          console.log(e, d);
          setPointer(d.date);
        });

      body
        .selectAll()
        .data(data)
        .join("text")
        .text((d: any) => d.stock)
        .attr("x", 60)
        .attr("y", (d: any) => y(d.stock)! + 16)
        .attr("text-anchor", "end");

      body
        .selectAll()
        .data(data)
        .join("g")
        .attr("transform", "translate(70, 0)")
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
        .join("rect")
        .attr("x", (d: any) => x(d.date)!)
        .attr("y", (d: any) => y(d.name)!)
        .attr("height", rectSize)
        .attr("width", rectSize)
        .attr("fill", (d) => color(d.class));
    });
  }, []);

  return (
    <div className="h-full w-full overflow-auto p-8">
      <h1 className="text-2xl">Stock Event Sequence</h1>
      <div className="overflow-auto">
        <div id="stock-container"></div>
      </div>
    </div>
  );
}
