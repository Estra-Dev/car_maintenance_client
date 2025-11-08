"use client";

import React, { useState } from "react";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "./ui/select";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import axios from "axios";

interface AddVehicleProps {
  onVehicleAdded?: () => void;
}


const AddVehicles = ({onVehicleAdded}: AddVehicleProps) => {
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    assignedTo: "",
    department: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle input change
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validate form data
    if (
      !formData.make ||
      !formData.model ||
      !formData.year ||
      !formData.plateNumber ||
      !formData.assignedTo ||
      !formData.department
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/api/vehicles/create", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 201) {
        setSuccess("Vehicle added successfully.");
        setFormData({
          make: "",
          model: "",
          year: "",
          plateNumber: "",
          assignedTo: "",
          department: "",
        });

        if (onVehicleAdded) {
          onVehicleAdded();
        }

      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to add vehicle. ${error.message}`);
      } else {
        setError("Failed to add vehicle.");
      }
    }
    setIsAddDialog(false);
    // Handle form submission
  };

  return (
    <Dialog
      open={isAddDialog}
      onOpenChange={() => setIsAddDialog(!isAddDialog)}
    >
      <DialogOverlay className=" fixed inset-0 bg-black/50 backdrop-blur-sm z-10" />
      <DialogTrigger asChild>
        <div className=" flex justify-end border-b p-4 mb-4">
          <button
            className=" bg-gray-800 text-white text-sm p-2 flex justify-center rounded-md z-20 cursor-pointer hover:bg-gray-700 transition"
            onClick={() => setIsAddDialog(true)}
          >
            <Plus size={16} />
            Add Vehicle
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className=" mx-auto shadow-md max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter Details for the new Vehicle
          </DialogDescription>
        </DialogHeader>
        <form
          className=" flex flex-col gap-4 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="make">Make</label>
              <input
                className=" w-full border border-gray-300 p-2"
                type="text"
                id="make"
                name="make"
                value={formData.make}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="model">Model</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="year">Year</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="text"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="plateNumber">Plate Number</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="text"
                id="plateNumber"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="department">Department</label>
              <Select
                name="department"
                value={formData.department}
                onValueChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    department: value,
                  }))
                }
              >
                <SelectTrigger className=" w-full border">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Logistics/Operations">
                    Logistics/Operations
                  </SelectItem>
                  <SelectItem value="Boss">Boss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && (
            <div className=" border border-destructive bg-destructive/5 p-4 rounded-md text-center">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          {success && (
            <div className=" border border-lime-500 bg-lime-500/5 p-4 rounded-md text-center">
              <p className="text-lime-500">{success}</p>
            </div>
          )}
          <div className="">
            <button
              type="submit"
              className="bg-lime-500 text-white rounded-md p-2"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicles;
