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

const AllMaintenance = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);

  const maintenanceStats = [
    {
      title: "Upcoming Maintenance",
      icon: <Clock className=" text-foreground w-4 h-4" />,
      value: 3,
      text: "Next 30 Days",
      textColor: "text-purple-500",
    },
    {
      title: "In Progress",
      icon: <AlertOctagon className=" text-foreground w-4 h-4" />,
      value: 1,
      text: "Ongoing",
      textColor: "text-gray-500",
    },
    {
      title: "Completed this month",
      icon: <CheckCircle className=" text-foreground w-4 h-4" />,
      value: 3,
      text: "Last 30 Days",
      textColor: "text-gray-500",
    },
    {
      title: "Total Cost",
      icon: <DollarSign className=" text-foreground w-4 h-4" />,
      value: 300,
      text: "This month",
      textColor: "text-gray-500",
    },
  ];

  const allMaintenance = async () => {
    try {
      const res = await fetch("/api/maintenance/allMaintenance");
      const data = await res.json();
      setMaintenance(data.maintenances);
      console.log("maintenance data", data);
    } catch (error) {
      console.log("error fetching maintenance data", error);
    }
  };

  useEffect(() => {
    allMaintenance();
  }, []);

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
                      <span className=" flex gap-4 items-center">
                        <button className=" text-blue-500 underline">
                          <Eye />
                        </button>
                        <button className=" text-blue-500 underline">
                          <Edit />
                        </button>
                        <button className=" text-blue-500 underline">
                          <Trash2 />
                        </button>
                      </span>
                    </TableHead>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllMaintenance;
