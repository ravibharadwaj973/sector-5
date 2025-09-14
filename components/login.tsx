"use client";
import Login from "@/components/login";
import Register from "@/components/register";
import React, { useState } from "react";
import "../app/globals.css";
import { useRouter } from "next/navigation";

const Page = ({ setLogin }) => {
  const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router=useRouter();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering:", { username, password });
    let response = await fetch("/api/user", {
      method: "GET",
      body: JSON.stringify({ username, password }),
    });
  const data = await response.json();
      console.log("✅ Registration success:", data);

      router.push('/')
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="name"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Donot have Account
          <button
            onClick={() => setLogin(false)}
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Page;
