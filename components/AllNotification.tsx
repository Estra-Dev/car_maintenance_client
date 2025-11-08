"use client"

import { AlertTriangle, Bell, CheckCircle, Clock, MapPinIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import axios from 'axios';

interface Notification {
  _id: string;
  dueDate?: string; // Optional due date for action required notifications
  type: "info" | "warning" | "error";
  title: string;
  message: string;
  vehicle: string;
  createdAt: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  
}

const AllNotification = () => {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "actionRequired">("all");
  const [read, setRead] = useState(false)

  const unReadNotifications = notifications.filter(noti => !noti.read)
  const actionRequiredNotifications = notifications.filter(noti => noti.dueDate && noti.dueDate <= new Date(Date.now() + 7*24*60*60*1000).toISOString())
  const thisWeekNotifications = notifications.filter(noti => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Set to Monday
    startOfWeek.setHours(0, 0, 0, 0); // Start of the day
    return new Date(noti.createdAt) >= startOfWeek;
    
  })


  const notificationStat = [
    {
      title: "Total Notifications",
      value: notifications.length,
      description: "All Notification.",
      icon: <Bell className=" h-4 w-4 text-muted-foreground" />,
      color: "text-gray-500",
    },
    {
      title: "Unread Notifications",
      value: unReadNotifications.length,
      description: "Needs Attention",
      icon: <MapPinIcon className=" h-4 w-4 text-muted-foreground" />,
      color: "text-purple-600",
    },
    {
      title: "Action Required",
      value: actionRequiredNotifications.length.toString(),
      description: "Urgent Issues",
      icon: <AlertTriangle className=" h-4 w-4 text-muted-foreground" />,
      color: "text-destructive",
    },
    {
      title: "This Week",
      value: thisWeekNotifications.length.toString(),
      description: "Recent activity",
      icon: <Clock className=" h-4 w-4 text-muted-foreground" />,
      color: "text-gray-500",
    },
  ];

  const getNotifications = async () => {
    try {
      const response = await axios('/api/notifications'); // Replace with your API endpoint
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await axios.patch(`/api/notifications/${id}/read`)
      if (res.status === 200 ) {
        // console.log("Noti read")
        setRead(true)
      }
    } catch (error) {
      console.log("Error Reading", error)
    }
  }

  useEffect(() => {
    getNotifications()
  }, [])

  const deleteNotification = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this?")) {
        return
      }

      const res = await axios.delete(`/api/notifications/${id}`, {
        headers: {"Content-Type": "Application/json"}
      })
      if (res.status === 200) {
        alert("Deleted Successfully")
        getNotifications()
      }
    } catch (error) {
      console.log("Error Deleting", error)
    }
  }

  return (
    <div className=" w-full">
      {/* Stat overview */}
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
        {notificationStat.map((stat, index) => (
          <Card className=" p-4 rounded-md border" key={index}>
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
              <p className=" text-sm text-muted-foreground font-medium">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>
              Notifications {/*({thisWeekNotifications.length.toString()})*/}
            </CardTitle>
            <CardDescription>
              Your Vehicle management alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className=" text-center text-sm text-muted-foreground py-10">
                  No notifications available.
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification._id || index}
                    className="p-4 border rounded-lg"
                  >
                    
                    <div className="flex justify-end items-center gap-2">
                      {/* {!notification.isRead && (
                    )} */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification._id)}
                        disabled={notification.read}
                      >
                        <CheckCircle className={`h-4 w-4 font-bold ${notification.read === true ? "text-lime-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium text-sm `}>
                              {notification.type}
                            </h3>
                            
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>
                              
                            </span>
                            
                          </div>
                        </div>
                        
                      </div>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AllNotification
