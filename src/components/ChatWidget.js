import React from "react";
import ChatPage from "../pages/ChatPage/ChatPage";

export default function ChatWidget({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className={`fixed bottom-[90px] right-4 w-[420px] bg-white rounded shadow overflow-hidden chat-widget ${determineHeight()}`}>
          <ChatPage onClose={onClose} />
        </div>
      )}
    </>
  );
}

function determineHeight() {
  // Using a function to determine the height based on screen size
  const height = window.innerHeight;
  if (height <= 600) {
    return "h-[calc(100vh-120px)]"; // For screens smaller than 600px
  } else if (height <= 800) {
    return "h-[calc(100vh-140px)]"; // For screens smaller than 800px
  }
  return "h-[calc(100vh-180px)]"; // Default height
}