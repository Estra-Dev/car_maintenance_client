"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertOctagon,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

interface MaintenanceTask {
  _id: string;
  vehiclePlateNo: string;
  serviceType: string;
  scheduledDate: string;
  nextServiceDate: string;
  estimatedCost: number;
  priority: string;
  note: string;
}

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

const AllMaintenance = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);
  const [almostDueMaintenance, setAlmostDueMaintenance] = useState<MaintenanceTask[]>([]);
  const [dueMaintenance, setDueMaintenance] = useState<MaintenanceTask[]>([]);
  const [totalServices, setTotalServices] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [edit, setEdit] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [editId, setEditId] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    vehiclePlateNo: "",
    serviceType: "",
    scheduledDate: "",
    nextServiceDate: "",
    priority: "",
    estimatedCost: "",
    note: "",
  });

  const maintenanceStats = [
    {
      title: "Upcoming Services",
      icon: <Clock className=" text-foreground w-4 h-4" />,
      value: almostDueMaintenance.length,
      text: "Next 30 Days",
      textColor: "text-purple-500",
    },
    {
      title: "Due Services",
      icon: <AlertOctagon className=" text-foreground w-4 h-4" />,
      value: dueMaintenance.length,
      text: "Due Now",
      textColor: "text-destructive",
    },
    {
      title: "Scheduled Services",
      icon: <CheckCircle className=" text-foreground w-4 h-4" />,
      value: totalServices,
      text: "This month",
      textColor: "text-gray-500",
    },
    {
      title: "Total Cost",
      icon: <DollarSign className=" text-foreground w-4 h-4" />,
      value: `#${totalCost}`,
      text: "This month",
      textColor: "text-gray-500",
    },
  ];

  const allMaintenance = async () => {
    try {
      const res = await fetch("/api/maintenance/allMaintenance");
      const data = await res.json();
      setMaintenance(data.maintenances);

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const upcomingMaintenance = data.maintenances.filter(
        (task: MaintenanceTask) => {
          const serviceDate = new Date(task.nextServiceDate);
          const timeDiff = serviceDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return daysDiff > 0 && daysDiff <= 30; // Maintenance tasks due in the next 30 days
        }
      );

      const dueMaintenance = data.maintenances.filter(
        (task: MaintenanceTask) => {
          const serviceDate = new Date(task.scheduledDate);
          return serviceDate <= today; // Maintenance tasks that are overdue
        }
      );

      const totalServicesThisMonth = data.maintenances.filter(
        (task: MaintenanceTask) => {
          const serviceDate = new Date(task.scheduledDate);
          return (
            serviceDate.getMonth() === currentMonth &&
            serviceDate.getFullYear() === currentYear
          );
        })

      const totalCostThisMonth = totalServicesThisMonth.reduce(
        (acc: number, task: MaintenanceTask) => acc + task.estimatedCost,
        0
      );
      
      setTotalCost(totalCostThisMonth);
      setTotalServices(totalServicesThisMonth.length);
      setAlmostDueMaintenance(upcomingMaintenance);
      setDueMaintenance(dueMaintenance);
    } catch (error) {
      console.log("error fetching maintenance data", error);
    }
  };

  const allVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles/vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    allMaintenance();
    allVehicles()
  }, []);

  const handleDelete = async (id: string) => {

    if (!confirm("Are  you sure you want to this maintenace?")) {
      return;
    }

    try {
      const res = await axios.delete(`/api/maintenance/${id}`, {
        headers: {"Content-Type":"Application/json"}
      })

      if (res.status === 200) {
        alert("Deleted Successful")
      }else{
        alert("Something went wrong")
      }

    } catch (error) {
      console.log("Error", error)
    }
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = ev.target
    setFormData({...formData, [name]: value})
  }
  console.log(formData)

  const handleEdit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    const res = await axios.patch(`/api/maintenance/${editId}`, formData)

    if (res.status === 200) {
      alert("Maintenance Updated")
      setEdit(false)
    }else{
      alert("Error Updating Maintenance")
    }

  }

  return (
    <div className="">
      <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
        {maintenanceStats.map((stat) => (
          <Card className=" mt-4" key={stat.title}>
            <CardHeader className=" flex items-center justify-between">
              <CardTitle>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent className=" pb-4">
              <p className={`${stat.textColor} font-bold text-2xl`}>
                {stat.value}
              </p>
              <p className="text-gray-400">{stat.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Maintenance Tasks Table */}
      <div className=" mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Maintenance</CardTitle>
            <CardDescription>
              Upcoming Maintenance Service for your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle Plate</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Map through your maintenance tasks and create a row for each */}
                {maintenance.map((task) => (
                  <TableRow key={task._id}>
                    <TableHead>{task.vehiclePlateNo}</TableHead>
                    <TableHead>{task.serviceType}</TableHead>
                    <TableHead>
                      {new Date(task.scheduledDate).toLocaleDateString()}
                    </TableHead>
                    <TableHead>
                      {new Date(task.nextServiceDate).toLocaleDateString()}
                    </TableHead>
                    <TableHead>${task.estimatedCost}</TableHead>
                    <TableHead className=" capitalize">
                      {task.priority}
                    </TableHead>
                    <TableHead>
                      {new Date(task.scheduledDate) > new Date() ? (
                        <span className=" text-yellow-500">Pending</span>
                      ) : (
                        <span className=" text-green-500">Completed</span>
                      )}
                    </TableHead>
                    <TableHead>
                      <span className=" flex gap-1 items-center">
                        {/* <button className=" text-blue-500 underline">
                          <Eye />
                        </button> */}
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className=" text-gray-700 underline"
                          onClick={() => {
                            setEdit(true);
                            setEditId(task._id);
                          }}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className=" text-destructive text-sm underline"
                          onClick={() => handleDelete(task._id)}
                        >
                          <Trash2 />
                        </Button>
                      </span>
                    </TableHead>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog open={edit} onOpenChange={() => setEdit(!edit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Maintenance with ID {editId}</DialogTitle>
          </DialogHeader>
          {maintenance.map(
            (item) =>
              item._id === editId && (
                <form key={item._id} className=" flex flex-col gap-4 space-y-4" onSubmit={handleEdit}>
                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <label htmlFor="vehiclePlateNo">Vehicle Plate No.</label>

                      <Select
                        name="vehiclePlateNo"
                        value={formData.vehiclePlateNo || item.vehiclePlateNo}
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
                            <SelectItem value="">
                              No Vehicles Available
                            </SelectItem>
                          ) : (
                            vehicles.map((vehicle) => (
                              <SelectItem
                                key={vehicle._id}
                                value={vehicle.plateNumber}
                              >
                                {vehicle.plateNumber} - {vehicle.make}{" "}
                                {vehicle.model} ({vehicle.year})
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
                        value={formData.serviceType || item.serviceType}
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
                          <SelectItem value="tireRotation">
                            Tire Rotation
                          </SelectItem>
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
                        value={formData.scheduledDate || (new Date(item.scheduledDate).toISOString().split("T")[0])}
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
                        value={formData.nextServiceDate || (new Date(item.nextServiceDate).toISOString().split("T")[0])}
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
                        value={formData.estimatedCost || item.estimatedCost}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="">
                      <label htmlFor="priority">Priority</label>
                      <Select
                        name="priority"
                        value={formData.priority || item.priority}
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
                      value={formData.note || item.note}
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
              )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllMaintenance;
