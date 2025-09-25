import AddDocument from "@/components/AddDocument";
import AllDocuments from "@/components/AllDocuments";
import React from "react";

const page = () => {
  return <div className=" p-4 ml-20 md:ml-64 mt-24 min-h-screen bg-background">
    <AddDocument />
    <AllDocuments />
  </div>;
};

export default page;
