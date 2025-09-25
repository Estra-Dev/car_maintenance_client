"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import axios from "axios";

import { Bell, Car, File, LayoutDashboardIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Notification {
  id: string;
  dueDate?: string; // Optional due date for action required notifications
  type: "info" | "warning" | "error";
  title: string;
  message: string;
  vehicle: string;
  createdAt: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const SideBar = () => {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unReadNotifications = notifications.filter((noti) => !noti.read);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    { label: "Vehicles", href: "/vehicles", icon: Car },
    { label: "Maintenance", href: "/maintenance", icon: Settings },
    { label: "Documents", href: "/documents", icon: File },
    { label: "Notifications", href: "/notifications", icon: Bell , badge: unReadNotifications.length },
  ];

  const pathName = usePathname();

  const getNotifications = async () => {
    try {
      const response = await axios("/api/notifications"); // Replace with your API endpoint
      setNotifications(response.data);
      console.log("res", response);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className=" w-20 md:w-64 h-full p-4 border-r border-gray-100 bg-white/40 backdrop-blur-md fixed left-0 top-0 mt-24">
      <SignedOut>
        <div className="">

        </div>
      </SignedOut>
      <SignedIn>

      <ul className=" flex flex-col gap-8 justify-center items-center ">
        {navItems.map((item) => {
          const isActive = pathName === item.href;
          const IconItem = item.icon;

          return (
            <li key={item.label} className=" w-full">
              <Link
                href={item.href}
                className={` text-gray-800 font-medium text-sm flex justify-center gap-2 items-center bg-lime-500/20 rounded-md p-2 w-full hover:bg-lime-500/50 transition ${
                  isActive ? "bg-lime-500/50" : ""
                } relative`}
              >
                <IconItem />
                <span className="ml-2 hidden md:block">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className=" ml-auto absolute top-2 right-1 p-1 text-[10px] md:text-xs font-bold leading-none text-white bg-red-600/70 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      </SignedIn>
    </div>
  );
};

export default SideBar;
