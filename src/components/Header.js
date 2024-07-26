import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  EllipsisVerticalIcon,
  XMarkIcon,
  LinkIcon,
} from "@heroicons/react/20/solid";

import './css/header.css'

export default function Header({ title, clearHistory, onClose }) {

  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(!open)
  const handleClearHistory = () => {
    setOpen(false)
    if(clearHistory) clearHistory()
  }

  return (<>
    <header className={`app-header font-medium sf-pro-display bg-[#492B65] ${!title ? 'h-[230px]' : 'h-[100px]'}`}>
      <div className={`flex ${!title ? 'py-5' : 'mt-4 pt-3'}`}>
        <div className="w-[80%] pt-[0px] pl-8 text-white font-semibold text-lef">
          <p className={`${!title ? "text-[44px]" : "text-[22px] pt-1"} text-left leading-tight`}>{!title ? "AI Business" : "AI Business Advisor"}</p>
          {!title && <p className="text-[44px] leading-tight text-left">Advisor</p>}
          {!title && <div className="flex pt-4">
            <LinkIcon className="w-[18px] text-gray-200" />{" "}
            <a href="#" className="text-[14px] ml-[4px] text-gray-200 underline font-medium">
              About this chatbot
            </a>
          </div>}
        </div>
        <div className={`w-[20%] flex items-start justify-end ${!title ? 'mt-4' : 'mt-1 mb-[5px]'} mr-6`}>
          <div className="flex justify-center">
            <div className="dropdown relative">
              <EllipsisVerticalIcon className="text-white w-[28px] mr-5" onClick={handleOpen}></EllipsisVerticalIcon>
              {
                open && <ul className="menu text-[17px] rounded-lg">
                  <li className="menu-item text-black font-medium">
                    <button style={{textAlign: 'center'}} onClick={handleClearHistory}>Clear conversation</button>
                  </li>
                </ul>
              }
            </div>
            {onClose ? (
              <XMarkIcon className="text-white w-[28px] cursor-pointer" onClick={onClose}></XMarkIcon>
            ) : (
              <Link to="/">
                <XMarkIcon className="text-white w-[28px] cursor-pointer"></XMarkIcon>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
    {title && <div className={`bg-[#492B65] header-reverse-anim z-[9999]`}></div>}
  </>
  );
}

