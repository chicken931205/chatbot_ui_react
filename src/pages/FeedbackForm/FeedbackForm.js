import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function FeedbackForm(props) {
    const closeFeedbackForm = props.closeFeedbackForm;
    const sendFeedback = props.sendFeedback;

    const [replyMessage, setReplyMessage] = useState('');

    const handleReplyChange = (e) => {
        setReplyMessage(e.target.value);
    }

    const handleSendClick = () => {
        sendFeedback(replyMessage);
    }

    return (
        <>
            <div className="absolute top-[150px] bg-white flex flex-col rounded-[10px] w-11/12 z-20 px-[15px] py-[15px]">
                <div className="w-full text-black font-bold text-[25px] text-left">
                    What can we do to improve this chatbot?
                </div>
                <textarea
                    onChange={handleReplyChange}
                    type="text"
                    placeholder="Type a reply..."
                    className="resize-none rounded-[5px] border-gray-500 border input-field text-black my-[12px] p-[5px] overflow-auto focus:outline-none text-[15px]"
                >
                </textarea> 
                <div className="w-full p-4">
                    <div className="w-full flex justify-end">
                    <button
                        className="rounded-[32px] border-2 border-[#673A95] text-[#673A95] px-3 py-2 mr-4"
                        onClick={closeFeedbackForm}
                    >
                        Close
                    </button>
                    <button
                        className="flex items-center w-[80px] rounded-[32px] border-2 border-[#673A95] text-[#fff] bg-[#673A95] px-3 py-2"
                        onClick={handleSendClick}
                    >
                        Send{" "}
                        <span className="flex items-center text-[22px] text-[#fff] w-[30px] h-[30px]">
                        <ChevronRightIcon />
                        </span>
                    </button>
                    </div>
                </div>
            </div>
            
        </>
    );
}