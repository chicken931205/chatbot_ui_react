import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Hope({ addInfo, completeSurvey }) {
    const [industry, setIndustry] = useState({ name: 'Agriculture & Fishing' });
    const [funding, setFunding] = useState({ funding: null });

    const handleStep = (state) => {
        completeSurvey([{ name: industry.name }, { funding: funding.funding }]);
    };

    const handleChange = (e) => {
        setIndustry({ name: e.target.value });
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full text-black font-bold text-[16px] text-left">Please answer the questions below:</div>
            <div className="w-full text-black font-normal text-[15px] text-left mt-5 pt-2">What industry would you like to know more about?</div>
            <div className="flex justify-between text-[#0F0F0F] mt-3">
                <select className="p-3 rounded-sm" aria-placeholder="Select" onChange={handleChange}>
                    <option value={`Agriculture & Fishing`}>Agriculture & Fishing</option>
                    <option value={`Education`}>Education</option>
                    <option value={`Engineering & Construction`}>Engineering & Construction</option>
                    <option value={`F & B`}>F & B</option>
                    <option value={`Healthcare`}>Healthcare</option>
                    <option value={`ICT`}>ICT</option>
                    <option value={`Management & Consultancy`}>Management & Consultancy</option>
                    <option value={`Manufacturing`}>Manufacturing</option>
                    <option value={`Mining Related`}>Mining Related</option>
                    <option value={`Personal Services`}>Personal Services</option>
                    <option value={`Retail`}>Retail</option>
                    <option value={`Tourism`}>Tourism</option>
                </select>
            </div>
            <div className="w-full text-black font-normal text-[15px] text-left mt-5 pt-2">Are you planning to raise funding?</div>
            <div className="flex justify-between text-[#0F0F0F] font-bold mt-3">
                <button
                    onClick={() => setFunding({ funding: 'Yes' })}
                    className={`rounded-l-lg w-[33%] py-3 px-5 mr-1 ${
                        funding.funding === 'Yes' ? 'bg-[#673A95] text-white' : 'bg-[#673A9522] hover:bg-[#673A95] hover:text-white'
                    }`}
                >
                    Yes
                </button>
                <button
                    onClick={() => setFunding({ funding: 'No' })}
                    className={`w-[33%] py-3 px-5 mr-1 ${
                        funding.funding === 'No' ? 'bg-[#673A95] text-white' : 'bg-[#673A9522] hover:bg-[#673A95] hover:text-white'
                    }`}
                >
                    No
                </button>
                <button
                    onClick={() => setFunding({ funding: 'Not sure' })}
                    className={`rounded-r-lg w-[33%] py-3 px-5 ${
                        funding.funding === 'Not sure' ? 'bg-[#673A95] text-white' : 'bg-[#673A9522] hover:bg-[#673A95] hover:text-white'
                    }`}
                >
                    Not sure
                </button>
            </div>
            <div className="my-auto"></div>
            <div className="mb-[90px] w-full h-[108px] border-t-2 p-4">
                <div className="w-full flex justify-end">
                    <button className="rounded-[32px] border-2 border-[#673A95] text-[#673A95] px-3 py-2 mr-4" onClick={() => handleStep(false)}>Skip</button>
                    <button className="flex items-center w-[80px] rounded-[32px] border-2 border-[#673A95] text-[#fff] bg-[#673A95] px-3 py-2" onClick={() => handleStep(true)}>Send <span className="flex items-center text-[22px] text-[#fff] w-[30px] h-[30px]"><ChevronRightIcon /></span></button>
                </div>
            </div>
        </div>
    );
}