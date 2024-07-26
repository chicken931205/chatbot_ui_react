import React, { useState, createContext, useEffect, useRef } from "react";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { v4 as uuidv4 } from "uuid";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import MessagesList from "../../components/MessagesList";
import Header from '../../components/Header';
import loadingSvg from '../../assets/images/loader.svg';
import Survey from "../Survey/Survey";
import SurveyIcon from '../../assets/images/survey.svg';
import FeedbackForm from "../FeedbackForm/FeedbackForm";
import FeedbackMessage from "../../components/FeedbackMessage";

export const MyContext = createContext();


let sessionId = null;

const credentials = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
};

const sigv4 = new SignatureV4({
  service: "lambda",
  region: process.env.REACT_APP_AWS_REGION,
  credentials,
  sha256: Sha256,
});

export default function ChatPage({ onClose }) {
  const [searchQuery, setSearchQuery] = useState();
  const [chatHistory, setChatHistory] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [header, setHeader] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(true);
  const [feedbackId, setFeedbackId] = useState('');
  const [feedbackIdToMessageIndex, setFeedbackIdToMessageIndex] = useState({});
  const messageListRef = useRef(null);

  const suggestions = [
    "Setting up in Abu Dhabi",
    "Projects and initiatives in Abu Dhabi",
    "Give advice on Fundraising",
    "Help with Business Development and Marketing",
    "Explain more about how you can help"
  ];

  const suggestionMessages = suggestions.map((item) => {
    return {
      content: (
        <div className="font-medium cursor-pointer" onClick={() => handleFetchResult(item)}>{item}</div>
      ),
      role: "Human",
      suggestionKey: "first-queries"
    };
  });

  const loading_message = {
    content: <img src={loadingSvg} alt="loading..." className="w-[50px] h-[25px]" />,
    role: 'AI',
    symbol: true,
    key: 'loading'
  }

  const setFocusInput = () => {
    const promptBox = document.querySelector('#promptBox');
    promptBox.focus();
  };

  const setLater = () => {
    setHeader(true);
    // remove messages where suggestionKey is onboarding
    setEnableAutoScroll(true);
    setChatHistory(ss => ss.filter(item => item.suggestionKey !== 'onboarding'));
    setChatHistory(ss => [
      ...ss,
      {
        content: (
          <div className="w-full h-full p-2 rounded-[8px]">
            Maybe later
          </div>
        ),
        isActive: true,
        role: "Human",
      },
      {
        content: (
          <div onClick={() => setLater()} className="w-full h-full">
            Alright, to tailor your responses you can later open the survey with
            the link below. All your conversation will be saved
            <a onClick={handleGoSurvey} className="block py-2 mt-3 text-[#673A95]">Open Survey</a>
          </div>
        ),
        role: "AI",
        key: 'default'
      },
    ]);

    setTimeout(() => {
      setChatHistory(ss => [
        ...ss,
        ...suggestionMessages,
      ]);
    }, 1900);
  };

  const chatData = [
    {
      content:
        "Are you okay with providing me more details about yourself to help tailor my responses more effectively?",
      role: "AI",
      key: 'default'
    },
  ];

  const handleGoSurvey = () => {
    setHeader(true);
    setShowSurvey(true);
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
  };

  useEffect(() => {
    sessionId = uuidv4();
    init();
  }, []);

  useEffect(() => {
    chatHistory.map((item, index) => {
      if (item.feedbackId) {
        setFeedbackIdToMessageIndex((ss) => {
          return {
            ...ss,
            [item.feedbackId] : index
          }
        });
      }
    });
    setEnableAutoScroll(true);
  }, [chatHistory]);

  const init = () => {
    setEnableAutoScroll(true);
    setChatHistory([
      {
        content:
          "Hi! 👋 I'm AI Business Advisor, I'm here to help answer your questions. Please remember not to include any sensitive data.",
        role: "AI",
        key: 'default'
      },
    ]);
    let delay = 1000;
    chatData.forEach((item) => {
      setTimeout(() => {
        setChatHistory((ss) => [...ss, item]);
      }, delay);
      delay += 500;
    });
    delay += 500;
    [
      [
        {
          content: <div className="font-medium cursor-pointer" onClick={handleGoSurvey}><span className="bg-white text-[#86B548] px-2 rounded-full mr-2">Recommended</span>Yes, open the survey!</div>,
          role: "Human",
          suggestionKey: "onboarding"
        },
        {
          content: <div className="font-medium cursor-pointer" onClick={() => setLater()}>Maybe later</div>,
          role: "Human",
          suggestionKey: "onboarding"
        },
      ],
      {
        content: <div className="font-medium cursor-pointer" onClick={() => setFocusInput()}>Type your own question</div>,
        role: "Human",
        suggestionKey: "onboarding"
      },
    ].forEach((item) => {
      setTimeout(() => {
        if (Array.isArray(item)) {
          setChatHistory((ss) => [...ss, ...item]);
        } else {
          setChatHistory((ss) => [...ss, item]);
        }
      }, delay);
      delay += 400;
    });
  };

  const sendThumbDown = async (message) => {
    // console.log(`${process.env.REACT_APP_LAMBDA_FEEDBACK_ENDPOINT_URL} url`);
    const apiUrl =  new URL(process.env.REACT_APP_LAMBDA_FEEDBACK_ENDPOINT_URL);

    let body = JSON.stringify({
      sessionId: sessionId,
      isNegativeFeedback : true,
      aiMessage : message,
    });

    let signed = await sigv4.sign({
      body,
      method: "POST",
      hostname: apiUrl.hostname,
      path: apiUrl.pathname.toString(),
      protocol: apiUrl.protocol,
      headers: {
        "Content-Type": "application/json",
        host: apiUrl.hostname,
      },
    });

    try {
      setIsApiLoading(true);

      let response = await fetch(apiUrl, {
        method: signed.method,
        headers: signed.headers,
        body: body,
        mode: "cors",
      });

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let aiResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        setIsApiLoading(false);
        if (done) break;
        aiResponse += value;
      }

      return aiResponse;
    } catch (err) {
      setIsApiLoading(false);
      return null;
    }
  }

  const sendFeedback = async (feedback) => {
    if (!feedback) {
      return;
    }

    // console.log(`${process.env.REACT_APP_LAMBDA_FEEDBACK_ENDPOINT_URL} url`);
    const apiUrl =  new URL(process.env.REACT_APP_LAMBDA_FEEDBACK_ENDPOINT_URL);

    if (!feedbackId) {
      return;
    }

    const feedbackMessageIndex = feedbackIdToMessageIndex[feedbackId];
    // console.log(`${feedbackMessageIndex} feedbackMessageIndex`);

    if ((chatHistory.length > feedbackMessageIndex+1)  && chatHistory[feedbackMessageIndex+1]?.key === "feedback-reply") {//ignore if feedback reply is already displayed
      return;
    }

    let body = JSON.stringify({
      feedbackId: feedbackId,
      userFeedback : feedback,
    });

    let signed = await sigv4.sign({
      body,
      method: "POST",
      hostname: apiUrl.hostname,
      path: apiUrl.pathname.toString(),
      protocol: apiUrl.protocol,
      headers: {
        "Content-Type": "application/json",
        host: apiUrl.hostname,
      },
    });

    try {
      setIsApiLoading(true);

      let response = await fetch(apiUrl, {
        method: signed.method,
        headers: signed.headers,
        body: body,
        mode: "cors",
      });

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let aiResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        setIsApiLoading(false);
        if (done) break;
        aiResponse += value;
      }

      
      
      if (feedbackMessageIndex !== chatHistory.length-1) {
        setEnableAutoScroll(false);
      } else {
        setEnableAutoScroll(true);
      }
      setChatHistory((prevHistory) => {
        return [
          ...prevHistory.slice(0, feedbackMessageIndex+1),
          {
            content: (
              <div className="relative w-full h-full p-2 rounded-[8px]">
                <div className="absolute top-[-20px] left-[13px] flex bg-[#fff] rounded-md px-2 py-1 text-[10px] text-black">
                  <span className="mr-1"><img src={SurveyIcon} alt="Survey Icon" /></span>Form
                </div>
                <p>{feedback}</p>
              </div>
            ),
            role: "Human",
            key: "feedback-reply",
            isActive: true,
          },
          {
            content: "Thank You for your feedback.",
            role: "AI",
            key: "feedback-reply"
          },
          ...prevHistory.slice(feedbackMessageIndex+1)
        ];
      });
      setShowFeedbackForm(false);
    } catch (err) {
      setIsApiLoading(false);
      return null;
    }

  }

  const streamData = async (query) => {
    // console.log(`${process.env.REACT_APP_LAMBDA_ENDPOINT_URL} streamData url`);
    const apiUrl = new URL(process.env.REACT_APP_LAMBDA_ENDPOINT_URL);

    let body = JSON.stringify({
      query: query,
      model: "gpt-4o",
      sessionId: sessionId,
    });

    let signed = await sigv4.sign({
      body,
      method: "POST",
      hostname: apiUrl.hostname,
      path: apiUrl.pathname.toString(),
      protocol: apiUrl.protocol,
      headers: {
        "Content-Type": "application/json",
        host: apiUrl.hostname,
      },
    });

    try {
      setIsApiLoading(true);

      let response = await fetch(apiUrl, {
        method: signed.method,
        headers: signed.headers,
        body: body,
        mode: "cors",
      });

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      let aiResponse = "";

      setEnableAutoScroll(true);
      setChatHistory(ss => ss.slice(0, -1));
      while (true) {
        const { value, done } = await reader.read();
        setIsApiLoading(false);
        if (done) break;
        aiResponse += value;

        setChatHistory((prevHistory) => {
          const lastMessage = prevHistory[prevHistory.length - 1];
          if (lastMessage.role === "AI") {
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + value,
            };
            return [...prevHistory.slice(0, -1), updatedMessage];
          } else {
            return [...prevHistory, { role: "AI", content: value }];
          }
        });

        // Scroll to the bottom after each update
        setTimeout(() => {
          if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
          }
        }, 0);
      }
      return aiResponse;
    } catch (err) {
      setIsApiLoading(false);
      return null;
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleKeyword(true);
    }
  };

  const handleKeyword = async (keyprocess) => {
    if (searchQuery === "" || !searchQuery) {
      alert("Please enter correct information");
      return;
    }
    if (!header) setHeader(true);
    setSearchQuery("");

    let cnt = 0;
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].role === 'AI') break;
      if (chatHistory[i].role === 'Human') cnt++;
    }

    setEnableAutoScroll(true);
    if (cnt) setChatHistory(ss => ss.slice(0, -cnt));
    setChatHistory(ss => [
      ...ss,
      {
        content: <div className="w-full h-full p-2 rounded-[8px] active">{searchQuery}</div>,
        role: 'Human',
        isActive: true,
      },
      loading_message,
    ]);

    await streamData(searchQuery);
  };

  const clickHelpedThanks = async () => {
    setChatHistory(ss => ss.slice(0, -2));
    setChatHistory(ss => [
      ...ss,
      {
        content: <div className="cursor-pointer w-full h-full p-2 rounded-[8px] active">That helped! Thanks</div>,
        role: 'Human',
        isActive: true,
      },
      loading_message,
    ]);

    await streamData("That helped! Thanks");
  }

  const clickExplainMore = async () => {
    setChatHistory(ss => ss.slice(0, -2));
    setChatHistory(ss => [
      ...ss,
      {
        content: <div className="cursor-pointer w-full h-full p-2 rounded-[8px] active">Explain more</div>,
        role: 'Human',
        isActive: true,
      },
      loading_message,
    ]);

    await streamData("Explain more");
  }

  const handleFetchResult = async (msg) => {
    setSearchQuery("");
    setEnableAutoScroll(true);
    setIsChatLoading(true);

    // remove messages where suggestionKey is first-queries
    setChatHistory(ss => ss.filter(item => item.suggestionKey !== 'first-queries'));

    setChatHistory(ss => [
      ...ss,
      {
        content: <div className="w-full h-full p-2 rounded-[8px] active">{msg}</div>,
        role: 'Human',
        isActive: true,
      },
      loading_message,
    ]);

    const result = await streamData(msg);

    let delay = result?.length > 300 ? 1800 : 1200;
    let step = result?.length > 300 ? 1800 : 1200;
    const messages = [
      {
        content: "Was this helpful?",
        role: 'AI',
        key: 'AI-reply'
      },
    ];

    messages.forEach((item) => {
      setTimeout(() => {
        setChatHistory((ss) => [...ss, item]);
      }, delay);
      delay += step;
    });
    setTimeout(() => {
      setChatHistory(ss => [
        ...ss,
        {
          content: <div className="cursor-pointer font-medium" onClick={clickHelpedThanks}>That helped! Thanks</div>,
          role: 'Human',
          key: 'AI-reply'
        },
        {
          content: <div className="cursor-pointer font-medium" onClick={clickExplainMore}>Explain more</div>,
          role: 'Human',
          key: 'AI-reply'
        },
      ]);
      setIsChatLoading(false);
    }, delay);
  };

  const handleClearHistory = () => {
    sessionId = uuidv4();
    init();
  };

  const handleSurvey = async (data) => {
    setEnableAutoScroll(true);
    // remove messages where suggestionKey is onboarding
    setChatHistory(ss => ss.filter(item => item.suggestionKey !== 'onboarding'));

    setChatHistory(ss => [
      ...ss,
      {
        content: <div className="w-full h-full p-2 rounded-[8px]">Yes, open the survey!</div>,
        role: "Human",
        isActive: true,
      },
      {
        content: (
          <div className="relative w-full h-full p-2 rounded-[8px]">
            <div className="absolute top-[-20px] left-[13px] flex bg-[#fff] rounded-md px-2 py-1 text-[10px] text-black">
              <span className="mr-1"><img src={SurveyIcon} alt="Survey Icon" /></span>Form
            </div>
            <p>Funded/planning to fund: {data[2].funding}</p>
            <p>Sector: {data[1].name}</p>
            <p>Business: {data[0].businessExp ? 'Yes' : 'No'}</p>
          </div>
        ),
        role: 'Human',
        isActive: true,
      },
    ]);

    let delay = 500;
    const sampleAws = [
      {
        content: "Thank you!",
        role: 'AI',
        key: 'default'
      },
      {
        content: "Now, what would you like to chat about? Type your question or use suggestions below:",
        role: 'AI',
        key: 'default'
      },
    ];
    sampleAws.forEach((item) => {
      setTimeout(() => {
        setChatHistory((ss) => [...ss, item]);
      }, delay);
      delay += 600;
    });

    setTimeout(() => {
      setChatHistory(ss => [
        ...ss,
        ...suggestionMessages,
      ]);
    }, delay);
  };

  const openFeedbackForm = (feedbackId) => {
    // console.log(`${feedbackId} feedbackId`);
    setFeedbackId(feedbackId);
    setHeader(true);
    setShowFeedbackForm(true);
  };

  const closeFeedbackForm = () => {
    setShowFeedbackForm(false);
  }

  const handleThumbDownClick = async (messageIndex) => {
    // console.log(`clicked thumb down ${messageIndex}`);
    if (isApiLoading || isChatLoading) {
      return;
    }
    if ((chatHistory.length > messageIndex+1)  && chatHistory[messageIndex+1]?.key === "feedback") {//ignore if message for feedback form is already displayed
      return;
    }

    if (messageIndex !== chatHistory.length-1) {
      setEnableAutoScroll(false);
    } else {
      setEnableAutoScroll(true);
    }
    //remove AI reply messages
    setChatHistory(ss => ss.filter(item => item?.key !== 'AI-reply'));
    //display loding message
    setChatHistory((prevHistory) => {
      return [
        ...prevHistory.slice(0, messageIndex+1),
        loading_message,
        ...prevHistory.slice(messageIndex+1)
      ];
    });
    
    const message = chatHistory[messageIndex].content;
    // console.log(`${message} message`);
    
    let response = await sendThumbDown(message);
    response = JSON.parse(response);
    // console.log(`${response} feedbackId`);
    if (!response.feedbackId) {
      return;
    }

    if (messageIndex !== chatHistory.length-1) {
      setEnableAutoScroll(false);
    } else {
      setEnableAutoScroll(true);
    }
    //remove loading message
    setChatHistory(ss => ss.filter(item => item?.key !== 'loading'));

    const feedback_message = {
      content: (
        <FeedbackMessage 
          openFeedbackForm={openFeedbackForm} 
          feedbackId={response.feedbackId} 
        />
      ),
      role: "AI",
      key: "feedback",
      feedbackId: response.feedbackId
    };

    if (messageIndex !== chatHistory.length-1) {
      setEnableAutoScroll(false);
    } else {
      setEnableAutoScroll(true);
    }
    setChatHistory((prevHistory) => {
      return [
        ...prevHistory.slice(0, messageIndex+1),
        feedback_message,
        ...prevHistory.slice(messageIndex+1)
      ];
    });
  };

  return (
    <div className="relative h-full app bg-[#fff] text-[15px] sf-pro-display">
      <div className="absolute top-0 left-0 right-0 z-10">
        <Header clearHistory={handleClearHistory} title={header} onClose={onClose} />
      </div>
      {
        showFeedbackForm && 
          <FeedbackForm
            closeFeedbackForm={closeFeedbackForm}
            sendFeedback={sendFeedback}
          />
      }
      {showSurvey ? (
        <Survey
          clearHistory={handleClearHistory}
          closeModal={handleSurveyClose}
          setSurveyInfo={(data) => handleSurvey(data)}
        />
      ) : (
        <>
          <div className={`block sf-pro-display h-full overflow-y-auto ${header ? 'pt-[100px] pb-[100px]' : 'pt-[230px] pb-[100px]'}`}>
            <MyContext.Provider value={{ setLater, handleThumbDownClick, showFeedbackForm }}>
              <MessagesList
                // ref={messageListRef}
                setLater={setLater}
                messages={chatHistory}
                enableAutoScroll={enableAutoScroll}
              />
            </MyContext.Provider>
            {isApiLoading && <div className="chat-message ai">...</div>}
          </div>
          <div className={`absolute font-regular sf-pro-display ${showFeedbackForm && "bg-opacity-20"} bg-white bottom-0 w-full h-[100px] border-t-[1px]`}>
            <div className="relative flex items-center w-full h-full border-l-[1.25rem] border-b-[32px] border-r-0 border-white/[.2]">
              <PaperAirplaneIcon onClick={() => handleKeyword()} className="absolute text-gray-400 w-[30px] right-[20px] active:text-gray-700" />
              <textarea
                id="promptBox"
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply..."
                className={`${showFeedbackForm && "bg-white/[.2]"} resize-none input-field text-black overflow-auto w-full h-full focus:outline-none pt-[25px] pr-[80px] text-[15px]`}
              ></textarea>
            </div>
          </div>
          { 
            showFeedbackForm && (
              <div className="absolute bg-black/[.2] w-full h-full z-15 pointer-events-auto">
              </div>
            )
          }
        </>
      )}
    </div>
  );
}