import React from "react";
interface ChatMessageProps  {
    sender: string;
    message: string;
    timestamp: Date;   
    OwnMessage: boolean;

}

const ChatMessage = ({ sender, message, timestamp, OwnMessage }: ChatMessageProps) => {
    const isSystemMessage = sender === "system";

  return (
    <div
      className={` flex ${
        isSystemMessage
          ? "justify-center"
          : OwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-3`}
    >
      <div
        className={` max-w-xs 
            ${
              isSystemMessage
                ? "bg-gray-300 text-black "
                : OwnMessage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }
            rounded-lg p-3
            `}
      >
        {!isSystemMessage && <p className=" text-sm font-bold">{sender}</p>}
      </div>
    </div>
  );
};

export default ChatMessage;
