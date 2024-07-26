import MessageItem from "./MessageItem";
import React, { useLayoutEffect, useRef } from "react";
import { MyContext } from "../pages/ChatPage/ChatPage";

export default function MessagesList(props) {
  const messages = props.messages;
  const enableAutoScroll = props.enableAutoScroll;

  const messageListRef = useRef(null);

  useLayoutEffect(() => {
    // console.log(`${enableAutoScroll} enableAutoScroll`);
    // console.log(JSON.stringify(messages));
    // console.log(`${messages.length} messagesCount`);
    scrollToBottom();
  }, [messages]);



  const scrollToBottom = () => {
    if (messageListRef.current && enableAutoScroll) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  return (
    <div
      className="msg-list flex flex-col justify-end w-full bg-gray-100"
      style={{
        height: "100%",
      }}
    >
      <div
        id="msgList"
        className="h-fit px-4 py-5 overflow-y-auto"
        ref={messageListRef}
      >
        {messages.map((message, index) => {
          const symbol = (messages.length - 1 === index && message.role === "AI") ||
          (message.role === "AI" && messages[index + 1]?.role !== "AI")
            ? "add" : "remove";

          return (
            <MyContext.Consumer key={`message-${index}`}>
              {({ setLater }) => (
                <MessageItem
                  key={index}
                  index={index}
                  symbol={symbol}
                  loading={message?.symbol ? true : false}
                  message={message}
                  role={message.role}
                />
              )}
            </MyContext.Consumer>
          );
        })}
      </div>
    </div>
  );
}