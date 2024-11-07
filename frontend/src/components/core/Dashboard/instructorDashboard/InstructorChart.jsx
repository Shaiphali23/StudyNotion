import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currChart, setCurrChart] = useState("students");

  //function to generate random colors
  const getRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  //Pie chart data for student enrollment
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  //Pie chart data for income generated
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColors(courses.length),
      },
    ],
  };

  //Options for the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="p-6 bg-richblack-800 rounded-lg shadow-md text-center">
      <p className="text-2xl font-semibold text-white mb-4">Visualize</p>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setCurrChart("students")}
          className={`px-4 py-2 rounded-lg text-white transition ${
            currChart === "students" ? "bg-blue-500" : "bg-richblack-700"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`px-4 py-2 rounded-lg text-white transition ${
            currChart === "income" ? "bg-blue-500" : "bg-richblack-700"
          }`}
        >
          Income
        </button>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Pie
          data={
            currChart === "students" ? chartDataForStudents : chartDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;
