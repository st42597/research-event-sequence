import { useEffect } from "react";
import * as d3 from "d3";

export default function Stock() {
  useEffect(() => {
    d3.json("./stock.json").then((data: any) => {
      // console.log(data);
      const color = d3.scaleOrdinal([0, 1, 2, 3], d3.schemeRdBu[4]);
      const stockList = data.map((x: any) => x.stock);
      const dateList = Object.keys(data[0].data);
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

      svg
        .selectAll()
        .append("g")
        .data(data)
        .join("text")
        .text((d: any) => d.stock)
        .attr("x", 60)
        .attr("y", (d: any) => y(d.stock)! + 16)
        .attr("text-anchor", "end");

      svg
        .selectAll()
        .data(data)
        .join("g")
        .attr("transform", "translate(70, 0)")
        .selectAll("g")

        .data((stock: any) => {
          const stockName = stock.stock;
          console.log(stockName);
          const stockData = stock.data;
          const ret = [];
          for (const d in stockData) {
            ret.push({
              date: d,
              name: stockName,
              class: 3 - stockData[d].Class,
            });
          }
          console.log(ret);
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
