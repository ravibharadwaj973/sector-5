"use client";
import React from "react";
import "./globals.css"
import { useRouter } from "next/router";

const Welcome = () => {
  const router=useRouter();
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bharadwaj Web
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          🚀 Welcome to your application!
        </p>
        <button onClick={()=>router.push(`http://localhost:3000/login`)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
