"use client"

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Car,
  Clock,
  Dot,
  File,
  Wrench,
} from "lucide-react";
import { Progress } from "./ui/progress";
import Alerts from "./Alerts";
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
interface DocumentTask {
  _id: string;
  vehicle: string;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  documentNumber: string;
  issuingAuth: string;
  reminderDayBeforeExpiry: string;
}

const Dashboard = () => {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);
  const [documents, setDocuments] = useState<DocumentTask[]>([]);
  const [almosDueMaintenance, setAlmosDueMaintenance] = useState<MaintenanceTask[]>([]);
  const [expiringSoonDocuments, setExpiringSoonDocuments] = useState<DocumentTask[]>([]);

  const activeVehicles = vehicles.filter(v => v.status === "active").length;
  // const inMaintenanceVehicles = vehicles.filter(v => v.status === "in maintenance").length;
  const serviceDueVehicles = vehicles.filter(v => v.status === "service due").length;
  const expiringDocuments = documents.filter(
    (d) => d.status === "expired"
  ).length;

  const vehicleHealth = () => {
    if (vehicles.length === 0) return 0;

    let healthyCount = 0;
    vehicles.forEach((vehicle) => {
      if (vehicle.status === "active") {
        healthyCount += 100;
      }
      if (vehicle.status === "in maintenance") {
        healthyCount += 50;
      }
      if (vehicle.status === "service due") {
        healthyCount += 15;
      }
    });

    return Math.round(healthyCount / vehicles.length);
  }
  
  // fleet stat
  const fleetStats = [
    {
      title: "Total Vehicles",
      value: vehicles.length.toString(),
      description: `${activeVehicles} Active, ${
        serviceDueVehicles > 1
          ? `{serviceDueVehicles} are`
          : `${serviceDueVehicles < 1 ? "non is" : "1 is"}`
      } Due for Service.`,
      icon: <Car className=" h-4 w-4 text-muted-foreground" />,
      color: "text-bg-gray-500",
    },
    {
      title: "Upcoming Services",
      value: almosDueMaintenance.length.toString(),
      description: "In few Days",
      icon: <Wrench className=" h-4 w-4 text-muted-foreground" />,
      color: "text-purple-600",
    },
    {
      title: "Document Alerts",
      value: expiringDocuments,
      description: `${expiringSoonDocuments.length.toString()} Expiring Soon`,
      icon: <File className=" h-4 w-4 text-muted-foreground" />,
      color: "text-destructive",
    },
    {
      title: "Vehicles Health",
      value: `${vehicleHealth()}%`,
      description: "Overall Fleet Status",
      icon: <Clock className=" h-4 w-4 text-muted-foreground" />,
      progressValue: vehicleHealth(),
      color: "text-bg-gray-500",
    },
  ];

  const allVehicles = async () => {
    try {
      const response = await axios.get("/api/vehicles/vehicles");
      setVehicles(response.data.vehicles);

      // const today = new Date();
      // const expiringSoonVehicles = response.data.vehicles.filter((vehicle: Vehicle) => {
      //   const nextServiceDate = new Date(vehicle.nextService);
      //   const timeDiff = nextServiceDate.getTime() - today.getTime();
      //   const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      //   return daysDiff > 0 && daysDiff <= 30; // Vehicles with service due in the next 30 days
      // });

      // setExpiringVehicles(expiringSoonVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const allMaintenance = async () => {
    try {
      const res = await fetch("/api/maintenance/allMaintenance");
      const data = await res.json();
      setMaintenance(data.maintenances);

      const today = new Date();
      const upcomingMaintenance = data.maintenances.filter((task: MaintenanceTask) => {
        const serviceDate = new Date(task.nextServiceDate);
        const timeDiff = serviceDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff > 0 && daysDiff <= 30; // Maintenance tasks due in the next 30 days
      });

      setAlmosDueMaintenance(upcomingMaintenance);
    } catch (error) {
      console.log("error fetching maintenance data", error);
    }
  };

  const allDocuments = async () => {
    try {
      const response = await axios.get("/api/documents/allDocuments");
      setDocuments(response.data.documents);

      const today = new Date();
      const expiringSoonDocuments = response.data.documents.filter((doc: DocumentTask) => {
        const expiryDate = new Date(doc.expiryDate);
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff > 0 && daysDiff <= 30; // Documents expiring in the next 30 days
      });

      setExpiringSoonDocuments(expiringSoonDocuments);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  console.log("cars", vehicles);
  useEffect(() => {
    allVehicles();
    allMaintenance()
    allDocuments()
  }, []);

  return (
    <div className=" ml-20 md:ml-64 p-4 mt-24">
      {/* Alert Banner */}
      <Alerts />

      {/* Stat overview */}
      <div className="">
        <p className=" text-sm text-muted-foreground font-medium">
          Here is a quick overview of your vehicle and document status.
        </p>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
          {fleetStats.map((stat, index) => (
            <Card className=" p-4 rounded-md border bg-lime-500/20" key={index}>
              <CardHeader className=" flex flex-row justify-between items-center space-y-0 pb-2">
                <CardTitle className=" text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <h3 className={`${stat.color} font-bold text-2xl`}>
                  {stat.value}
                </h3>

                {stat.progressValue && (
                  <Progress
                    value={stat.progressValue}
                    className=" h-2 mt-2 bg-muted-foreground"
                  />
                )}
                <p className=" text-sm text-muted-foreground font-medium">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Vehicle Status */}
        <Card className=" md:px-4 py-4 rounded-md border bg-lime-500/20">
          <CardHeader className=" flex flex-col md:flex-row justify-between md:items-center space-y-0 pb-2">
            <CardTitle className=" text-sm font-medium ">
              Vehicle Status
            </CardTitle>
            <CardDescription>Current Status of your Vehicles</CardDescription>
          </CardHeader>
          {vehicles.length === 0 ? (
            <CardContent className=" flex justify-center items-center h-full">
              <p className=" text-2xl text-muted-foreground font-medium">
                No vehicles found. Please add vehicles to see their status.
              </p>
            </CardContent>
          ) : (
            vehicles.map((vehicle) => (
              <CardContent key={vehicle._id}>
                <div className=" space-y-4">
                  <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                    <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                      <Car className=" w-5 h-5" />
                      <div className="">
                        <p className=" font-medium text-[13px] md:text-sm">
                          {/* Toyota Camry (2022) */}
                          {vehicle.make} ({vehicle.model})
                        </p>
                        <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                          {/* ABC-123 */}
                          {vehicle.plateNumber}
                        </p>
                      </div>
                    </div>
                    <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                      <Button
                        variant={
                          vehicle.status === "active"
                            ? "default"
                            : vehicle.status === "service due"
                            ? "destructive"
                            : "secondary"
                        }
                        className=" hidden md:block text-white text-sm py-1 px-2 rounded-md"
                      >
                        {vehicle.status === "active"
                          ? "Active"
                          : vehicle.status === "service due"
                          ? "Service Due"
                          : "In Maintenance"}
                      </Button>

                      <Dot className={` animate-bounce md:hidden w-20 h-20 ${
                        vehicle.status === "active"
                        ? "text-lime-500"
                        : vehicle.status === "service due"
                        ? "text-destructive"
                        : " text-foreground"
                      }`} />                      
                    </div>
                  </div>
                </div>
              </CardContent>
            ))
          )}
        </Card>

        {/* Upcoming Services */}
        <Card className=" md:px-4 py-4 rounded-md border bg-lime-500/20">
          <CardHeader className=" flex flex-col md:flex-row justify-between md:items-center space-y-0 pb-2">
            <CardTitle className=" text-sm font-medium ">
              Upcoming Services
            </CardTitle>
            <CardDescription>
              Scheduled maintenance and inspection
            </CardDescription>
          </CardHeader>

          {maintenance.length === 0 ? (
            <CardContent className=" flex justify-center items-center h-full">
              <p className=" text-2xl text-muted-foreground font-medium">
                No Scheduled Maintenance. Please schedule vehicle Maintenance to
                see their status.
              </p>
            </CardContent>
          ) : (
            almosDueMaintenance.map((item) => (
              
              <CardContent key={item._id}>
                <div className=" space-y-4">
                  <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                    <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                      <Car className=" w-5 h-5" />
                      <div className="">
                        <p className=" font-medium text-[13px] md:text-sm">
                          {/* Toyota Camry (2022) */}
                          {item.serviceType}
                        </p>
                        <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                          {item.vehiclePlateNo} - Next Service on{" "}
                          {item.nextServiceDate}
                        </p>
                      </div>
                    </div>
                    <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                      <Button
                        variant={
                          item.priority === "low"
                            ? "default"
                            : item.priority === "high"
                            ? "destructive"
                            : "secondary"
                        }
                        className={` hidden md:block ${
                          item.priority === "medium"
                            ? "text-gray-700"
                            : "text-white"
                        } text-sm py-1 px-2 rounded-md`}
                      >
                        {item.priority === "low"
                          ? "Low"
                          : item.priority === "high"
                          ? "High"
                          : "Medium"}
                      </Button>
                      <button>
                        <Dot
                          className={` animate-bounce md:hidden ${
                            item.priority === "low"
                              ? "text-lime-500"
                              : item.priority === "high"
                              ? "text-destructive"
                              : "text-gray-700"
                          }  w-20 h-20`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            ))
          )}
        </Card>
      </div>
      <div className=" mt-8">
        <Card className=" bg-lime-500/10">
          <CardHeader>
            <CardTitle>Document Expiration Alert</CardTitle>
            <CardDescription>
              Keep Track of important document renewals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
              {documents.length === 0 ? (
                <p className=" text-muted-foreground font-medium">
                  No Document attached. Please attach vehicle Documents to see
                  their
                </p>
              ) : (
                documents.map((doc) => (
                  <div
                    className={` border ${
                      doc.status === "active"
                        ? " bg-purple-500/5 border-purple-500"
                        : doc.status === "expired"
                        ? "bg-destructive/5 border-destructive"
                        : " bg-black/5 border-black/70"
                    }  p-4 rounded-md font-medium`}
                    key={doc._id}
                  >
                    <div className=" flex justify-start items-center gap-2">
                      <File
                        className={` w-5 h-5 text-destructive ${
                          doc.status === "active"
                            ? " text-purple-500"
                            : doc.status === "expired"
                            ? "text-destructive "
                            : " text-black"
                        }`}
                      />
                      <p
                        className={` text-sm font-medium ${
                          doc.status === "active"
                            ? " bg-lime-500"
                            : doc.status === "expired"
                            ? "bg-destructive"
                            : " bg-black/85"
                        } text-white py-1 px-2 rounded-md`}
                      >
                        {doc.status === "active"
                          ? "Active"
                          : doc.status === "expired"
                          ? "Expired"
                          : "Expiring Soon"}
                      </p>
                    </div>
                    <h1 className=" text-lg font-bold text-gray-800 mt-2">
                      {doc.documentType}
                    </h1>
                    <p className=" text-muted-foreground text-sm font-medium">
                      {doc.vehicle} {`(${doc.documentNumber})`}
                    </p>
                    <p className=" text-muted-foreground text-sm font-medium">
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
