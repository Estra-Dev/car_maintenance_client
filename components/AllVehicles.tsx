"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog,DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import AddVehicles from "./AddVehicles";

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

const AllVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [edit, setEdit] = useState(false)
  const [editId, setEditId] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    assignedTo: "",
    department: "",
  });

  const allVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchVehicle = async () => {
    try {
      const res = await axios.get("/api/vehicles/vehicles", {
        params: {search, status}
      })
      setVehicles(res.data.vehicles)
    } catch (error) {
      console.log("Error fetching", error)
    }
  }

  // console.log("status", status);
  // console.log("vehicles", vehicles);

  useEffect(() => {
    allVehicles();

  }, [])

  useEffect(() => {
    fetchVehicle()
  }, [search, status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Document?")) {
      return;
    }

    try {
      const res = await axios.delete(`/api/vehicles/${id}`, {
        headers: {
          "Content-Type": "Application/json",
        },
      });

      if (res.status === 200) {
        alert("Deleted Successfully")
      }else{
        alert("Something went wrong")
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = ev.target
    setFormData({...formData, [name]: value})
  }
  // console.log("Edit", formData)

  const handleEdit = async (ev: React.ChangeEvent<HTMLFormElement>) => {
    ev.preventDefault()

    const res = await axios.patch(`/api/vehicles/${editId}`, formData);

      if (res.status === 200) {
        // console.log("Done");
        alert("Documented Updated");
        setEdit(false);
      } else {
        alert("Error Updating Document");
      }
  }

  return (
    <div>
      <Card className=" mb-4">
        <AddVehicles onVehicleAdded={allVehicles} />
        <CardHeader>
          <CardTitle>Vehicle Make</CardTitle>
          <CardDescription>Search and filter your vehicles</CardDescription>
        </CardHeader>
        <CardContent className=" flex flex-col md:justify-between md:items-center gap-4 md:flex-row">
          <div className=" w-full ">
            <p>Search Vehicles</p>
            <input
              type="text"
              placeholder="Search by make or model"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md"
            />
          </div>
          <div className="">
            <p>Filter Status</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className=" w-full border">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="service due">Service Due</SelectItem>
                <SelectItem value="in maintenance">In Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
          <CardDescription>Complete List of Vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle._id}>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell className="font-mono">
                    {vehicle.plateNumber}
                  </TableCell>
                  <TableCell>{vehicle.assignedTo}</TableCell>
                  <TableCell>{vehicle.department}</TableCell>
                  <TableCell>{vehicle.status}</TableCell>
                  <TableCell className=" flex gap-2 items-center">
                    <Button variant="ghost" size={"icon"} onClick={() => {
                      setEdit(true)
                      setEditId(vehicle._id)
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className=" text-destructive"
                      onClick={() => handleDelete(vehicle._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={edit} onOpenChange={() => setEdit(!edit)}>
        <DialogContent className=" mx-auto shadow-md max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vehicle with ID {editId}</DialogTitle>
          </DialogHeader>
          {
            vehicles.map(vehicle => (
              vehicle._id === editId && (
                <form action="" key={vehicle._id} className=" flex flex-col gap-4 space-y-4"
                onSubmit={handleEdit}>
                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <label htmlFor="make">Make</label>
                      <input
                        className=" w-full border border-gray-300 p-2"
                        type="text"
                        id="make"
                        name="make"
                        value={formData.make || vehicle.make}
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
                        value={formData.model || vehicle.model}
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
                        value={formData.year || vehicle.year}
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
                        value={formData.plateNumber || vehicle.plateNumber}
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
                        value={formData.assignedTo || vehicle.assignedTo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="">
                      <label htmlFor="department">Department</label>
                      <Select
                        name="department"
                        value={formData.department || vehicle.department}
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
              )
            ))
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllVehicles;
