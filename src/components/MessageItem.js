import React, { useState, useRef } from "react";
import { MyContext } from "../pages/ChatPage/ChatPage";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { HandThumbDownIcon } from "@heroicons/react/24/outline";

const style = {
  listStyle: "none",
};

export default function MessageItem(props) {
  const message = props.message;
  const index = props.index;
  const symbol = props.symbol;
  const loading = props.loading;

  const [isActive, setIsActive] = useState(false);
  // console.log(`${index} index`);
  // console.log(`${JSON.stringify(message)} message`);

  return (
    <MyContext.Consumer>
      {({ setLater, handleThumbDownClick, showFeedbackForm }) => (
        <>
          <div
            key={index}
            style={style}
            className={`relative w-full flex flex-row items-end pb-2 text-[15px] ${message.role !== "AI" && "justify-end"
              } ${message.role === "AI" && 'message-anim'}`}
          >
            <div
              className={`rounded-md h-[32px] w-[34px] ${symbol == "add" && "bg-[#D1C4DF]"} mr-2`}
            ></div>
            <div
              onClick={() => setIsActive(true)}
              key={index}
              className={
                          `chat-message flex ${message.role != "AI" ? 
                            `text-[#673A95] p-2 mt-2 ${message?.isActive ? "bg-[#492B65] text-white" : "bg-[#EEE4FE]"}` 
                            : `${loading ? 'pt-3 pb-1 px-0' : 'bg-white p-4'} text-black`} 
                          rounded-[10px] w-fit`
                        }
            >
              <div>
                {message.role == 'AI' && typeof(message.content) === 'string' ?
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                : message.content}
              </div>
            </div>
          </div>
          {(message.role == 'AI' && !message.key && typeof(message.content) === 'string') &&
            <div onClick={() => handleThumbDownClick(index)}>
              <HandThumbDownIcon className="cursor-pointer bg-[#492B65] rounded-md h-[25px] w-[25px] ml-[50px] mb-[10px] p-0.5" />
            </div>
          }
        </>
        
      )}
    </MyContext.Consumer>
  );
}