import { memo, useEffect, useState } from "react";
import { chartDataObj } from "./data";
import ReactApexChart from "react-apexcharts";

function Chart() {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("bar");
  useEffect(() => {
    setTimeout(() => {
      setChartData(chartDataObj);
    }, 1000);
  }, []);
  if (!chartData) return null;
  const newOptions = {
    chart: {
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: true, type: "x" },
      type: "area",
      dropShadow: {
        enabled: false,
        // enabled: true,
        top: 18,
        left: 2,
        blur: 5,
        opacity: 0.2,
      },
      animations: {
        enabled: false,
      },
      offsetX: -10,
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    dataLabels: {
      // hey chat here i want to show data label on the line if it contain data length <= 10
      // enabled: false, // Show data labels above points
      enabled: chartData?.seriesDates?.length <= 10 ? true : false, // Show data labels above points
    },
    grid: {
      borderColor: "#ebe9f1",
      padding: {
        top: -20,
        bottom: 5,
        left: 20,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "left",
      markers: {
        width: 10,
        height: 10,
        radius: 12, // Circular markers
        offsetX: -4, // Adjust marker position
      },
      itemMargin: {
        // horizontal: 10,
        vertical: 0,
      },
    },
    animations: {
      enabled: false, // Disable animations for better performance
    },
    precision: 2, // Reduce data precision for large datasets

    colors: [
      "#008FFB",
      "#9FD987",
      "#FFE194",
      "#B99BE8",
      "#CBF08A",
      "#FAA799",
      "#F3B0E8",
      "#E4E684",
      "#A4CDFF",
      "#D6BAFF",
      "#A7F2C8",
      "#D7FFC8",
      "#A9D9BE",
      "#90E8F5",
      "#FFFFA8",
      "#F2D9D0",
      "#FFA299",
      "#F2DCF2",
      "#E8C096",
      "#FF778F",
      "#F2BBEF",
    ],

    markers: {
      size: 0,
    },
    xaxis: {
      categories: chartData?.seriesDates || [], // Array of date strings
      title: {
        text: "المدى الزمنى",
      },
      labels: {
        hideOverlappingLabels: true,
      },
      tickPlacement: "on",
      tickAmount: 10,
    },

    yaxis: {
      axisTicks: {
        offsetX: -15,
      },
      title: {
        offsetX: -30,
        text: chartData.unitMeasure,
      },
    },
    tooltip: {
      x: { show: false },
    },
  };
  return (
    <div>
      <h1 style={{ color: "#fff" }}>apex chart</h1>
      <hr />

      <>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setChartType("bar")} className="chart-btns">
            <span
              style={{
                color: chartType === "bar" ? "#7367f0" : "",
              }}
            >
              bar
            </span>
          </button>
          <button onClick={() => setChartType("line")} className="chart-btns">
            <span
              style={{
                color: chartType !== "bar" ? "#7367f0" : "",
              }}
            >
              line
            </span>
          </button>
        </div>

        <ReactApexChart
          options={newOptions}
          series={chartData?.chartSeries || []}
          type={
            chartType === "bar"
              ? "bar"
              : chartData.chartSeries.length !== 1
              ? "line"
              : "area"
          }
          // type={"bar"}
          height={500}
        />
      </>
    </div>
  );
}

export default memo(Chart);
