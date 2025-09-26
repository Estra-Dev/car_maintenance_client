"use client";

import { useAuth } from "@clerk/nextjs";
import Loader from "./Loader";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader />;
  }

  return <>{children}</>;
}
