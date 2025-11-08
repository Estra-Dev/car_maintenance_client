"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "./ui/button";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  assignedTo: string;
  department: string;
  status: string;
  nextService: string;
}

interface AddScheduleProps {
  onScheduleAdded?: () => void;
}

const AddSchedule = ({onScheduleAdded}: AddScheduleProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    vehiclePlateNo: "",
    serviceType: "",
    scheduledDate: "",
    nextServiceDate: "",
    priority: "",
    estimatedCost: "",
    note: "",
  });

  const allVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    allVehicles();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Handle input change
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  // console.log("formDate", formData);         

  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validate form data
    if (
      !formData.vehiclePlateNo ||
      !formData.serviceType ||
      !formData.scheduledDate ||
      !formData.nextServiceDate ||
      !formData.priority ||
      !formData.estimatedCost ||
      !formData.note
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/api/maintenance/create", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 201) {
        setSuccess("Maintenance Scheduled successfully.");
        setFormData({
          vehiclePlateNo: "",
          serviceType: "",
          scheduledDate: "",
          nextServiceDate: "",
          priority: "",
          estimatedCost: "",
          note: "",
        });

        if (onScheduleAdded) {
          onScheduleAdded();
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to add PlateNo. ${error.message}`);
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
      <DialogTrigger asChild className=" overflow-auto">
        <div className=" flex flex-col md:flex-row gap-3 justify-between border-b p-4 mb-4">
          <span>
            <h1 className="text-2xl font-bold">Maintenance</h1>
            <p className="text-gray-500/80 text-sm">
              Manage your vehicle maintenance tasks efficiently.
            </p>
          </span>

          <Button
            className=" bg-gray-800 text-white text-sm p-2 flex justify-center rounded-md z-20 cursor-pointer hover:bg-gray-700 transition"
            onClick={() => setIsAddDialog(true)}
          >
            <Plus size={16} />
            Schedule Service
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className=" mx-auto shadow-md max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scheduled Service</DialogTitle>
          <DialogDescription>
            Schedule a new maintenance service for your fleet vehicle.
          </DialogDescription>
        </DialogHeader>
        <form
          className=" flex flex-col gap-4 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="vehiclePlateNo">Vehicle Plate No.</label>
              
              <Select
                name="vehiclePlateNo"
                value={formData.vehiclePlateNo}
                onValueChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    vehiclePlateNo: value,
                  }))
                }
              >
                <SelectTrigger className=" w-full border">
                  <SelectValue placeholder="Select Vehicle Plate No." />
                </SelectTrigger>
                <SelectContent className=" bg-lime-500 text-white">
                  {vehicles.length === 0 ? (
                    <SelectItem value="">No Vehicles Available</SelectItem>
                  ) : (
                    vehicles.map((vehicle) => (
                      <SelectItem key={vehicle._id} value={vehicle.plateNumber}>
                        {vehicle.plateNumber} - {vehicle.make} {vehicle.model} (
                        {vehicle.year})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <label htmlFor="seviceType">Service Type</label>
              <Select
                name="serviceType"
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    serviceType: value,
                  }))
                }
              >
                <SelectTrigger className=" w-full border">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className=" bg-lime-500 text-white">
                  <SelectItem value="oilChange">Oil Change</SelectItem>
                  <SelectItem value="brakeInspection">
                    Brake Inspection
                  </SelectItem>
                  <SelectItem value="tireRotation">Tire Rotation</SelectItem>
                  <SelectItem value="annualInspection">
                    Annual Inspection
                  </SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="scheduledDate">Scheduled Date</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="nextServiceDate">Next Service Date</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="date"
                id="nextServiceDate"
                name="nextServiceDate"
                value={formData.nextServiceDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="estimatedCost">Estimated Cost</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="priority">Priority</label>
              <Select
                name="priority"
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    priority: value,
                  }))
                }
              >
                <SelectTrigger className=" w-full border">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="">
            <label htmlFor="note">Add Note</label>
            <textarea
              className="border w-full border-gray-300 p-2"
              id="note"
              name="note"
              placeholder="Additional details about the service"
              value={formData.note}
              onChange={handleChange}
            ></textarea>
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

export default AddSchedule;
