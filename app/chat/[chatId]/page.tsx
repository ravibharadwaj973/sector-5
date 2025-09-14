"use client";
import { use } from "react";
import React, { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import Chatform from "@/components/chatform";
import "../../globals.css";
import { useRouter } from "next/navigation";

export default function ChatId({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params); // unwrap params

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const  router=useRouter()
 
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/convertation/${chatId}`
        );
        if (!res.ok) throw new Error("Failed to fetch chat");

        const result = await res.json();
        setDetail(result.chat);
        const handleUserJoined = (message: string) => {
          setMessages((prev) => [...prev, { sender: "system", message }]);
        };

        const handleMessage = (data: { sender: string; message: string }) => {
           
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (
              lastMsg &&
              lastMsg.sender === data.sender &&
              lastMsg.message === data.message
            ) {
              return prev;  
            }
            return [...prev, data];
          });
        };

        socket.on("user-joined", handleUserJoined);
        socket.on("message", handleMessage);

        return () => {
          socket.off("user-joined", handleUserJoined);
          socket.off("message", handleMessage);
        };
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);

  useEffect(() => {
    const stored = localStorage.getItem("UserDetails");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);
      setUserName(parsed.username);
      setRoom(chatId);
    }
  }, [chatId]);
 

  useEffect(() => {
    if (room && userName && !joined) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  }, [room, userName, joined]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!detail) return <p>No chat found</p>;

  const otherUser = detail.participants.find(
    (p: any) => p._id !== currentUser?._id
  );

  // ✅ Don’t push message twice: only emit to server
  const handleSendMessage = (message: string) => {
    const newMsg = { room, message, sender: userName };
     setMessages((prev) => [...prev, newMsg]);
    socket.emit("send-message", newMsg);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat Room</h1>

      {otherUser ? (
        <div className="mt-4">
          <p className="font-semibold">Talking to: {otherUser.username}</p>
        </div>
      ) : (
        <p>No other participant found</p>
      )}

      <div className="w-full max-w-md h-[80vh] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 text-lg font-semibold text-center">
          Room: {otherUser?.username || "Unknown"}
        </div>
         <div onClick={()=>router.push(`http://localhost:3000/vedioSection/${chatId}`)}>
        vedioCall
      </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">No messages yet...</p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === userName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                  msg.sender === userName
                    ? "bg-blue-500 text-white rounded-br-none"
                    : msg.sender === "system"
                    ? "bg-yellow-200 text-gray-800 text-center"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.sender !== "system" && (
                  <span className="block font-semibold text-xs mb-1">
                    {msg.sender}
                  </span>
                )}
               <span>
            {typeof msg.message === "string"
              ? msg.message
              : JSON.stringify(msg.message)}
          </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-300 p-3">
          <Chatform onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
