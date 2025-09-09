import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertTriangle,
  Calendar,
  Car,
  Clock,
  Dot,
  File,
  Wrench,
} from "lucide-react";
import { Progress } from "./ui/progress";

const Dashboard = () => {
  return (
    <div className=" ml-20 md:ml-64 p-4 mt-24">
      {/* Alert Banner */}
      <div className=" mb-8">
        <Card className=" bg-destructive/5 p-4 px-2 rounded-md border-destructive">
          <CardContent className=" pt-6">
            <div className=" flex gap-3 justify-start items-center">
              <AlertTriangle className=" h-10 w-10 text-destructive" />
              <div className="">
                <p className=" text-sm text-destructive font-medium">
                  Urgent Attention Required.
                </p>
                <p className=" text-sm text-muted-foreground font-medium">
                  3 Documents have expired and 8 vehicles are due for service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stat overview */}
      <div className="">
        <p className=" text-sm text-muted-foreground font-medium">
          Here is a quick overview of your vehicle and document status.
        </p>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
          <Card className=" p-4 rounded-md border bg-lime-500/20">
            <CardHeader className=" flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className=" text-sm font-medium ">
                Total Vehicles
              </CardTitle>
              <Car className=" h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <h3 className=" font-medium text-2xl">20</h3>
              <p className=" text-sm text-muted-foreground font-medium">
                12 Active, 8 in maintenance.
              </p>
            </CardContent>
          </Card>
          <Card className=" p-4 rounded-md border bg-lime-500/20">
            <CardHeader className=" flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className=" text-sm font-medium">
                Upcoming Services
              </CardTitle>
              <Wrench className=" h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <h3 className=" font-bold text-purple-600 text-2xl">8</h3>
              <p className=" text-sm text-muted-foreground font-medium">
                Next 30 Days
              </p>
            </CardContent>
          </Card>
          <Card className=" p-4 rounded-md border bg-lime-500/20">
            <CardHeader className=" flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className=" text-sm font-medium">
                Document Alerts
              </CardTitle>
              <File className=" h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <h3 className=" font-bold text-destructive text-2xl">3</h3>
              <p className=" text-sm text-muted-foreground font-medium">
                5 Expiring Soon
              </p>
            </CardContent>
          </Card>
          <Card className=" p-4 rounded-md border bg-lime-500/20">
            <CardHeader className=" flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className=" text-sm font-medium">
                Fleets Health
              </CardTitle>
              <Clock className=" h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <h3 className=" font-bold text-2xl">92%</h3>
              <Progress value={92} className=" mt-2" />
              <p className=" text-sm text-muted-foreground font-medium">
                Overall Fleet Status
              </p>
            </CardContent>
          </Card>
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
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Car className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Toyota Camry (2022)
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      ABC-123
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-lime-500 text-white text-sm py-1 px-2 rounded-md">
                    Active
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-lime-500 w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    Next: 15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Car className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Toyota Camry (2022)
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      ABC-123
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-destructive text-white text-sm py-1 px-2 rounded-md">
                    Service Due
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-destructive w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    Next: 15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Car className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Toyota Camry (2022)
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      ABC-123
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-muted-foreground text-white text-sm py-1 px-2 rounded-md">
                    In Maintenance
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-muted-foreground w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    Next: 15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
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
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Calendar className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Oil Change
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      Toyota Camry (ABC-123)
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-destructive text-white text-sm py-1 px-2 rounded-md">
                    High
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-destructive w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Calendar className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Brake Inspection
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      Toyota Camry (ABC-123)
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-lime-500 text-white text-sm py-1 px-2 rounded-md">
                    Medium
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-lime-500 w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Calendar className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Tire Rotation
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      Toyota Camry (ABC-123)
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-muted-foreground text-white text-sm py-1 px-2 rounded-md">
                    Low
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-muted-foreground w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardContent>
            <div className=" space-y-4">
              <div className=" md:border flex justify-between items-center px-1 md:px-4 py-4 rounded-md">
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 md:items-center">
                  <Calendar className=" w-5 h-5" />
                  <div className="">
                    <p className=" font-medium text-[13px] md:text-sm">
                      Annual Inspection
                    </p>
                    <p className=" text-muted-foreground font-medium text-[13px] md:text-sm">
                      Toyota Camry (ABC-123)
                    </p>
                  </div>
                </div>
                <div className=" flex-1 flex flex-col justify-between gap-2 items-end">
                  <button className=" hidden md:block bg-destructive text-white text-sm py-1 px-2 rounded-md">
                    High
                  </button>
                  <button>
                    <Dot className=" animate-bounce md:hidden text-muted-foreground w-10 h-10" />
                  </button>
                  <p className=" mt-8 md:mt-0 text-right text-xs md:text-sm text-muted-foreground font-medium">
                    15/12/2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
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
              <div className=" border border-destructive bg-destructive/5 p-4 rounded-md font-medium">
                <div className=" flex justify-start items-center gap-2">
                  <File className=" w-5 h-5 text-destructive" />
                  <p className=" text-sm font-medium bg-destructive text-white py-1 px-2 rounded-md">
                    Expired
                  </p>
                </div>
                <h1 className=" text-lg font-bold text-gray-800 mt-2">
                  Registration
                </h1>
                <p className=" text-muted-foreground text-sm font-medium">
                  Toyota Camry (ABC-123)
                </p>
                <p className=" text-muted-foreground text-sm font-medium">
                  Expires: 15/12/2025
                </p>
              </div>
              <div className=" border border-purple-600 bg-purple-600/5 p-4 rounded-md font-medium">
                <div className=" flex justify-start items-center gap-2">
                  <File className=" w-5 h-5 text-purple-600" />
                  <p className=" text-sm font-medium bg-black text-white py-1 px-2 rounded-md">
                    Expiring Soon
                  </p>
                </div>
                <h1 className=" text-lg font-bold text-gray-800 mt-2">
                  Insurance
                </h1>
                <p className=" text-muted-foreground text-sm font-medium">
                  Toyota Camry (ABC-123)
                </p>
                <p className=" text-muted-foreground text-sm font-medium">
                  Expires: 15/12/2025
                </p>
              </div>
              <div className=" border border-purple-600 bg-purple-600/5 p-4 rounded-md font-medium">
                <div className=" flex justify-start items-center gap-2">
                  <File className=" w-5 h-5 text-purple-600" />
                  <p className=" text-sm font-medium bg-black text-white py-1 px-2 rounded-md">
                    Expiring Soon
                  </p>
                </div>
                <h1 className=" text-lg font-bold text-gray-800 mt-2">
                  Inspection Certificate
                </h1>
                <p className=" text-muted-foreground text-sm font-medium">
                  Toyota Camry (ABC-123)
                </p>
                <p className=" text-muted-foreground text-sm font-medium">
                  Expires: 15/12/2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
