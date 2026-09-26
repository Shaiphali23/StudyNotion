import React from "react";

const Stats = [
  {
    count: "5K",
    label: "Active Students",
  },
  {
    count: "10+",
    label: "Mentors",
  },
  {
    count: "200+",
    label: "Courses",
  },
  {
    count: "50+",
    label: "Awards",
  },
];

const StatsComponent = () => {
  return (
    <div className="text-white flex flex-wrap justify-around gap-8">
      {Stats.map((data, i) => (
        <div key={i}>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">{data.count}</h1>
          <p className="text-sm lg:text-md text-richblack-200">{data.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsComponent;
