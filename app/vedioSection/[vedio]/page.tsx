"use client"
import React, { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socketClient";

const Vedicall = ({ room }: { room: string }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }], 
    });
    setPeerConnection(pc);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    });
     
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
       
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { room, candidate: event.candidate });
      }
    };
    
    socket.on("offer", async (offer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { room, answer });
    });

    socket.on("answer", async (answer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE", err);
      }
    });
      return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      pc.close();
    };
  }, [room]);
  
   const startCall = async () => {
    if (!peerConnection) return;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", { room, offer });
  };

  return <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-48 h-36 bg-black rounded-lg" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-48 h-36 bg-black rounded-lg" />
      </div>
      <button
        onClick={startCall}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Start Call
      </button>
    </div>;
};

export default Vedicall;
