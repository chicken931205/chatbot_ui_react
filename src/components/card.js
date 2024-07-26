import React from "react";

export default function Card({ title, content }) {
  return (
    <div className="p-8 sf-pro-display">
      <div className="flex items-center">
        <img height={50} width={50} src="/assets/images/icon.png"></img>
        <p className="text-black-500 font-sf-pro-display pl-2 text-[24px] leading-[30px] font-500">
          {title}
        </p>
      </div>
      <div className="mt-1">
        <p className="font-400 font-sf-pro-display text-[16px] leading-[24px]">
          {content}
        </p>
      </div>
    </div>
  );
}
