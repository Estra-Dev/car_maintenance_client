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

  const allVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  console.log("cars", vehicles);
  useEffect(() => {
    allVehicles();
  }, []);

  return (
    <div>
      <Card className=" mb-4">
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
              className="border border-gray-300 p-2 w-full rounded-md"
            />
          </div>
          <div className="">
            <p>Filter Status</p>
            <Select>
              <SelectTrigger className=" w-full border">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
                <TableHead>Next Service</TableHead>
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
                  <TableCell>
                    {new Date(vehicle.nextService).toLocaleDateString()}
                  </TableCell>
                  <TableCell className=" flex gap-2 items-center">
                    <Button variant="ghost" size={"icon"}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className=" text-destructive"
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
    </div>
  );
};

export default AllVehicles;
