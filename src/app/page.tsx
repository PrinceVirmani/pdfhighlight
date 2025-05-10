"use client";

import LeftSide from "@/Components/LeftSide";
import MidSection from "@/Components/MidSection";
import RightSide from "@/Components/RightSide";

export default function Home() {
  return (
    <main className="flex h-screen w-full p-4 gap-4 bg-gray-100">
      <LeftSide />
      <MidSection />
      <RightSide />
    </main>
  );
}
