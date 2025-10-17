import AddSchedule from "@/components/AddSchedule";
import AllMaintenance from "@/components/AllMaintenance";
import React from "react";

const page = () => {
  return (
    <div className=" p-4 ml-20 md:ml-64 mt-24 min-h-screen bg-background/95">
      <AddSchedule />
      <AllMaintenance />
    </div>
  );
};

export default page;
