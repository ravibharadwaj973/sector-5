"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

const Chat = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/Sub");
        if (!res.ok) throw new Error("Failed to fetch data");

        const resul = await res.json();
        setUsers(resul.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUser = async (otherUserId: string) => {
    try {
      const stored = localStorage.getItem("UserDetails");
      if (!stored) {
        alert("⚠️ You must be logged in first");
        return;
      }
      const currentUser = JSON.parse(stored);
      console.log(currentUser._id);
      const response = await fetch("http://localhost:3000/api/convertation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId1: currentUser._id,
          userId2: otherUserId,
        }),
      });
      const result = await response.json();
     console.log(result)
     console.log(result._id)
      router.push(`/chat/${result.conversation._id}`)
    } catch (err) {
      console.error("⚠️ Error starting conversation:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
     
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUser(user._id)}
            className="border-b py-2 cursor-pointer hover:bg-gray-100 hover:text-blue-900 transition"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
