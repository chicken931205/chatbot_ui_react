import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Exp({ addInfo, goToNext }) {
  const [alreadyHad, setAlreadyHad] = useState({ businessExp: null });

  const handleStep = () => {
    addInfo({ businessExp: alreadyHad });
    goToNext(2);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full text-black font-bold text-[16px] text-left">
        Please answer the questions below:
      </div>
      <div className="w-full text-black font-normal text-[15px] text-left mt-5 pt-2">
        Have you already set up a Business in Abu Dhabi?
      </div>
      <div className="flex justify-between text-[#0F0F0F] font-bold mt-3">
        <button
          onClick={() => setAlreadyHad({ businessExp: true })}
          className={`rounded-l-lg w-[50%] py-3 px-5 mr-1 ${
            alreadyHad.businessExp === true ? 'bg-[#673A95] text-white' : 'bg-[#673A9522] hover:bg-[#673A95] hover:text-white'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setAlreadyHad({ businessExp: false })}
          className={`rounded-r-lg w-[50%] py-3 px-5 ${
            alreadyHad.businessExp === false ? 'bg-[#673A95] text-white' : 'bg-[#673A9522] hover:bg-[#673A95] hover:text-white'
          }`}
        >
          No
        </button>
      </div>
      <div className="my-auto"></div>
      <div className="mb-[90px] w-full h-[108px] border-t-2 p-4">
        <div className="w-full flex justify-end">
          <button
            className="rounded-[32px] border-2 border-[#673A95] text-[#673A95] px-3 py-2 mr-4"
            onClick={handleStep}
          >
            Skip
          </button>
          <button
            className="flex items-center w-[80px] rounded-[32px] border-2 border-[#673A95] text-[#fff] bg-[#673A95] px-3 py-2"
            onClick={handleStep}
          >
            Send{" "}
            <span className="flex items-center text-[22px] text-[#fff] w-[30px] h-[30px]">
              <ChevronRightIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}