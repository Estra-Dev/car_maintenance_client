import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";


export default function Home() {
  return (
    <div className=" *:min-h-screen *:bg-background/95">
      <SignedOut>
        <div className=" flex flex-col md:flex-row justify-center gap-2.5 items-center w-full h-screen px-3">
          <p className=" text-2xl font-bold text-gray-500 text-center">
            <span className=" text-lime-500">Welcome to</span> IKOSH Car
            Maintenance App
          </p>
          <Button className=" bg-lime-500">
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}
