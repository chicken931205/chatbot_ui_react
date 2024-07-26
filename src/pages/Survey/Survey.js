import React, { useState } from "react";

import Header from "../../components/Header";
// import { Route, Routes, useNavigate } from "react-router-dom";
import Exp from "./Exp";
import Hope from "./Hope";

function isSafari() {
  const userAgent = window.navigator.userAgent;
  const vendor = window.navigator.vendor;

  // Check if the browser is Safari
  return /Safari/.test(userAgent) && /Apple Computer/.test(vendor) && !/CriOS/.test(userAgent) && !/FxiOS/.test(userAgent);
}

export default function Survey({ closeModal, setSurveyInfo, clearHistory }) {

  const [info, setInfo] = useState([])
  const [step, setStep] = useState(1);

  const handleComplete = (data) => {
    console.log(info)
    closeModal()
    setSurveyInfo([...info, ...data])
  }

  const isSafariFlag = isSafari()

  return (<div className="relative app min-h-[95vh] max-h-[100vh] h-[100vh] text-[15px] sf-pro-display">
    <div className={`relative ${ isSafariFlag ? 'mt-[100px] pb-[60px]' : 'mt-[100px]' } flex flex-col grow py-5 text-left w-full h-fit mt-4 px-[24px]`}>
      { step == 1 && <Exp addInfo={(s) => setInfo(info => info.concat(s))} goToNext={setStep} /> }
      { step == 2 && <Hope addInfo={(s) => setInfo(info => info.concat(s))} completeSurvey={handleComplete} /> }
    </div>
  </div>)
}