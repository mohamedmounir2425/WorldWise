import { useEffect, useRef, useState } from "react";
import { chartDataObj } from "./data"; // Ensure this is correctly defined
import ReactECharts from "echarts-for-react";

function EChart() {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setChartData(chartDataObj);
    }, 1000);
  }, []);

  if (!chartData) {
    return <div>Loading chart...</div>;
  }

  const series = chartData.chartSeries.map((item, _, arr) => ({
    name: item.name,
    type: "line",
    data: item.data,
    smooth: true,
    areaStyle:
      arr.length > 1
        ? undefined
        : {
            color: {
              type: "linear", // Use linear gradient
              x: 0, // Start point of the gradient
              y: 0, // Top of the area
              x2: 0, // End point of the gradient
              y2: 1, // Bottom of the area
              colorStops: [
                { offset: 0, color: "rgba(84,112,198, 0.4)" }, // Strong color at the top
                { offset: 1, color: "rgba(84,112,198, 0)" }, // Fully transparent at the bottom
              ],
            },
          },
    emphasis: {
      focus: "series",
    },
    connectNulls: true, // Handles null values gracefully
    label:
      arr.length > 1
        ? undefined
        : {
            show: true,
            fontSize: 10,
          },
  }));

  const option = {
    tooltip: {
      trigger: chartData.chartSeries.length < 9 ? "axis" : "item",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: chartData.chartSeries.map((item) => item.name),
      top: 10, // Position the legend near the top
      left: "center", // Center the legend horizontally
      type: "scroll", // Make the legend scrollable if there are many series
      icon: "circle",
      textStyle: {
        fontSize: 14, // Optional: Adjust the font size
      },
      width: "90%",
    },

    toolbox: {
      feature: {
        saveAsImage: {
          show: true, // Enable the download button
          title: "Download as Image", // Tooltip for the download button
          type: "png", // Specify image format (can be 'png', 'jpeg', 'jpg', 'svg', etc.)
          pixelRatio: 2,
          // Custom path for the download icon (SVG path data)
          color: {
            color: "#00FF00", // Custom icon color (green)
          },
        },
      },
      top: 10, // Position the toolbox near the top, same as the legend
      right: 10, // Position the toolbox 10px from the right
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "12%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: chartData.seriesDates,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    dataZoom: [
      {
        type: "inside", // Mouse wheel zoom
        start: 0,
        end: 100,
      },
      {
        type: "slider", // Zoom control with a slider
        start: 0,
        end: 100,
      },
    ],
    series: series, // Use the non-stacked series
  };

  const updateChartType = (newType) => {
    const chartInstance = chartRef.current.getEchartsInstance();

    const updatedSeries = series.map((s) => ({
      ...s,
      type: newType, // Update type dynamically
    }));

    chartInstance.setOption({
      ...option,
      xAxis: {
        ...option.xAxis[0],
        boundaryGap: newType === "bar", // Enable boundaryGap for bar chart
      },
      series: updatedSeries,
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => updateChartType("line")}>Line Chart</button>
      <button onClick={() => updateChartType("bar")}>Bar Chart</button>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: 500 }} // Ensure the height is set for rendering
      />
    </div>
  );
}

export default EChart;
