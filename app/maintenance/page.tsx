import AddSchedule from "@/components/AddSchedule";
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
import { AlertOctagon, CheckCircle, Clock, DollarSign } from "lucide-react";
import React from "react";

const page = () => {
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

  return (
    <div className="p-4 ml-20 md:ml-64 mt-24 min-h-screen bg-background">
      <AddSchedule />
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
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Map through your maintenance tasks and create a row for each */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
