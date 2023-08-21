import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function HeatMap() {
  useEffect(() => {
    d3.json("/stock.json").then((data: any) => {
      const width = 1000;
      const height = 500;
      const svg = d3.select("#sankey-container").append("svg");
      let color = d3.scaleOrdinal(d3.schemeTableau10);
      let sankey = d3.sankey();
    });
  }, []);

  return (
    <div className="h-full w-full overflow-auto p-8">
      <h1 className="mb-4 text-2xl">Stock Event Sequence - Sankey Diagram</h1>
      <div className="overflow-auto">
        <div id="sankey-container"></div>
      </div>
    </div>
  );
}
