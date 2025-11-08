import React from "react";

// import AddVehicles from "@/components/AddVehicles";
import AllVehicles from "@/components/AllVehicles";

const page = () => {
  return (
    <div className=" ml-20 md:ml-64 p-4 mt-24 min-h-screen bg-background/95">
      {/* <AddVehicles /> */}
      <AllVehicles />
    </div>
  );
};

export default page;
