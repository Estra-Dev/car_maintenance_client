"use client";

import { SignedIn } from "@clerk/nextjs";

import { Bell, Car, File, LayoutDashboardIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBar = () => {
  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboardIcon },
    { label: "Vehicles", href: "/vehicles", icon: Car },
    { label: "Maintenance", href: "/maintenance", icon: Settings },
    { label: "Documents", href: "/documents", icon: File },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ];

  const pathName = usePathname();

  return (
    <div className=" w-20 md:w-64 h-full p-4 border-r border-gray-100 bg-white/40 backdrop-blur-md fixed left-0 top-0 mt-24">
      <ul className=" flex flex-col gap-8 justify-center items-center ">
        {navItems.map((item) => {
          const isActive = pathName === item.href;
          const IconItem = item.icon;

          return (
            <li key={item.label} className=" w-full">
              <Link
                href={item.href}
                className={` text-gray-800 font-medium text-sm flex justify-center gap-2 items-center bg-lime-500/30 rounded-md p-2 w-full hover:bg-lime-500/50 transition ${
                  isActive ? "bg-lime-500/50" : ""
                }`}
              >
                <IconItem />
                <span className="ml-2 hidden md:block">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
