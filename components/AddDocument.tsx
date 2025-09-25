"use client"

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';

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

const AddDocument = () => {

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
     const [isAddDialog, setIsAddDialog] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      const [formData, setFormData] = useState({
        vehicle: "",
        documentType: "",
        issueDate: "",
        expiryDate: "",
        documentNumber: "",
        issuingAuth: "",
        reminderDayBeforeExpiry: "",
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
      console.log("formDate", formData);

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validate form data
    if (
      !formData.vehicle ||
      !formData.documentType ||
      !formData.issueDate ||
      !formData.expiryDate ||
      !formData.documentNumber ||
      !formData.issuingAuth ||
      !formData.reminderDayBeforeExpiry
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/api/documents/create", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 201) {
        setSuccess("Document added successfully.");
        setFormData({
          vehicle: "",
          documentType: "",
          issueDate: "",
          expiryDate: "",
          documentNumber: "",
          issuingAuth: "",
          reminderDayBeforeExpiry: "",
        });

        setIsAddDialog(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to add Document. ${error.message}`);
      } else {
        setError("Failed to add Document.");
      }
    }

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
            <h1 className="text-2xl font-bold">Document Management</h1>
            <p className="text-gray-500/80 text-sm">
              Track vehicle documents and renewals
            </p>
          </span>

          <Button
            className=" bg-gray-800 text-white text-sm p-2 flex justify-center rounded-md z-20 cursor-pointer hover:bg-gray-700 transition"
            onClick={() => setIsAddDialog(true)}
          >
            <Plus size={16} />
            Add Document
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className=" mx-auto shadow-md max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Add a new document for your fleet vehicle.
          </DialogDescription>
        </DialogHeader>
        <form
          className=" flex flex-col gap-4 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="vehicle">Vehicle</label>              
              <Select
                name="vehicle"
                value={formData.vehicle}
                onValueChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    vehicle: value,
                  }))
                }
              >
                <SelectTrigger className=" w-full border">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent className=" bg-lime-500 text-white">
                  {vehicles.map((vehicle) => (
                    <SelectItem value={vehicle.plateNumber} key={vehicle._id}>{vehicle.model} {vehicle.plateNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <label htmlFor="documentType">Document Type</label>
              <input
                className=" w-full border border-gray-300 p-2"
                type="text"
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
              />
              
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="scheduledDate">Issued Date</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="nextServiceDate">Expiry Date</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="estimatedCost">Document Number</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="text"
                id="documentNumber"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label htmlFor="priority">Issuing Authority</label>
              <input
                className="border w-full border-gray-300 p-2"
                type="text"
                id="issuingAuth"
                name="issuingAuth"
                value={formData.issuingAuth}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="">
            <label htmlFor="note">Reminder before Expiry Date</label>
            <Select
              name="reminderDayBeforeExpiry"
              value={formData.reminderDayBeforeExpiry}
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  reminderDayBeforeExpiry: value,
                }))
              }
            >
              <SelectTrigger className=" w-full border">
                <SelectValue placeholder="Select Reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="15">15 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
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
              Add Document
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDocument
