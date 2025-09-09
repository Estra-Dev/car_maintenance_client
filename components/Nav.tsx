"use client";

import Image from "next/image";
import React from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Nav = () => {
  const { user } = useUser();
  console.log("user", user);

  return (
    <nav className=" w-full flex justify-between items-center gap-8 p-4 border-b border-gray-100 bg-transparent backdrop-blur-md fixed top-0 left-0 z-50">
      {/* logo */}
      <div className=" w-60">
        <div className=" w-16 ">
          <Image
            width={200}
            height={200}
            src="/logo.png"
            alt="Logo"
            className="object-cover w-full h-full"
          />
        </div>
        <p className=" text-xs text-gray-600">
          Car Maintenance & Document Tracking
        </p>
      </div>
      <ul className=" flex gap-4 justify-end items-center px-3">
        <SignedOut>
          <Link
            href={"/sign-in"}
            className=" font-medium text-white hover:bg-lime-500/70 text-xs bg-lime-500 p-1.5 rounded-md"
          >
            Sign In
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ul>
    </nav>
  );
};

export default Nav;
