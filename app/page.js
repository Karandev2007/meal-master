"use client";

import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/home-bg.jpg')",
      }}
    >
      <img
        src="/logo.png"
        alt="Meal Master Logo"
        className="w-50 h-30 mb-4"
      />

      <Button
        type="button"
        color="dark"
        onClick={() => router.push("/maker")}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Get Started
      </Button>
    </div>
  );
}