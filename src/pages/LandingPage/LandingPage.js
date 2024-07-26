import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/card";
import { Bars3Icon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import ChatWidget from "../../components/ChatWidget";

export default function LandingPage() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatWidget = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleChatWidgetClose = () => {
    setIsChatOpen(false);
  };

  const data = [
    {
      id: 1,
      title: "Tailored Information, Right When You Need It",
      content:
        "Instant access to the latest business insights and financial options tailored for your growth, all through our AI chatbot.",
    },
    {
      id: 2,
      title: "Streamline Your Operations with AI-Powered Assistance",
      content:
        "Simplify complex tasks with our AI chatbot, ensuring efficient, compliant operations and more time for what's important.",
    },
    {
      id: 3,
      title: "Boost Your Business by Connecting with Right People",
      content:
        "Connect smarter and grow your network with our AI chatbot, your portal to new opportunities and collaborative potential.",
    },
  ];

  return (
    <div className="w-full bg-white">
      <div className="bg-[#171B34] bg-opacity-90">
        <div className="absolute right-8 top-10">
          <Bars3Icon className="text-gray-400 w-[30px] text-[#FFFFFF] right-[20px] active:text-gray-700" />
        </div>
        <div className="pt-16">
          <img
            className="w-[282px] h-[270px] mx-auto"
            src="/assets/images/landing.png"
            alt="Landing"
          />
        </div>
        <div className="px-6">
          <p className="text-white mt-4 text-left xs:text-center font-semibold text-4xl leading-11">
            The AI Chatbot for Abu Dhabi's entrepreneurial landscape
          </p>
        </div>
        <div className="px-6 xs:flex xs:justify-center">
          {isMobile ? (
            <Link to="/chat">
              <button className="bg-[#FCC42A] mt-12 mb-14 px-[36px] py-[10px] rounded-[25px]">
                <p className="font-bold text-black text-[20px] leading-[30px] text-center">
                  Explore AI Chatbot
                </p>
              </button>
            </Link>
          ) : (
            <button
              className="bg-[#FCC42A] mt-12 mb-14 px-[36px] py-[10px] rounded-[25px]"
              onClick={toggleChatWidget}
            >
              <p className="font-bold text-black text-[20px] leading-[30px] text-center">
                Explore AI Chatbot
              </p>
            </button>
          )}
        </div>
      </div>
      <div>
        {data.map((item) => (
          <div key={item.id} className="mt-3">
            <Card title={item.title} content={item.content} />
          </div>
        ))}
      </div>
      {!isMobile && (
        <>
          <ChatWidget isOpen={isChatOpen} onClose={handleChatWidgetClose} />
          <div
            className="fixed bottom-0 right-4 w-[60px] h-[60px] bg-[#492B65] rounded-full flex items-center justify-center cursor-pointer mb-4"
            onClick={toggleChatWidget}
          >
            {isChatOpen ? (
              <ChevronDownIcon className="h-8 w-8 text-white" />
            ) : (
              <ChevronUpIcon className="h-8 w-8 text-white" />
            )}
          </div>
        </>
      )}
    </div>
  );
}